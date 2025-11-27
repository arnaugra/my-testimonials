import fs from "fs"
import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.js";
import * as projectService from "../services/projectService.js";
import { getFileName } from "../utils/multer.js";

export async function index(req: AuthRequest, res: Response) {
    try {
        const projects = await projectService.index();
        res.locals.current_path = req.originalUrl
        res.render("projects", { projects });

    } catch (error) {
        res.status(500).json({ error: "Error getting projects" });

    }
}

export async function store(req: AuthRequest, res: Response) {
    const data = req.body

    try {
        const projectId = await projectService.store(data)

        if (req.file) {
            const newName = getFileName(req, req.file, projectId);
            const tempPath = req.file.path;
            const newPath = `/storage/projects/${newName}`;

            fs.renameSync(tempPath, newPath);

            await projectService.update(projectId, {
                image_url: `/${newPath}`
            });

        }
        const project = await projectService.show(projectId)
        res.json(project)

    } catch (error) {
        res.status(500).json({ error: "Error storing project" });

    }
}

export async function show(req: AuthRequest, res: Response) {
    const { id } = req.params

    try {
        
        const project = await projectService.show(Number(id));
        res.locals.current_path = req.originalUrl
        res.render("projects/edit", { project });
        
    } catch (error) {
        res.status(500).json({ error: "Error getting project" });

    }
}

export async function update(req: AuthRequest, res: Response) {
    const { id } = req.params
    const data = req.body

    try {
        if (req.file) {
            const newName = getFileName(req, req.file, Number(id));
            const newPath = `/storage/projects/${newName}`;

            const currentProject = await projectService.show(Number(id));
            if (currentProject.image_url && fs.existsSync(currentProject.image_url)) {
                fs.unlinkSync(currentProject.image_url);
            }

            fs.renameSync(req.file.path, newPath);
            data.image_url = `/${newPath}`
        }

        await projectService.update(Number(id), data)
        const project = await projectService.show(Number(id))
        res.json(project)

    } catch (error) {
        res.status(500).json({ error: "Error updating project" })

    }
}

export async function destroy(req: AuthRequest, res: Response) {
    const { id } = req.params

    try {
        const deletedUser = await projectService.destroy(Number(id))
        res.json(deletedUser)

    } catch (error) {
        res.status(500).json({ error: "Error deleting user" })        

    }
}