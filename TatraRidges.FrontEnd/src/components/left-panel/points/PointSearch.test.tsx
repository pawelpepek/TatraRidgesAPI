import { configureStore } from "@reduxjs/toolkit"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { Provider } from "react-redux"
import centerReducer from "../../../store/center-slice"
import mapReducer, { pointsActions } from "../../../store/map-slice"
import { MountainPoint } from "../../types"
import PointsLabels from "./PointsLabels"

const point = (id: number, name: string, evaluation: number): MountainPoint => ({
	id,
	name,
	evaluation,
	pointTypeId: 1,
	latitude: 49.2,
	longitude: 20 + id / 100,
})

const swinica = point(1, "Świnica", 2301)
const zawrat = point(2, "Zawrat", 2159)
const kozi = point(3, "Kozi Wierch", 2291)

const setup = () => {
	const store = configureStore({
		reducer: { map: mapReducer, center: centerReducer },
	})
	store.dispatch(pointsActions.replacePoints({ data: [swinica, zawrat, kozi] }))
	render(
		<Provider store={store}>
			<PointsLabels deleteVisible={false} />
		</Provider>
	)
	const [from, to] = screen.getAllByRole("combobox")
	return { store, from, to, user: userEvent.setup() }
}

describe("PointSearch", () => {
	test("shows the points fitting the typed text", async () => {
		const { to, user } = setup()
		await user.type(to, "wierch")
		const options = screen.getAllByRole("option")
		expect(options).toHaveLength(1)
		expect(options[0].textContent).toContain("Kozi Wierch")
		expect(options[0].textContent).toContain("2291 m")
	})

	test("says when no point fits", async () => {
		const { from, user } = setup()
		await user.type(from, "xyz")
		expect(screen.getByRole("listbox").textContent).toContain(
			"Nie ma punktu o takiej nazwie"
		)
	})

	test("a click on a suggestion sets that end and moves the map", async () => {
		const { store, from, user } = setup()
		await user.type(from, "swi")
		await user.click(screen.getByRole("option"))
		expect(store.getState().map.pointFrom.id).toBe(1)
		expect(store.getState().map.pointTo.id).toBeUndefined()
		expect(store.getState().center.pointFocus.request).toBe(1)
		expect(store.getState().center.pointFocus.points).toEqual([
			{ latitude: 49.2, longitude: 20.01 },
		])
		expect(screen.queryByRole("listbox")).toBeNull()
		expect(from).toHaveProperty("value", "Świnica")
		expect(screen.getByText("2301 m n.p.m.")).toBeTruthy()
	})

	test("a point without a known height shows no height", async () => {
		const { store } = setup()
		store.dispatch(
			pointsActions.setPoint({ end: "from", point: point(4, "Turnia", 0) })
		)
		expect(await screen.findByDisplayValue("Turnia")).toBeTruthy()
		expect(screen.queryByText(/n\.p\.m/)).toBeNull()
	})

	test("arrows and Enter choose a suggestion", async () => {
		const { store, to, user } = setup()
		await user.type(to, "w")
		expect(screen.getAllByRole("option")).toHaveLength(3)
		await user.keyboard("{ArrowDown}{ArrowDown}{Enter}")
		expect(store.getState().map.pointTo.id).toBe(2)
	})

	test("Escape and leaving the field bring back the chosen name", async () => {
		const { store, to, user } = setup()
		store.dispatch(pointsActions.setPoint({ end: "to", point: zawrat }))
		await user.click(to)
		await user.keyboard("koz")
		expect(screen.getByRole("listbox")).toBeDefined()
		await user.keyboard("{Escape}")
		expect(screen.queryByRole("listbox")).toBeNull()
		expect(to).toHaveProperty("value", "Zawrat")
		await user.keyboard("koz")
		await user.tab()
		expect(to).toHaveProperty("value", "Zawrat")
		expect(store.getState().map.pointTo.id).toBe(2)
	})
})

describe("setPoint", () => {
	const state = (from: MountainPoint, to: MountainPoint) => ({
		...mapReducer(undefined, { type: "" }),
		pointFrom: from,
		pointTo: to,
	})

	test("replaces one end", () => {
		const next = mapReducer(
			state(swinica, zawrat),
			pointsActions.setPoint({ end: "from", point: kozi })
		)
		expect([next.pointFrom.id, next.pointTo.id]).toEqual([3, 2])
	})

	test("swaps the ends when the other end's point is picked", () => {
		const next = mapReducer(
			state(swinica, zawrat),
			pointsActions.setPoint({ end: "to", point: swinica })
		)
		expect([next.pointFrom.id, next.pointTo.id]).toEqual([2, 1])
	})
})
