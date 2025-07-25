class Project{
    constructor(name, description) {
        this.name = name;
        this.description = description;
        this.id = crypto.randomUUID;
    }
}

const projects = new Map();

const list = document.querySelector(".project-list");

export function addProject(name){
    let project = new Project(name, "lol");
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