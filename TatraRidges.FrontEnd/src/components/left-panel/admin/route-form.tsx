import Description from "./description"

const RouteForm: React.FC<{ className?: string }> = props => {
	return (
		<div className={props.className}>
			<Description text='Dodawanie drogi' />
			<form>
				<label>Text</label>
				<input type={"text"} />
				<label>Text</label>
				<input type={"text"} />
				<label>Text</label>
				<input type={"text"} />
				<button>Dodaj</button>
			</form>
		</div>
	)
}

export default RouteForm
