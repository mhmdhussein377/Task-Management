import {useEffect, useState} from "react";
import {useDebounce} from "use-debounce";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../../Context/AuthContext";
import {getRequest} from "../../utils/requests";
import CircularButton from "./../../components/UI/CircularButton/CircularButton"
import Todos from "../../components/Todos/Todos";
import Todo from "../../components/Todo/Todo";
import {taskStatus} from "../../utils/constants";
import {PiSignOutBold} from "react-icons/pi";
import "./index.css"
import CreateTodo from "../../components/CreateTodo/CreateTodo";
import DeleteTodoModal from "../../components/DeleteTodoModal/DeleteTodoModal";
import UpdateTodoModal from "../../components/UpdateTodoModal/UpdateTodoModal";
import SelectSearch from "react-select-search"

import "react-datepicker/dist/react-datepicker.css";
import 'react-select-search/style.css'
import { AiOutlinePlus } from "react-icons/ai";

const Home = () => {

    const [isCreateTodoModalOpened,
        setIsCreateTodoModalOpened] = useState(false);
    const [isDeleteTodoModalOpened,
        setIsDeleteTodoModalOpened] = useState(false);
    const [isUpdateTodoModalOpened,
        setIsUpdateTodoModalOpened] = useState(false);
    const [selectedFilterStatus, setSelectedFilterStatus] = useState("Select Status")
    const [todos,
        setTodos] = useState([]);
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
    const {logout, user} = useAuth();

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

        let filteredTasks = []

        if (!debouncedValue && selectedFilterStatus === "Select Status") {
            setSearchedTodos([]);
            return;
        }

        if (debouncedValue && selectedFilterStatus !== "Select Status") {
            filteredTasks = todos.filter(todo =>
                todo.status === selectedFilterStatus &&
                (todo.due_date.includes(debouncedValue) ||
                todo.title.toLowerCase().includes(debouncedValue.toLowerCase()) ||
                todo.description.toLowerCase().includes(debouncedValue.toLowerCase()))
            );
        } else if (!debouncedValue && selectedFilterStatus !== "Select Status") {
            filteredTasks = todos.filter(todo => todo.status === selectedFilterStatus);
        } else if (debouncedValue && selectedFilterStatus === "Select Status") {
            filteredTasks = todos.filter(todo =>
                todo.due_date.includes(debouncedValue) ||
                todo.title.toLowerCase().includes(debouncedValue.toLowerCase()) ||
                todo.description.toLowerCase().includes(debouncedValue.toLowerCase())
            );
        }

        setSearchedTodos(filteredTasks)
    }, [debouncedValue, searchTerm, selectedFilterStatus]);

    const handleOpenCreateTodoModal = () => {
        setIsCreateTodoModalOpened(true);
    };

    const handleSignout = () => {
        logout();
        navigate("/login");
    };

    const handleStatusChange = (newValue) => {
        setSelectedFilterStatus(newValue)
    }

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
                <div className="filter">
                    <input
                        className="search-input"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        type="text"
                        placeholder="Search for todos"/>
                    <div className="status-filter">
                        <div className="input-container priority">
                            <SelectSearch
                                onChange={handleStatusChange}
                                options={[{name: "Select Status", value: "Select Status"}, ...taskStatus]}
                                value={selectedFilterStatus}/>
                        </div>
                    </div>
                </div>
                    {searchTodos.length > 0
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
                    {user.role === "employer" && <CircularButton onClick={handleOpenCreateTodoModal} icon={<AiOutlinePlus size={25} color="white"/>} />}
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
            {isUpdateTodoModalOpened && (<UpdateTodoModal
                setIsUpdateTodoModalOpened={setIsUpdateTodoModalOpened}
                updatedTodo={udpatedTodo}
                setShouldFetchTodos={setShouldFetchTodos}/>)}
        </div>
    )
}

export default Home