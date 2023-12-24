import "./index.css"
import {BiSolidPencil} from "react-icons/bi"
import {BsTrashFill} from "react-icons/bs"
import { useAuth } from "../../Context/AuthContext"

const Todo = ({todo, setIsDeleteTodoModalOpened, setDeleteTodoId, setIsUpdateTodoModalOpened, setUpdatedTodo}) => {

    const {title, description, status, id} = todo
    const {user} = useAuth()

    const handleEditIconClick = () => {
        setIsUpdateTodoModalOpened(true);
        setUpdatedTodo(todo)
    }

    const handleDeleteIconClick = () => {
        setIsDeleteTodoModalOpened(true);
        setDeleteTodoId(id)
    }
    
    return (
        <div className="todo">
            <div>
                <div className="title">{title}</div>
                <div>
                    <div className="status">
                        {status}
                    </div>
                </div>
            </div>
            <div>
                <div className="content">{description}</div>
                {user.role === "employer" && <div className="icons">
                    <div
                        onClick={handleEditIconClick}>
                        <BiSolidPencil size={25} color="black"/>
                    </div>
                    <div
                        onClick={handleDeleteIconClick}>
                        <BsTrashFill size={25} color="black"/>
                    </div>
                </div>}
            </div>
        </div>
    )
}

export default Todo