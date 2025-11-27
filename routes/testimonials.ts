import { Router } from "express"
import { authUser, authUserCookie } from "../middlewares/auth.js"
import { createUpload } from "../utils/multer.js";
import * as controller from "../controllers/testimonialController.js"

const router = Router()

const upload = createUpload("testimonials")

router.get("/", authUserCookie, controller.index)
router.post("/", upload.single("image"), controller.store)
// router.get("/:id", authUserCookie, controller.show) // edit? no!
router.patch("/:id", authUserCookie, upload.single("image"), controller.update)
router.delete("/:id", authUserCookie, controller.destroy)

router.patch("/:id/switch-validation", authUserCookie, controller.switchValidation)

export default router 
