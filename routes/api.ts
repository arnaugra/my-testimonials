import { Router } from "express"
import users from "./users.js"
import projects from "./projects.js"
import invitations from "./invitations.js"
import testimonials from "./testimonials.js"

const router = Router()

// router.use("/users", users) // ?????
router.use("/projects", projects)
router.use("/invitations", invitations)
router.use("/testimonials", testimonials)

export default router
