import {
	DifficultyData,
	DifficultyDetailData,
	DifficultyDto,
	Params,
} from "./types"

// Detail 0 is "", 1 is "+", 2 is "-".
export const getValueForDifficulty = (
	difficulty: DifficultyData,
	detail: DifficultyDetailData
) => {
	const detailValue = detail.id < 2 ? detail.id * 0.333 : -0.333
	return Math.round((difficulty.id + detailValue) * 1000) / 1000
}

export const getDifficultyText = (
	difficulty: DifficultyData,
	detail: DifficultyDetailData
) => difficulty.text + detail.sign

const getDifficultyOptions = (
	difficulty: DifficultyData,
	details: DifficultyDetailData[]
): DifficultyDto[] =>
	details.map(detail => ({
		text: getDifficultyText(difficulty, detail),
		value: getValueForDifficulty(difficulty, detail),
	}))

// "0" and grades above "II" come with "+" and "-" variants, "I" and "II" do not.
export const getAllDifficulties = (params: Params): DifficultyDto[] => {
	const { difficulties, difficultyDetails } = params

	const noDifficulties = difficulties
		.filter(d => d.id === 0)
		.flatMap(d => getDifficultyOptions(d, difficultyDetails))

	const littleDifficulties = difficulties
		.filter(d => d.id === 1 || d.id === 2)
		.map(d => ({ text: d.text, value: d.id }))

	const greaterDifficulties = difficulties
		.filter(d => d.id > 2)
		.flatMap(d => getDifficultyOptions(d, difficultyDetails))

	return [
		...noDifficulties,
		...littleDifficulties,
		...greaterDifficulties,
	].sort((a, b) => a.value - b.value)
}

// Built once per data set: every route summary looks up two difficulties.
const difficultiesByParams = new WeakMap<Params, DifficultyDto[]>()

export const getClosestDifficulty = (
	params: Params,
	value: number
): DifficultyDto => {
	let all = difficultiesByParams.get(params)
	if (all === undefined) {
		all = getAllDifficulties(params)
		difficultiesByParams.set(params, all)
	}
	const closest = all.reduce((closest, d) =>
		Math.abs(d.value - value) < Math.abs(closest.value - value) ? d : closest
	)
	return { ...closest }
}
