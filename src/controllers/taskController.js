import {findTaskById, createTask, updateTask, deleteTask} from "../services/taskService.js";

export const addTask = async (req, res) => {

    try{
        const {title, description, priority, dueDate} = req.body;
        const userId = req.user.id;

        if(!title && !description){
            return res.status(400).json({ error: "Title and description is needed" });
        }

        const newTask = await createTask({
            title,
            description,
            userId: userId,
            priority,
            dueDate
        });

        res.status(201).json({message: "Task created succecsfully", task: newTask});
    } catch(error){
        res.status(500).json({ error: error.message });
    }
}