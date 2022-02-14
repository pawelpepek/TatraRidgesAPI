import { useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { uiActions } from "../../../store/ui-slice"
import RoundButton from "../../ui/RoundButton"
import PanelHeader from "../PanelHeader"
import loginIcon from "../../img/login.svg"
import { loginFormActions } from "../../../store/login-form.slice"

import classes from "./AuthForm.module.css"
import StoreType from "../../../store/store-types"

const AuthForm: React.FC = () => {
	const emailRef = useRef<HTMLInputElement>(null)
	const passwordRef = useRef<HTMLInputElement>(null)

	const formIsValid= useSelector((state: StoreType) => state.loginForm.isFilled)

	const dispatch = useDispatch()

	const submitHandler = (e: { preventDefault: () => void }) => {
		e.preventDefault()

		const enteredEmail = emailRef.current
		const enteredPassword = passwordRef.current

		console.log(enteredEmail, enteredPassword)

		dispatch(uiActions.setLogged(true))
		dispatch(uiActions.setPanelVersion("admin"))
	}

	const onChange = (e: React.FormEvent<HTMLInputElement>) => {
		const value = e.currentTarget.value

		if (e.currentTarget.type === "email") {
			dispatch(loginFormActions.setEmail(value))
		} else {
			dispatch(loginFormActions.setPassword(value))
		}
	}

	return (
		<>
			<PanelHeader text='Logowanie' />
			<form onSubmit={submitHandler} className={classes["auth-panel"]}>
				<div className={classes.control}>
					<label htmlFor='email'>Email</label>
					<input type='email' id='email' required onChange={onChange} />
				</div>
				<div className={classes.control}>
					<label htmlFor='password'>Hasło</label>
					<input type='password' id='password' required onChange={onChange} />
				</div>
				<div className={classes["panel-button"]}>
					<RoundButton
						className={classes.button}
						alt='Zaloguj'
						imageSrc={loginIcon}
						disabled={!formIsValid}
					/>
				</div>
			</form>
		</>
	)
}

export default AuthForm
