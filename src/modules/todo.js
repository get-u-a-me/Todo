export class Todo {
    constructor(title, description, until, project, priority){
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