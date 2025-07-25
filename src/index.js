import { Todo } from "./modules/todo";
import "./styles/index.css"
import { addProject } from "./modules/projectManager";

const project_add_btn = document.querySelector(".add-project-btn")

project_add_btn.addEventListener("click", (e) => {
    let name = prompt("enter name");
    addProject(name);
});
