import { Router } from "express"
import { authUser, authUserCookie } from "../middlewares/auth.js"
import * as controller from "../controllers/invitationController.js"

const router = Router()

router.get("/", authUserCookie, controller.index)
router.post("/", authUserCookie, controller.store)
router.delete("/:id", authUserCookie, controller.destroy)

export default router 
