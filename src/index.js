import { todos, addTodo } from "./modules/todo";
import { addProject, projects } from "./modules/projectManager";

//styles
import "./styles/index.css"
import "./styles/dialog.css"

document.querySelector(".add-project-btn").addEventListener("click", (e) => {
    addProject();
});

document.querySelector(".add-todo-btn").addEventListener("click", (e) => {
    addTodo();
})
