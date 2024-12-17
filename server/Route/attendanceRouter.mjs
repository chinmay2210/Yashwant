import express from 'express'
import AttendanceHandler from '../Handler/AttendanceHandler.mjs'


const AttendanceRouter = express.Router()


AttendanceRouter.put("/update_attendance",AttendanceHandler.markAttendance )


AttendanceRouter.post("/download_attendance",AttendanceHandler.downloadAttendance )








export default AttendanceRouter