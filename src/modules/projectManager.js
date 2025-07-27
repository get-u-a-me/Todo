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

export let current_prj = null;

export function setCurrentProject(projectId) {
  current_prj = projectId;
}

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

  saveProjects();
});

dialog_close_btn.addEventListener("click", () => {
  project_add_dialog.close();
});

function createProjectbtn(name, description) {
  let project = new Project(name, description);
  projects.set(project.id, project);

  const li_item = document.createElement("li");
  const newbtn = document.createElement("button");
  const deleteSpan = document.createElement("span");

  deleteSpan.textContent = "🗑️";
  newbtn.textContent = name;
  newbtn.classList.add("sidebar-dynamic-btn");

  newbtn.appendChild(deleteSpan);
  li_item.appendChild(newbtn);
  list.appendChild(li_item);

  newbtn.addEventListener("click", (e) => {
    if (e.target === deleteSpan) return;

    document.querySelectorAll(".sidebar-static-btn, .sidebar-dynamic-btn").forEach(btn => {
      btn.classList.remove("active");
    });

    newbtn.classList.add("active");

    setCurrentProject(project.id);

    document.querySelector(".content-title").textContent = name;
    document.querySelector(".todos").innerHTML = "";

    import("./todo.js").then(({ renderTodos }) => {
      renderTodos("all");
    });
  });

  deleteSpan.addEventListener("click", (e) => {
    e.stopPropagation();
    projects.delete(project.id);
    li_item.remove();

    saveProjects();

    if (current_prj === project.id) {
      setCurrentProject(null);

      document.querySelectorAll(".sidebar-static-btn, .sidebar-dynamic-btn").forEach(btn => {
        btn.classList.remove("active");
      });
      document.querySelector('.sidebar-static-btn[data-id="inbox"]').classList.add("active");

      document.querySelector(".content-title").textContent = "Allgemein";
      document.querySelector(".todos").innerHTML = "";

      import("./todo.js").then(({ renderTodos }) => {
        renderTodos("all");
      });
    }
  });
}

export function saveProjects() {
  const prjArray = Array.from(projects.values());
  localStorage.setItem("projects", JSON.stringify(prjArray));
}

export function loadProjects() {
  const prjString = localStorage.getItem("projects");
  if (!prjString) return;

  try {
    const prjArray = JSON.parse(prjString);
    projects.clear();
    list.innerHTML = "";

    prjArray.forEach(prj => {
      projects.set(prj.id, prj);

      // Projekt-Button neu erzeugen, wie bei createProjectbtn
      const li_item = document.createElement("li");
      const newbtn = document.createElement("button");
      const deleteSpan = document.createElement("span");

      deleteSpan.textContent = "🗑️";
      newbtn.textContent = prj.name;
      newbtn.classList.add("sidebar-dynamic-btn");

      newbtn.appendChild(deleteSpan);
      li_item.appendChild(newbtn);
      list.appendChild(li_item);

      newbtn.addEventListener("click", (e) => {
        if (e.target === deleteSpan) return;

        document.querySelectorAll(".sidebar-static-btn, .sidebar-dynamic-btn").forEach(btn => {
          btn.classList.remove("active");
        });

        newbtn.classList.add("active");

        setCurrentProject(prj.id);

        document.querySelector(".content-title").textContent = prj.name;
        document.querySelector(".todos").innerHTML = "";

        import("./todo.js").then(({ renderTodos }) => {
          renderTodos("all");
        });
      });

      deleteSpan.addEventListener("click", (e) => {
        e.stopPropagation();
        projects.delete(prj.id);
        li_item.remove();

        saveProjects();

        if (current_prj === prj.id) {
          setCurrentProject(null);

          document.querySelectorAll(".sidebar-static-btn, .sidebar-dynamic-btn").forEach(btn => {
            btn.classList.remove("active");
          });
          document.querySelector('.sidebar-static-btn[data-id="inbox"]').classList.add("active");

          document.querySelector(".content-title").textContent = "Allgemein";
          document.querySelector(".todos").innerHTML = "";

          import("./todo.js").then(({ renderTodos }) => {
            renderTodos("all");
          });
        }
      });
    });
  } catch (e) {
    console.error("Fehler beim Laden der Projekte aus LocalStorage", e);
  }
}
