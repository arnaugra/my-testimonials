import fs from "fs"
import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.js";
import * as testimonialService from "../services/testimonialService.js";
import * as invitationService from "../services/invitationService.js";
import { getFileName } from "../utils/multer.js";

export async function index(req: AuthRequest, res: Response) {
    try {
        const testimonials = await testimonialService.index();
        res.render("testimonials",{ testimonials, current_path: req.originalUrl });

    } catch (error) {
        res.status(500).json({ error: "Error getting testimonials" });

    }
}

export async function store(req: AuthRequest, res: Response) {
    const data = req.body
    const { invitation_id } = data

    try {
        const testimonialId = await testimonialService.store(data)

        if (req.file) {
            const newName = getFileName(req, req.file, testimonialId);
            const tempPath = req.file.path;
            const newPath = `storage/testimonials/${newName}`;

            fs.renameSync(tempPath, newPath);

            await testimonialService.update(testimonialId, {
                image_url: newPath
            });

        }
        await invitationService.update(invitation_id, { used_at: new Date() })
        res.status(200).json()

    } catch (error) {
        res.status(500).json({ error: "Error storing testimonial" });

    }
}

export async function show(req: AuthRequest, res: Response) {
    const { id } = req.params

    try {
        const testimonial = await testimonialService.show(Number(id));
        res.json(testimonial);

    } catch (error) {
        res.status(500).json({ error: "Error getting testimonial" });

    }
}

export async function update(req: AuthRequest, res: Response) {
    const { id } = req.params
    const data = req.body

    try {
        if (req.file) {
            const newName = getFileName(req, req.file, Number(id));
            const newPath = `storage/testimonials/${newName}`;

            const currentTestimonial = await testimonialService.show(Number(id));
            if (currentTestimonial.image_url && fs.existsSync(currentTestimonial.image_url)) {
                fs.unlinkSync(currentTestimonial.image_url);
            }

            fs.renameSync(req.file.path, newPath);
            data.image_url = newPath
        }

        await testimonialService.update(Number(id), data)
        const testimonial = await testimonialService.show(Number(id))
        res.json(testimonial)

    } catch (error) {
        res.status(500).json({ error: "Error updating testimonial" })

    }
}

export async function destroy(req: AuthRequest, res: Response) {
    const { id } = req.params

    try {
        const deletedUser = await testimonialService.destroy(Number(id))
        res.json(deletedUser)

    } catch (error) {
        res.status(500).json({ error: "Error deleting user" })        

    }
}

export async function testimonialsList(req: AuthRequest, res: Response) {
    const { error } = req.query

    try {
        const testimonials = await testimonialService.testimonialsList()
        res.render("home", { testimonials, error })
    } catch (error) {
        res.status(500).json({ error: "Error testimonialsList" })
    }

}

export async function createByToken(req: AuthRequest, res: Response) {
    const { token } = req.params

    try {
        const invitation = await invitationService.byToken(token)

        if (!invitation) res.redirect('/') // TODO: view http (code, message)
        res.render("testimonials/token", { invitation })

    } catch (error) {
        res.status(500).json({ error: "" })
    }
}

export async function switchValidation(req: AuthRequest, res: Response) {
    const { id } = req.params

    try {
        
        const updated = await testimonialService.switchValidation(Number(id))
        
        res.json({updated})
        
    } catch (error) {
        res.status(500).json({ updated: false })
    }
}