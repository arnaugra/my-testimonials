import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.js";
import { generateToken } from "../utils/generateToken.js"
import { futureDate } from "../utils/date.js"
import * as invitationService from "../services/invitationService.js";
import * as projectService from "../services/projectService.js";

export async function index(req: AuthRequest, res: Response) {
    try {
        let invitations = await invitationService.index();
        const projects = await projectService.selectData();
        const current_path = req.originalUrl
        const expiration_value = (futureDate({days: 7}))

        res.render("invitations", { invitations, current_path, projects, expiration_value, url: `${req.protocol}://${req.get('host')}` });

    } catch (error) {
        res.status(500).json({ error: "Error getting invitations" });

    }
}

export async function store(req: AuthRequest, res: Response) {
    const body = req.body
    const project_id = body.project_id ? body.project_id : null
    const token = generateToken()

    const data = {
        ...req.body,
        project_id,
        token
    }

    try {
        const id = await invitationService.store(data)
        const invitation = await invitationService.show(id)
        res.status(200).json(invitation)

    } catch (error) {
        res.status(500).json({ error: "Error storing invitation" });

    }
}

export async function destroy(req: AuthRequest, res: Response) {
    const { id } = req.params

    try {
        await invitationService.destroy(Number(id))
        res.status(200).json(id)

    } catch (error) {
        res.status(500).json({ error: "Error deleting user" })        

    }
}
