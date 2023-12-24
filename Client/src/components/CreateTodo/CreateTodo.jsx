import { useRef, useState } from "react"
import { postRequest } from "../../utils/requests"
import { handleCloseModal } from "../../utils/closeModal";
import Input from '../UI/Input/Input'
import Button from "../UI/Button/Button";
import { taskStatus } from "../../utils/constants";
import DatePicker from "react-datepicker";
import SelectSearch from "react-select-search"
import "react-datepicker/dist/react-datepicker.css";
import 'react-select-search/style.css'
import "./index.css"

const CreateTodo = ({setIsCreateTodoModalOpened, setShouldFetchTodos}) => {

    const [inputs,
        setInputs] = useState({title: "", description: "", due_date: new Date(), status: "in_progress"})
    const [error, setError] = useState("")
    const formRef = useRef(null)

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

        if(!inputs.description) {
            setError("description")
            setTimeout(() => {
                setError("")
            }, 3000)
            return
        }

        if(!inputs.title) {
            setError("title")
            setTimeout(() => {
                setError("")
            }, 3000)
            return
        }

        try {

            const formattedDate = inputs.due_date.toISOString().slice(0, 19).replace("T", " ");
            const response = await postRequest("/tasks", {
                ...inputs,
                due_date: formattedDate,
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
                        placeholder='Enter a title'/>
                    {error === "title" && <p className="error">Title is required</p>}
                    <Input
                        type='text'
                        label='Description'
                        name='description'
                        onChange={e => handleChange("description", e.target.value)}
                        value={inputs["description"]}
                        placeholder='Enter a description'/>
                    {error === "description" && <p className="error">Description is required</p>}
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
                </div>
                <Button content='Create'/>
            </form>
        </div>
    )
}

export default CreateTodo