import { current_prj } from "./projectManager.js";

class Todo {
  constructor(title, description, until, project, priority) {
    this.title = title;
    this.description = description;
    this.until = until;
    this.priority = priority;
    this.completed = false;
    this.Project = project; // Projekt-ID oder null
    this.UUID = crypto.randomUUID();
    this.creationDate = new Date();
  }
}

export const todos = new Map();

const todo_dialog = document.querySelector(".todo-add-dialog");
const form = document.querySelector(".todo-dialog-main");
const todo_container = document.querySelector(".todos");

export function addTodo() {
  form.reset();
  todo_dialog.showModal();
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const title = document.getElementById("todo-title").value;
  const description = document.getElementById("todo-description").value;
  const until = document.getElementById("todo-until").value || "";
  const priority = document.getElementById("todo-priority").value;

  const todo = new Todo(title, description, until, current_prj, priority);

  todos.set(todo.UUID, todo);
  todo_dialog.close();

  saveTodos();

  todo_container.innerHTML = "";
  renderTodos("all");
});

document.querySelector(".todo-dialog-close-btn").addEventListener("click", () => {
  todo_dialog.close();
});

function getPriorityClass(priority) {
  switch (priority) {
    case "1":
    case 1:
      return "priority-low";
    case "2":
    case 2:
      return "priority-medium";
    case "3":
    case 3:
      return "priority-high";
    default:
      return "";
  }
}

function renderTodo(todo, container) {
  const todo_card = document.createElement("div");
  const todo_done = document.createElement("input");
  const todo_wrapper = document.createElement("div");
  const card_title = document.createElement("div");
  const card_desc = document.createElement("div");
  const card_until = document.createElement("div");

  const priority_span = document.createElement("span");
  const date_span = document.createElement("span");

  todo_card.classList.add("content-todo");
  todo_done.type = "checkbox";
  todo_done.checked = todo.completed;

  todo_wrapper.classList.add("todo-wrapper");
  card_title.classList.add("content-todo-title");
  card_title.textContent = todo.title;

  card_desc.classList.add("content-todo-desc");
  card_desc.textContent = todo.description;

  card_until.classList.add("content-todo-until");

  let priorityLabel = getPriorityLabel(todo.priority);
  priority_span.textContent = priorityLabel;
  priority_span.classList.add(getPriorityClass(todo.priority));

  if (todo.until !== "") {
    let dayLabel = getDayLabel(todo.until);
    date_span.textContent = dayLabel;
    date_span.classList.add("todo-date");
    card_until.appendChild(date_span);
  }
  card_until.appendChild(priority_span);

  todo_wrapper.appendChild(card_title);
  todo_wrapper.appendChild(card_desc);
  todo_wrapper.appendChild(card_until);

  todo_card.appendChild(todo_done);
  todo_card.appendChild(todo_wrapper);

  container.appendChild(todo_card);

  todo_done.addEventListener("change", () => {
    todo.completed = todo_done.checked;
    todos.set(todo.UUID, todo);

    saveTodos();

    renderTodos("all");
  });
}

function getPriorityLabel(priority) {
  switch (priority) {
    case "1":
    case 1:
      return "niedrig";
    case "2":
    case 2:
      return "mittel";
    case "3":
    case 3:
      return "hoch";
    default:
      return "unbekannt";
  }
}

function getDayLabel(dateString) {
  const today = new Date();
  const target = new Date(dateString);

  today.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);

  const msPerDay = 1000 * 60 * 60 * 24;
  const diffInDays = Math.round((target - today) / msPerDay);

  if (diffInDays === 0) return "Heute";
  if (diffInDays === 1) return "Morgen";
  if (diffInDays === -1) return "Gestern";
  if (diffInDays >= 7) {
    return target.toLocaleDateString("de-DE", {
      day: "numeric",
      month: "long",
    });
  }

  return target.toLocaleDateString("de-DE", { weekday: "long" });
}

export function renderTodos(type) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const openContainer = document.querySelector(".todos");
  const doneContainer = document.querySelector(".todos-done");

  openContainer.innerHTML = "";
  doneContainer.innerHTML = "";

  let filteredTodo = filterTodosByProject(current_prj);

  filteredTodo.forEach(todo => {
    const target = new Date(todo.until);
    target.setHours(0, 0, 0, 0);
    const diffInDays = Math.round((target - today) / (1000 * 60 * 60 * 24));

    if (todo.completed) {
      renderTodo(todo, doneContainer);
    } else {
      if (type === "all") renderTodo(todo, openContainer);
      if (type === "today" && diffInDays === 0) renderTodo(todo, openContainer);
      if (type === "week" && diffInDays >= 0 && diffInDays < 7) renderTodo(todo, openContainer);
    }
  });
}

function filterTodosByProject(projectId) {
  if (!projectId) {
    return Array.from(todos.values());
  }
  return Array.from(todos.values()).filter(todo => todo.Project === projectId);
}

export function saveTodos() {
  // Map in Array von Objekten konvertieren (JSON speicherbar)
  const todoArray = Array.from(todos.values());
  localStorage.setItem("todos", JSON.stringify(todoArray));
}

export function loadTodos() {
  const todoString = localStorage.getItem("todos");
  if (!todoString) return;

  try {
    const todoArray = JSON.parse(todoString);
    todos.clear();

    todoArray.forEach(todoData => {
      // Dates aus String rekonstruieren
      todoData.creationDate = new Date(todoData.creationDate);
      todos.set(todoData.UUID, todoData);
    });
  } catch (e) {
    console.error("Fehler beim Laden der Todos aus LocalStorage", e);
  }
}
