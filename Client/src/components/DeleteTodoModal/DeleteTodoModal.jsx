import { useRef } from "react"
import { deleteRequest } from "../../utils/requests"
import Button from "../UI/Button/Button"
import "./index.css"
import { handleCloseModal } from "../../utils/closeModal"


const DeleteTodoModal = ({setDeleteTodoId, setIsDeleteTodoModalOpened, deleteTodoId, setShouldFetchTodos}) => {

    const formRef = useRef(null)

    const closeModal = (event) => {
        handleCloseModal(event, formRef, setIsDeleteTodoModalOpened)
    }

    const handleDeleteTodo = async () => {
        try {
            const response = await deleteRequest(`/todos/${deleteTodoId}/delete`)
            response && setIsDeleteTodoModalOpened(false)
            response && setShouldFetchTodos(true)
        } catch (error) {
            console.log(error)
        }
    }

    const handleDeclineButtonClick = () => {
        setDeleteTodoId(null);
        setIsDeleteTodoModalOpened(false)
    }

    return (
        <div className='delete-todo-modal' onClick={closeModal}>
            <div className="box" ref={formRef}>
                <h2>Are you sure you want to delete it?</h2>
                <div className="action-buttons">
                    <Button content="Confirm" handleClick={handleDeleteTodo}/>
                    <Button
                        content="Decline"
                        handleClick={handleDeclineButtonClick}/>
                </div>
            </div>
        </div>
    )
}

export default DeleteTodoModal