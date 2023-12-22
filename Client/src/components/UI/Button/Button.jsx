import "./index.css"

const Button = ({content, handleClick}) => {
    return (
        <button onClick={handleClick} className="submit-button" type="submit">{content}</button>
    )
}

export default Button