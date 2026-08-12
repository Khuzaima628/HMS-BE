import router from "express"
import {getDoctorByCategory} from "@src/controllers/doctorControllers"

const doctorRoutes = router.Router()
doctorRoutes.get("/doctors/:specialty",getDoctorByCategory )

export default doctorRoutes;
