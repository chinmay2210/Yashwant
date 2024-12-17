import express from 'express'
import EmploerHandler from '../Handler/EmployerHandler.mjs'

const EmployerRouter = express.Router()

EmployerRouter.post("/request_student_data",EmploerHandler.requestStudentData)

EmployerRouter.get("/fetch_request/:employerID",EmploerHandler.fetchRequest)

EmployerRouter.get("/all_request",EmploerHandler.fetchAllRequest)

EmployerRouter.get("/employers",EmploerHandler.fetchEmployer)

EmployerRouter.put("/update_request/:requestID",EmploerHandler.updateStatus)

EmployerRouter.get("/download_list/:employerRequestID",EmploerHandler.downloadStudent)

EmployerRouter.put("/approve/:employerID",EmploerHandler.approveEmployer)

EmployerRouter.get("/job/:employerRequestID",EmploerHandler.fetchJobApply)

export default EmployerRouter;