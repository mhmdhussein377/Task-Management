import {Fragment, useEffect, useRef, useState} from 'react'
import Input from '../UI/Input/Input'
import DatePicker from "react-datepicker";
import SelectSearch from "react-select-search"

import "react-datepicker/dist/react-datepicker.css";
import 'react-select-search/style.css'
import Button from "../UI/Button/Button";
import {taskStatus} from '../../utils/constants';
import {handleCloseModal} from '../../utils/closeModal';
import {getRequest, postRequest} from '../../utils/requests';
import {useAuth} from '../../Context/AuthContext';
import "./index.css"
import SearchableDropdown from '../SearchableDropdown/SearchableDropdown';

const UpdateTodoModal = ({setIsUpdateTodoModalOpened, updatedTodo, setShouldFetchTodos}) => {

    console.log(updatedTodo, "updatedTodo")

    const [inputs,
        setInputs] = useState({
        title: updatedTodo?.title,
        description: updatedTodo?.description,
        due_date: new Date(),
        status: updatedTodo?.status
    })
    const [error, setError] = useState("")
    const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
    const [employees, setEmployees] = useState([])
    const [value, setValue] = useState("");
    const formRef = useRef(null)
    const {user} = useAuth()

    console.log(value, "vaaa")

    useEffect(() => {
        const getEmployees = async() => {
            const employees = await getRequest("/employees")
            setEmployees(employees)
            setValue(employees?.find(item => item.id === updatedTodo.assigned_to).name)
        }
        user.role === "employer" && getEmployees()
    }, [])

    const handleChange = (name, value) => {
        setInputs(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const closeModal = (event) => {
        handleCloseModal(event, formRef, setIsUpdateTodoModalOpened)
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
            const response = await postRequest(`/tasks/${updatedTodo?.id}`, {
                ...inputs,
                assigned_to: selectedEmployeeId,
                due_date: formattedDate
            })

            response && setShouldFetchTodos(true)
            response && setIsUpdateTodoModalOpened(false)

        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className={`update-todo ${user.role === "employee" && "employee"}`} onClick={closeModal}>
            <form ref={formRef} onSubmit={handleCreateTodo}>
                <div className="inputs">
                    {user.role === "employer" && <Fragment>
                        <Input
                            type='text'
                            label='Title'
                            name='title'
                            onChange={e => handleChange("title", e.target.value)}
                            value={inputs["title"]}
                            placeholder='Enter a title'/>
                        <Input
                            type='text'
                            label='Description'
                            name='description'
                            onChange={e => handleChange("description", e.target.value)}
                            value={inputs.description || ""}
                            placeholder='Enter a description'/>
                    </Fragment>}
                    {error && <p className="error">Description is required</p>}
                    <div className="w-50">
                        {user.role === "employer" && <div className="input-container date">
                            <label htmlFor="date">Date</label>
                            <DatePicker selected={inputs.due_date} onChange={handleDateChange}/>
                        </div>}
                        {user.role === "employee" && <div className={`input-container priority ${user.role === "employee" && "full-status"}`}>
                            <label htmlFor="priority">Status</label>
                            <SelectSearch
                                onChange={handleStatusChange}
                                options={taskStatus}
                                value={inputs.status}/>
                        </div>}
                    </div>
                    {user.role === "employer" && <div className="input-container">
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
                    </div>}
                </div>
                <Button content='Update'/>
            </form>
        </div>
    )
}

export default UpdateTodoModal