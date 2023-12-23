import {useState} from 'react'
import {Link, useNavigate} from "react-router-dom";
import {registerInputFields, roles} from "../../utils/constants";
import {showError} from "../../utils/showError";
import {postRequest} from "../../utils/requests";
import Button from "../../components/UI/Button/Button";
import Input from "../../components/UI/Input/Input";
import {HiOutlineChevronUp, HiOutlineChevronDown} from "react-icons/hi";
import "./index.css"

const Register = () => {

    const [inputs,
        setInputs] = useState({name: "", email: "", password: ""})
    const [error,
        setError] = useState({isError: false, name: "", message: ""})
    const [roleSelected, setRoleSelected] = useState("Select Role")
    const [isListOpened, setIsListOpened] = useState(false)
    const navigate = useNavigate()
    localStorage.removeItem("authToken")
    localStorage.removeItem("user")

    const handleInputChange = (name, value) => {
        setInputs(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async(event) => {
        event.preventDefault()

        const {name, email, password} = inputs
        if (!name || !email || !password || roleSelected === "Select Role") {
            showError("Missing fields", "All fields are required", setError)
            return
        }

        if (password.length < 6 || password.length > 20) {
            showError("Password length", "Password must be 6-20 characters", setError)
            return
        }

        const handleError = () => {
            showError("Email exists", "Email already exists", setError)
        }

        const response = await postRequest("/register", {...inputs, role: roleSelected.toLowerCase()}, handleError)
        response && navigate("/login")
    }

    const handleOpenList = () => {
        setIsListOpened(!isListOpened);
    }

    return (
        <div className="register-screen">
            <form onSubmit={handleSubmit}>
                <div className="inputs">
                    {registerInputFields.map(({name, label, type, placeholder}) => (<Input
                        key={name}
                        label={label}
                        type={type}
                        value={inputs[name] || ""}
                        placeholder={placeholder}
                        name={name}
                        onChange={e => handleInputChange(name, e.target.value)}/>))}
                    <div className="genres-input">
                            <div className="main-checkbox">
                                <label id='labelRoles' htmlFor="genres">Roles</label>
                                <div onClick={handleOpenList} className="top">
                                    <span>{roleSelected}</span>
                                    {isListOpened
                                        ? (<HiOutlineChevronUp size={25}/>)
                                        : (<HiOutlineChevronDown size={25}/>)}
                                </div>
                                <div className={`checkbox-list ${isListOpened && "open"}`}>
                                    {roles.map(({id, label}) => (
                                        <label onClick={e => {setRoleSelected(label); setIsListOpened(false)}} key={id} className="item">
                                            <span>{label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    {error.isError && <p className="error">{error.message}</p>}
                    <div className="to-login">
                        Already have an account?
                        <Link to="/login">Login</Link>
                    </div>
                </div>
                <Button content="Register"/>
            </form>
        </div>
    )
}

export default Register