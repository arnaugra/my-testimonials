import { Router } from "express"
import * as controller from "../controllers/userController.js"
import { authUser, authUserCookie } from "../middlewares/auth.js"

const router = Router()

// router.get("/", authUserCookie, controller.index)
// router.get("/:id", authUserCookie, controller.show)
// router.delete("/:id", authUserCookie, controller.destroy)

export default router
