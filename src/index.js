import { todos, addTodo, renderTodos, loadTodos, saveTodos } from "./modules/todo.js";
import { addProject, projects, current_prj, setCurrentProject, loadProjects, saveProjects } from "./modules/projectManager.js";

// Styles
import "./styles/index.css";
import "./styles/dialog.css";
import "./styles/displaytodos.css";

const static_btns = document.querySelectorAll(".sidebar-static-btn");
const page_title = document.querySelector(".content-title");
const todo_wrapper = document.querySelector(".todos");

// Projekte und Todos aus LocalStorage laden
loadProjects();
loadTodos();

function refreshUIAfterProjectChange(name) {
    todo_wrapper.innerHTML = "";
    page_title.textContent = name;
    renderTodos("all");
}

// Projekt hinzufügen
document.querySelector(".add-project-btn").addEventListener("click", () => {
    addProject();
});

// Todo hinzufügen
document.querySelector(".add-todo-btn").addEventListener("click", () => {
    addTodo();
});

// Statische Sidebar-Buttons (Inbox, Heute, Woche)
static_btns.forEach(button => {
    button.addEventListener("click", (e) => {
        document.querySelectorAll(".sidebar-static-btn, .sidebar-dynamic-btn").forEach(btn => {
            btn.classList.remove("active");
        });

        e.currentTarget.classList.add("active");

        setCurrentProject(null);

        todo_wrapper.innerHTML = "";

        const filterType = e.currentTarget.getAttribute("data-id");

        if (filterType === "inbox") {
            refreshUIAfterProjectChange("Allgemein");
            renderTodos("all");
        } else if (filterType === "today") {
            refreshUIAfterProjectChange("Heute");
            renderTodos("today");
        } else if (filterType === "week") {
            refreshUIAfterProjectChange("Diese Woche");
            renderTodos("week");
        }
    });
});

// Initiale Aktivierung: Inbox
document.querySelector('.sidebar-static-btn[data-id="inbox"]').classList.add("active");
setCurrentProject(null);
refreshUIAfterProjectChange("Allgemein");
renderTodos("all");

const menuToggle = document.getElementById('menuToggle');
const sidebar = document.querySelector('.sidebar');

menuToggle.addEventListener('click', () => {
    const isActive = sidebar.classList.toggle('active');
    menuToggle.setAttribute('aria-expanded', isActive);
});

document.addEventListener('click', (e) => {
    if (window.innerWidth <= 768) {
        if (
            sidebar.classList.contains('active') &&
            !sidebar.contains(e.target) &&
            e.target !== menuToggle
        ) {
            sidebar.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
        }
    }
});
