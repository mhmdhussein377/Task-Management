import {useEffect, useRef, useState} from "react"
import {getRequest, postRequest} from "../../utils/requests"
import {handleCloseModal} from "../../utils/closeModal";
import Input from '../UI/Input/Input'
import Button from "../UI/Button/Button";
import {taskStatus} from "../../utils/constants";
import DatePicker from "react-datepicker";
import SelectSearch from "react-select-search"
import "react-datepicker/dist/react-datepicker.css";
import 'react-select-search/style.css'
import "./index.css"
import SearchableDropdown from "../SearchableDropdown/SearchableDropdown";
import {useAuth} from "../../Context/AuthContext";

const CreateTodo = ({setIsCreateTodoModalOpened, setShouldFetchTodos}) => {

    const [inputs,
        setInputs] = useState({title: "", description: "", due_date: new Date(), status: "in_progress"})
    const [error,
        setError] = useState("")
    const [value,
        setValue] = useState("Select option...");
    const [selectedEmployeeId,
        setSelectedEmployeeId] = useState(null);
    const [employees,
        setEmployees] = useState([])
    const formRef = useRef(null)

    console.log(employees, "emp")
    console.log(selectedEmployeeId, "selected employee")

    useEffect(() => {
        const getEmployees = async() => {
            const employees = await getRequest("/employees")
            setEmployees(employees)
        }
        getEmployees()
    }, [])

    console.log(employees, 'employeeees')

    const handleChange = (name, value) => {
        setInputs(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const closeModal = (event) => {
        handleCloseModal(event, formRef, setIsCreateTodoModalOpened)
    }

    const handleStatusChange = (newValue) => handleChange("status", newValue)

    const handleDateChange = (date) => handleChange("due_date", date)

    const handleCreateTodo = async(e) => {
        e.preventDefault()

        if (!inputs.title) {
            setError("title")
            setTimeout(() => {
                setError("")
            }, 3000)
            return
        }

        if(!selectedEmployeeId) {
            setError("employee")
            setTimeout(() => {
                setError("")
            }, 3000)
            return
        }

        if (!inputs.description) {
            setError("description")
            setTimeout(() => {
                setError("")
            }, 3000)
            return
        }

        try {

            const formattedDate = inputs
                .due_date
                .toISOString()
                .slice(0, 19)
                .replace("T", " ");
            const response = await postRequest("/tasks", {
                ...inputs,
                assigned_to: selectedEmployeeId,
                due_date: formattedDate
            })

            response && setShouldFetchTodos(true)
            response && setIsCreateTodoModalOpened(false)

        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className='create-todo' onClick={closeModal}>
            <form ref={formRef} onSubmit={handleCreateTodo}>
                <div className="inputs">
                    <Input
                        type='text'
                        label='Title'
                        name='title'
                        onChange={e => handleChange("title", e.target.value)}
                        value={inputs["title"]}
                        placeholder='Enter a title'/> {error === "title" && <p className="error">Title is required</p>}
                    <Input
                        type='text'
                        label='Description'
                        name='description'
                        onChange={e => handleChange("description", e.target.value)}
                        value={inputs["description"]}
                        placeholder='Enter a description'/> {error === "description" && <p className="error">Description is required</p>}
                    <div className="w-50">
                        <div className="input-container date">
                            <label htmlFor="date">Date</label>
                            <DatePicker selected={inputs.due_date} onChange={handleDateChange}/>
                        </div>
                        <div className="input-container priority">
                            <label htmlFor="priority">Status</label>
                            <SelectSearch
                                onChange={handleStatusChange}
                                options={taskStatus}
                                value={inputs.status}/>
                        </div>
                    </div>
                    <div className="input-container">
                        <label>Assign Employee</label>
                        <SearchableDropdown
                            options={employees}
                            label="name"
                            id="id"
                            selectedVal={value}
                            handleChange={(label, id) => {
                            setValue(label);
                            setSelectedEmployeeId(id);
                        }}/>
                    </div>
                </div>
                <Button content='Create'/>
            </form>
        </div>
    )
}

export default CreateTodo