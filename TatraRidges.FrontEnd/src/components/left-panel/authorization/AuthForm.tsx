import { useDispatch, useSelector } from "react-redux"
import RoundButton from "../../ui/RoundButton"
import PanelHeader from "../PanelHeader"
import loginIcon from "../../img/login.svg"
import { loginFormActions } from "../../../store/login-form.slice"
import {login}from "../../../store/user-actions"


import classes from "./AuthForm.module.css"
import StoreType from "../../../store/store-types"
import Tooltip from "../../ui/Tooltip"

const AuthForm: React.FC = () => {

	const formIsValid= useSelector((state: StoreType) => state.loginForm.isFilled)

	const enteredEmail = useSelector((state: StoreType) => state.loginForm.email)
	const enteredPassword = useSelector((state: StoreType) => state.loginForm.password)

	const dispatch = useDispatch()

	const submitHandler =(e: { preventDefault: () => void }) => {
		e.preventDefault()

		dispatch(login(enteredEmail,enteredPassword))
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
			<Tooltip/>
		</>
	)
}

export default AuthForm

