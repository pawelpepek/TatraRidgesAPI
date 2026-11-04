import { MountainPoint } from "../components/types"

// [start, end) of a matched part of a name.
export type MatchRange = [number, number]

export interface PointMatch {
	point: MountainPoint
	nameRanges: MatchRange[]
	alternativeRanges: MatchRange[]
}

// Lower case without diacritics, one character for one character, so the
// positions of a match in the normalized text are the same in the original.
export const normalizeSearchText = (text: string) =>
	Array.from(text, c => {
		if (c === "ł" || c === "Ł") {
			return "l"
		}
		const n = c.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase()
		return n.length === 1 ? n : c.toLowerCase()
	}).join("")

const isWordStart = (text: string, index: number) =>
	index === 0 || /[\s\-–(/,.]/.test(text[index - 1])

// Where `token` starts a word of `text`, else -1.
const wordStart = (text: string, token: string) => {
	let index = text.indexOf(token)
	while (index >= 0) {
		if (isWordStart(text, index)) {
			return index
		}
		index = text.indexOf(token, index + 1)
	}
	return -1
}

interface Ranked extends PointMatch {
	rank: number
}

// Every word of the query has to start a word of the name or the alternative
// name; the whole query found as one piece ranks higher, at the start of the
// name the highest.
const matchPoint = (point: MountainPoint, query: string, tokens: string[]): Ranked | undefined => {
	const name = normalizeSearchText(point.name ?? "")
	const alternative = normalizeSearchText(point.alternativeName ?? "")

	const whole = (text: string, rankStart: number, rankWord: number, rankInside: number) => {
		const index = text.indexOf(query)
		if (index < 0) {
			return undefined
		}
		const range: MatchRange[] = [[index, index + query.length]]
		if (index === 0) {
			return { rank: rankStart, range }
		}
		const word = wordStart(text, query)
		if (word >= 0) {
			return { rank: rankWord, range: [[word, word + query.length]] as MatchRange[] }
		}
		return { rank: rankInside, range }
	}

	const inName = whole(name, 0, 1, 4)
	const inAlternative = whole(alternative, 2, 3, 5)
	const best = [inName, inAlternative]
		.filter(m => m !== undefined)
		.sort((a, b) => a.rank - b.rank)[0]
	if (best !== undefined) {
		return {
			point,
			rank: best.rank,
			nameRanges: best === inName ? best.range : [],
			alternativeRanges: best === inAlternative ? best.range : [],
		}
	}

	if (tokens.length < 2) {
		return undefined
	}
	const nameRanges: MatchRange[] = []
	const alternativeRanges: MatchRange[] = []
	for (const token of tokens) {
		const n = wordStart(name, token)
		if (n >= 0) {
			nameRanges.push([n, n + token.length])
			continue
		}
		const a = wordStart(alternative, token)
		if (a >= 0) {
			alternativeRanges.push([a, a + token.length])
			continue
		}
		return undefined
	}
	return { point, rank: 6, nameRanges, alternativeRanges }
}

const collator = new Intl.Collator("pl")

// Points whose name or alternative name fits the typed text, best first.
export const searchPoints = (
	points: MountainPoint[],
	text: string,
	limit = 8
): PointMatch[] => {
	const query = normalizeSearchText(text).replace(/\s+/g, " ").trim()
	if (query === "") {
		return []
	}
	const tokens = query.split(" ")
	return points
		.map(p => matchPoint(p, query, tokens))
		.filter(m => m !== undefined)
		.sort(
			(a, b) =>
				a.rank - b.rank ||
				collator.compare(a.point.name, b.point.name) ||
				(b.point.evaluation ?? 0) - (a.point.evaluation ?? 0)
		)
		.slice(0, limit)
		.map(({ point, nameRanges, alternativeRanges }) => ({
			point,
			nameRanges: sortRanges(nameRanges),
			alternativeRanges: sortRanges(alternativeRanges),
		}))
}

// Sorted and merged, ready to cut the text into pieces.
const sortRanges = (ranges: MatchRange[]) => {
	const sorted = [...ranges].sort((a, b) => a[0] - b[0])
	const merged: MatchRange[] = []
	for (const r of sorted) {
		const last = merged[merged.length - 1]
		if (last !== undefined && r[0] <= last[1]) {
			last[1] = Math.max(last[1], r[1])
		} else {
			merged.push([r[0], r[1]])
		}
	}
	return merged
}
