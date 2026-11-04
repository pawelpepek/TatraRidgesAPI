import { useEffect, useId, useMemo, useRef, useState } from "react"
import { useSelector } from "react-redux"
import useAppDispatch from "../../../hooks/use-app-dispatch"
import { centerActions } from "../../../store/center-slice"
import { pointsActions } from "../../../store/map-slice"
import { MatchRange, searchPoints } from "../../../store/point-search"
import StoreType from "../../../store/store-types"
import {
	otherSvg,
	PASS,
	passSvg,
	PEAK,
	peakSvg,
} from "../../ridge-map/basics/pointSymbols"
import { MountainPoint } from "../../types"
import classes from "./PointSearch.module.css"

export type PointEnd = "from" | "to"

interface PointSearchProps {
	end: PointEnd
	point: MountainPoint
	withButton?: boolean
}

const ICON_COLOR = "#3e4c59"

const iconContent = (pointTypeId: number) =>
	pointTypeId === PEAK
		? peakSvg(ICON_COLOR)
		: pointTypeId === PASS
			? passSvg(ICON_COLOR)
			: otherSvg(ICON_COLOR)

const Highlighted: React.FC<{ text: string; ranges: MatchRange[] }> = ({
	text,
	ranges,
}) => {
	const parts: React.ReactNode[] = []
	let position = 0
	ranges.forEach(([start, end], i) => {
		parts.push(text.slice(position, start))
		parts.push(<mark key={i}>{text.slice(start, end)}</mark>)
		position = end
	})
	parts.push(text.slice(position))
	return <>{parts}</>
}

// The name of the chosen point, which is also a field to find a point by
// name: typing shows the fitting points below.
const PointSearch: React.FC<PointSearchProps> = props => {
	const dispatch = useAppDispatch()
	const points = useSelector((state: StoreType) => state.map.points)
	const pointsOk = useSelector((state: StoreType) => state.map.pointsOk)

	const inputRef = useRef<HTMLInputElement>(null)
	const listId = useId()
	// null while the field is not being edited
	const [query, setQuery] = useState<string | null>(null)
	const [active, setActive] = useState(0)

	const name = props.point.name ?? ""
	const open = query !== null && query.trim() !== "" && query !== name

	const matches = useMemo(
		() => (open ? searchPoints(points, query) : []),
		[open, points, query]
	)

	const optionId = (index: number) => `${listId}-${index}`

	useEffect(() => {
		if (open) {
			document
				.getElementById(optionId(active))
				?.scrollIntoView?.({ block: "nearest" })
		}
	}, [active, open])

	const choose = (point: MountainPoint) => {
		dispatch(pointsActions.setPoint({ end: props.end, point }))
		dispatch(
			centerActions.requestPointFocus([
				{ latitude: point.latitude, longitude: point.longitude },
			])
		)
		setQuery(null)
		inputRef.current?.blur()
	}

	const focusHandler = (e: React.FocusEvent<HTMLInputElement>) => {
		setQuery(name)
		setActive(0)
		e.target.select()
	}

	const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
		setQuery(e.target.value)
		setActive(0)
	}

	const keyDownHandler = (e: React.KeyboardEvent<HTMLInputElement>) => {
		const count = matches.length
		if (e.key === "ArrowDown" && open && count > 0) {
			e.preventDefault()
			setActive((active + 1) % count)
		} else if (e.key === "ArrowUp" && open && count > 0) {
			e.preventDefault()
			setActive((active - 1 + count) % count)
		} else if (e.key === "Enter" && open && count > 0) {
			e.preventDefault()
			choose(matches[active].point)
		} else if (e.key === "Escape") {
			e.preventDefault()
			if (open) {
				setQuery(name)
				requestAnimationFrame(() => inputRef.current?.select())
			} else {
				inputRef.current?.blur()
			}
		}
	}

	let className = classes.info
	if (props.withButton) {
		className += " " + classes["point-with-delete"]
	}

	return (
		<section className={className} onClick={() => inputRef.current?.focus()}>
			<input
				ref={inputRef}
				className={classes.name}
				type='text'
				value={query ?? name}
				placeholder='Wpisz nazwę lub kliknij na mapie'
				aria-label={props.end === "from" ? "Punkt początkowy" : "Punkt końcowy"}
				role='combobox'
				aria-autocomplete='list'
				aria-expanded={open}
				aria-controls={listId}
				aria-activedescendant={
					open && matches.length > 0 ? optionId(active) : undefined
				}
				autoComplete='off'
				spellCheck={false}
				onFocus={focusHandler}
				onBlur={() => setQuery(null)}
				onChange={changeHandler}
				onKeyDown={keyDownHandler}
			/>
			{props.point.id >= 0 && props.point.evaluation > 0 && !open && (
				<p className={classes.evaluation}>{props.point.evaluation} m n.p.m.</p>
			)}
			{open && (
				<ul
					id={listId}
					role='listbox'
					className={classes.suggestions}
					// Keeps the focus in the field, so a click can choose.
					onMouseDown={e => e.preventDefault()}>
					{matches.map((m, i) => (
						<li
							key={m.point.id}
							id={optionId(i)}
							role='option'
							aria-selected={i === active}
							className={
								i === active
									? `${classes.option} ${classes.active}`
									: classes.option
							}
							onMouseMove={() => i !== active && setActive(i)}
							onClick={e => {
								e.stopPropagation()
								choose(m.point)
							}}>
							<svg
								className={classes.icon}
								viewBox='0 0 20 20'
								aria-hidden='true'
								dangerouslySetInnerHTML={{
									__html: iconContent(m.point.pointTypeId),
								}}
							/>
							<span className={classes.names}>
								<span className={classes["option-name"]}>
									<Highlighted text={m.point.name} ranges={m.nameRanges} />
								</span>
								{m.point.alternativeName && (
									<span className={classes["option-alternative"]}>
										<Highlighted
											text={m.point.alternativeName}
											ranges={m.alternativeRanges}
										/>
									</span>
								)}
							</span>
							{m.point.evaluation > 0 && (
								<span className={classes["option-evaluation"]}>
									{m.point.evaluation} m
								</span>
							)}
						</li>
					))}
					{matches.length === 0 && (
						<li className={classes.empty}>
							{pointsOk
								? "Nie ma punktu o takiej nazwie"
								: "Wczytywanie punktów…"}
						</li>
					)}
				</ul>
			)}
		</section>
	)
}

export default PointSearch
