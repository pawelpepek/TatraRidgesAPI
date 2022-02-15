const calculateReminingTime = (expirationTime: Date) => {
	const currentTime = new Date().getTime()
	const adjExpirationTime = expirationTime.getTime()
	const remainingDuration = adjExpirationTime - currentTime

	return remainingDuration
}

export const isLoginOk = () => {
	const token = localStorage.getItem("token")
	const expirationTime = localStorage.getItem("expirationTime")

	if (token === null || expirationTime === null) {
		return false
	} else {
		const reminingTime = calculateReminingTime(new Date(+expirationTime))
		return reminingTime > 60000
	}
}
export const loginHandler = (token: string) => {
	localStorage.setItem("token", token)

	const currentTime = new Date().getTime()
	const expiryTime = currentTime + 30 * 1000 * 60 * 69 * 24

	localStorage.setItem("expirationTime", expiryTime.toString())
}

export const clearLogin = () => {
	localStorage.removeItem("token")
	localStorage.removeItem("expirationTime")
}
