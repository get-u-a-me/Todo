class Todo {
    constructor(title, description, until, project, priority) {
        this.title = title;
        this.description = description;
        this.until = until;
        this.priority = priority;
        this.completed = false;
        this.Project = project;
        this.UUID = crypto.randomUUID();
        this.creationDate = new Date();
    };
}
export const todos = new Map();

const todo_dialog = document.querySelector(".todo-add-dialog");

export function addTodo() {
    todo_dialog.showModal();
}

document.querySelector(".todo-dialog-close-btn").addEventListener("click", e => {
    todo_dialog.close();
});