import "./index.css"

const CircularButton = ({icon, onClick}) => {
    return (
        <div onClick={onClick} className="circular-button">
            {icon}
        </div>
    )
}

export default CircularButton