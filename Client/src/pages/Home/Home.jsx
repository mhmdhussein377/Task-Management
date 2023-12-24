import {useEffect, useState} from "react";
import {useDebounce} from "use-debounce";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../../Context/AuthContext";
import {getRequest} from "../../utils/requests";
import CircularButton from "./../../components/UI/CircularButton/CircularButton"
import Todos from "../../components/Todos/Todos";
import Todo from "../../components/Todo/Todo";
import {getCircularButtons} from "../../utils/constants";
import {PiSignOutBold} from "react-icons/pi";
import "./index.css"
import CreateTodo from "../../components/CreateTodo/CreateTodo";
import DeleteTodoModal from "../../components/DeleteTodoModal/DeleteTodoModal";

const Home = () => {

    const [isCreateTodoModalOpened,
        setIsCreateTodoModalOpened] = useState(false);
    const [isDeleteTodoModalOpened,
        setIsDeleteTodoModalOpened] = useState(false);
    const [isUpdateTodoModalOpened,
        setIsUpdateTodoModalOpened] = useState(false);
    const [todos,
        setTodos] = useState([]);
    const [showCompleted,
        setShowCompleted] = useState(false);
    const [searchTerm,
        setSearchTerm] = useState("");
    const [debouncedValue] = useDebounce(searchTerm, 500);
    const [searchTodos,
        setSearchedTodos] = useState([]);
    const [deleteTodoId,
        setDeleteTodoId] = useState(null);
    const [udpatedTodo,
        setUpdatedTodo] = useState(null);
    const [shouldFetchTodos,
        setShouldFetchTodos] = useState(true);
    const navigate = useNavigate();
    const {logout} = useAuth();

    useEffect(() => {
        const getTodos = async() => {
            const response = await getRequest("/tasks");
            setTodos(response.tasks);
        };

        if (shouldFetchTodos) {
            getTodos();
            setShouldFetchTodos(false);
        }
    }, [shouldFetchTodos]);

    useEffect(() => {

        console.log(debouncedValue, "dev")
        console.log(searchTodos, todos, "todoooo")

        if (!debouncedValue) {
            setSearchedTodos([]);
            return;
        }

        const filteredTodos = todos.filter(todo => {
            console.log(todo, "updated")
            return todo.title.toLowerCase().includes(debouncedValue.toLowerCase()) || todo.description.toLowerCase().includes(debouncedValue.toLowerCase())
        })
        console.log(filteredTodos, "filt")
        setTodos(filteredTodos)
    }, [debouncedValue, searchTerm]);

    const handleOpenCreateTodoModal = () => {
        setIsCreateTodoModalOpened(true);
    };

    const handleToggleCompleted = () => {
        setShowCompleted((prevShowCompleted) => !prevShowCompleted);
        setShouldFetchTodos(true);
    };

    const circularButtons = getCircularButtons(handleToggleCompleted, handleOpenCreateTodoModal);

    const handleSignout = () => {
        logout();
        navigate("/login");
    };

    const groupTasksByDate = (tasks) => {
        const groupedTasks = {};

        tasks.forEach((task) => {
            const dueDate = task.due_date;

            if (!groupedTasks[dueDate]) {
                groupedTasks[dueDate] = [];
            }

            groupedTasks[dueDate].push(task);
        });

        return groupedTasks;
    };

    return (
        <div className="home-screen">
            <div className="todos-section scrollbar-hide">
                <input
                    className="search-input"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    type="text"
                    placeholder="Search for todos"/> {searchTodos.length > 0
                    ? searchTodos.map((todo, index) => (<Todo
                        key={index}
                        todo={todo}
                        setDeleteTodoId={setDeleteTodoId}
                        setIsDeleteTodoModalOpened={setIsDeleteTodoModalOpened}
                        setUpdatedTodo={setUpdatedTodo}
                        setIsUpdateTodoModalOpened={setIsUpdateTodoModalOpened}/>))
                    : (todos.length === 0
                        ? <div>
                                <h2>Your to-do list is as empty as a Monday morning.
                                </h2>
                                <h3>Add a new to-do and let the productivity party begin! 🚀</h3>
                            </div>
                        : Object.entries(groupTasksByDate(todos)).map(([date, tasksForDate]) => (<Todos
                            key={date}
                            date={date}
                            todos={tasksForDate}
                            setIsDeleteTodoModalOpened={setIsDeleteTodoModalOpened}
                            setIsUpdateTodoModalOpened={setIsUpdateTodoModalOpened}
                            setDeleteTodoId={setDeleteTodoId}
                            setUpdatedTodo={setUpdatedTodo}/>)))}
            </div>
            <div className="action-buttons">
                <CircularButton
                    onClick={handleSignout}
                    icon={< PiSignOutBold size = {
                    25
                }
                color = "white" />}/>
                <div className="flex">
                    {circularButtons.map(({id, icon, handleClick}) => (<CircularButton key={id} onClick={handleClick} icon={icon}/>))}
                </div>
            </div>
            {isCreateTodoModalOpened && (<CreateTodo
                setIsCreateTodoModalOpened={setIsCreateTodoModalOpened}
                setShouldFetchTodos={setShouldFetchTodos}/>)}
            {isDeleteTodoModalOpened && (<DeleteTodoModal
                deleteTodoId={deleteTodoId}
                setDeleteTodoId={setDeleteTodoId}
                setShouldFetchTodos={setShouldFetchTodos}
                setIsDeleteTodoModalOpened={setIsDeleteTodoModalOpened}/>)}
            {/* {isUpdateTodoModalOpened && (<UpdateTodoModal
                setIsUpdateTodoModalOpened={setIsUpdateTodoModalOpened}
                updatedTodo={udpatedTodo}
                setShouldFetchTodos={setShouldFetchTodos}/>)} */}
        </div>
    )
}

export default Home