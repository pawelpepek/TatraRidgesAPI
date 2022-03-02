export const fillObject = (obj, propertyName, value) => {
	obj[propertyName] = value

    // console.log("object", obj)
}

export const objectIsFilled = (obj, exceptions) => {
	for (const key in obj) {
		if (Object.hasOwnProperty.call(obj, key)) {
			const element = obj[key]

			if (!Array.isArray(exceptions) || !exceptions.includes(key)) {
				if (typeof element === "number" && element <= 0) {
                    console.log(key,"number",element)
					return false
				}
				if (element == null) {
                    console.log(key,"null")
					return false
				}
				if (element === "") {
                    console.log(key,"empty")
					return false
				}
			}
		}
	}
	return true
}

export const getObjectListValues=(obj, exception)=>
{
    const result=new Map()
    for (const key in obj) {
		if (Object.hasOwnProperty.call(obj, key) && key!==exception) {
			const element = obj[key]
            result.set(key,element)
        }
    }
    return result
}

export const getPropertyValue=(obj, propertyName)=>obj[propertyName] 