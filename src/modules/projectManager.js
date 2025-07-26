class Project {
    constructor(name, description) {
        this.name = name;
        this.description = description;
        this.id = crypto.randomUUID();
    }
}

export const projects = new Map();

const list = document.querySelector(".project-list");
const project_add_dialog = document.querySelector(".project-dialog");
const dialog_close_btn = document.querySelector(".project-dialog-close-btn");
const form = document.querySelector(".project-dialog-main");

export function addProject() {
    form.reset();
    project_add_dialog.showModal();
}

form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const title = document.getElementById("project-title").value;
    const desc = document.getElementById("project-description").value || "none";

    createProjectbtn(title, desc);
    project_add_dialog.close();
})

dialog_close_btn.addEventListener("click", (e) => {
    project_add_dialog.close();
})


function createProjectbtn(name, description) {
    let project = new Project(name, description);
    projects.set(project.id, project);
    const li_item = document.createElement("li");
    const newbtn = document.createElement("button");
    const deleteSpan = document.createElement("span");

    deleteSpan.innerHTML = "🗑️"
    newbtn.innerHTML = name;
    newbtn.classList.add("sidebar-dynamic-btn");
    newbtn.appendChild(deleteSpan);
    li_item.appendChild(newbtn);
    list.appendChild(li_item);

    deleteSpan.addEventListener("click", e => {
        projects.delete(project.id);
        li_item.remove();
    })
}