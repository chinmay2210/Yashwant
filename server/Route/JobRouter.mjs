import express from 'express'
import JobsHandler from '../Handler/JobsHandler.mjs'

const JobRouter = express.Router()

JobRouter.get("/jobs",JobsHandler.fetchJobs)

JobRouter.post("/apply",JobsHandler.applyForJob)

export default JobRouter