import "./index.css"
import Todo from "./../Todo/Todo"

const Todos = ({
    date,
    todos,
    setIsDeleteTodoModalOpened,
    setDeleteTodoId,
    setIsUpdateTodoModalOpened,
    setUpdatedTodo
}) => {
    return (
        <div className="todos">
            <h2>{date}</h2>
            {todos.map((todo, index) => (<Todo
                key={index}
                todo={todo}
                setIsDeleteTodoModalOpened={setIsDeleteTodoModalOpened}
                setIsUpdateTodoModalOpened={setIsUpdateTodoModalOpened}
                setDeleteTodoId={setDeleteTodoId}
                setUpdatedTodo={setUpdatedTodo}/>))}
        </div>
    )
}

export default Todos