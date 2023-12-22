import { useState } from "react"
import {loginInputFields} from "./../../utils/constants"
import { Link, useNavigate } from 'react-router-dom';
import Button from "./../../components/UI/Button/Button"
import Input from "../../components/UI/Input/Input";
import { postRequest } from "../../utils/requests";
import {showError} from "../../utils/showError";
import {useAuth} from "../../Context/AuthContext";
import "./index.css"

const Login = () => {

    const [inputs, setInputs] = useState({email: "", password: ""})
    const [error, setError] = useState({isError: false, name: "", message: ""})
    const navigate = useNavigate()
    const {login} = useAuth()
    localStorage.removeItem("authToken")
    localStorage.removeItem("user")

    const handleSubmit = async(event) => {
        event.preventDefault()

        const {email, password} = inputs

        if (!email || !password) {
            showError("Missing fields", "All fields are required", setError)
            return
        }

        const handleError = () => {
            showError("Wrong credentials", "Wrong credentials", setError)
        }

        const response = await postRequest("/login", inputs, handleError)

        if (response) {
            const {user, authorization} = response
            login(user, authorization.token)
            navigate("/")
        }
    }

    const handleInputChange = (name, value) => {
        setInputs(prev => ({
            ...prev,
            [name]: value
        }))
    }

    return (
        <div className="login-screen">
            <form onSubmit={handleSubmit}>
                <div className="inputs">
                    {loginInputFields.map(({name, label, type, placeholder}) => (<Input
                        key={name}
                        label={label}
                        type={type}
                        value={inputs[name] || ""}
                        placeholder={placeholder}
                        name={name}
                        onChange={e => handleInputChange(name, e.target.value)}/>))}
                    {error.isError && <p className="error">{error.message}</p>}
                    <div className="to-register">
                        Don't have an account?
                        <Link to="/register">Register</Link>
                    </div>
                </div>
                <Button content="Login"/>
            </form>
        </div>
    )
}

export default Login