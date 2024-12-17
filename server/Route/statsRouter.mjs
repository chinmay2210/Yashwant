import express from 'express'
import StatsHandler from '../Handler/StatsHandler.mjs'

const statsRouter = express.Router()

statsRouter.get("/",StatsHandler.statData)

statsRouter.get("/branch-wise-placement",StatsHandler.branchWisePlacement)

statsRouter.get("/complateCampus",StatsHandler.complateCampus)

statsRouter.get("/branch_wise_placement/:campusId",StatsHandler.campusStats)

statsRouter.get("/branch_wise_download/:branchName",StatsHandler.branchWisePlacementDownload)

statsRouter.get("/campus_branch_wise_download/:branchName/:campusId",StatsHandler.campusBranchWiseDownload)

statsRouter.post("/get_branch_stats",StatsHandler.branchStats)

export default statsRouter;