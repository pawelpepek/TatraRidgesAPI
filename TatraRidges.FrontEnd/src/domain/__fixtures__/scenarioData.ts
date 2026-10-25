import { TatraData } from "../types"
import scenarios from "./scenarios.json"
import golden from "./csharp-golden.json"

// scenarios.json is the shared input; csharp-golden.json is what the original C# code
// (TatraRidgesModel) returned for it. It was generated once with a throwaway console
// app before the .NET code was removed and must not be edited by hand.

export const scenario = scenarios

export const data: TatraData = {
	points: scenarios.points,
	ridges: scenarios.ridges,
	params: scenarios.params,
}

export const csharpGolden = golden as any

// C# decimals vs JS doubles: compare numbers with 9 decimal places.
export const roundNumbers = (value: unknown): unknown => {
	if (typeof value === "number") {
		return Math.round(value * 1e9) / 1e9
	}
	if (Array.isArray(value)) {
		return value.map(roundNumbers)
	}
	if (value !== null && typeof value === "object") {
		return Object.fromEntries(
			Object.entries(value).map(([key, v]) => [key, roundNumbers(v)])
		)
	}
	return value
}
