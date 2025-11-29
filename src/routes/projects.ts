import { Router } from "express"
import { authUser, authUserCookie } from "../middlewares/auth.js"
import { createUpload } from "../utils/multer.js";
import * as controller from "../controllers/projectController.js"

const router = Router()

const upload = createUpload("projects")

router.get("/", authUserCookie, controller.index)
router.post("/", authUserCookie, upload.single("image"), controller.store)
router.get("/:id", authUserCookie, controller.show)
router.patch("/:id", authUserCookie, upload.single("image"), controller.update)
router.delete("/:id", authUserCookie, controller.destroy)

export default router 
