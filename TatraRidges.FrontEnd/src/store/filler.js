export const fillObject = (obj, propertyName, value) => {
	obj[propertyName] = value
}

export const objectIsFilled = (obj, exceptions) => {
	for (const key in obj) {
		if (Object.hasOwnProperty.call(obj, key)) {
			const element = obj[key]

			if (!Array.isArray(exceptions) || !exceptions.includes(key)) {
				if (typeof element === "number" && element <= 0) {
					return false
				}
				if (element == null) {
					return false
				}
				if (element === "") {
					return false
				}
			}
		}
	}
	return true
}

export const getObjectListValues = (obj, exception) => {
	const result = new Map()
	for (const key in obj) {
		if (Object.hasOwnProperty.call(obj, key) && key !== exception) {
			const element = obj[key]
			result.set(key, element)
		}
	}
	return result
}

export const getPropertyValue = (obj, propertyName) => obj[propertyName]
