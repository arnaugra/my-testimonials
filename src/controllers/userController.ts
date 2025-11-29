import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.js";
import * as userService from "../services/userService.js";

export async function index(req: AuthRequest, res: Response) {
    try {
        const users = await userService.index()
        res.status(200).json(users)

    } catch (err) {
        res.status(500).json({ error: "Error getting users" })

    }
}

// export async function store(req: AuthRequest, res: Response) {}

export async function show(req: AuthRequest, res: Response) {
    const { id } = req.params

    try {
        const user = await userService.show(Number(id));
        res.status(200).json(user);

    } catch (err) {
        res.status(500).json({ error: "Error getting user" });

    }
}

// export async function update(req: AuthRequest, res: Response) {}

export async function destroy(req: AuthRequest, res: Response) {
    const { id } = req.params

    try {
        await userService.destroy(Number(id))
        res.status(200).json(id)

    } catch (error) {
        res.status(500).json({ error: "Error deleting user" })        

    }
}
