import express from 'express'
import StudentHandler from '../Handler/StudentHandler.mjs'

import multer from 'multer'
const StudentRouter = express.Router()
const storage = multer.memoryStorage();
const upload = multer({ storage });


StudentRouter.post("/upload",upload.single('file'),StudentHandler.addStudent)


StudentRouter.get("/",StudentHandler.fetchStudents)


StudentRouter.put("/update",StudentHandler.update)


StudentRouter.delete("/delete/:id",StudentHandler.delete)

StudentRouter.get("/get_campus/:id",StudentHandler.fetchCampus)


StudentRouter.get("/get_stats/:id",StudentHandler.fetchStudentStat)

export default StudentRouter