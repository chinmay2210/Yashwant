import express from 'express';
import ResumeHandler, { uploadMiddleware } from '../Handler/ResumeHandler.mjs';

const ResumeRouter = express.Router();

// Route to upload resume
ResumeRouter.post('/upload', uploadMiddleware, ResumeHandler.uploadResume);

ResumeRouter.get("/:studentID",ResumeHandler.fetchResumeByStudentId)

export default ResumeRouter;
