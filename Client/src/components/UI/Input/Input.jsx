import "./index.css"

const Input = ({label, type, value, placeholder, name, required, onChange}) => {
    return (
        <div className="input-container">
            <label htmlFor={name}>{label}</label>
            <input id={name} required={required} onChange={onChange} value={value} type={type} placeholder={placeholder} name={name}/>
        </div>
    )
}

export default Input