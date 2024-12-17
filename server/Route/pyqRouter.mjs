import express from 'express'   
import PYQHandler from '../Handler/PYQHandler.mjs'

const pyqRouter = express.Router()


pyqRouter.get("/code",PYQHandler.codePYQ)

pyqRouter.get("/interview",PYQHandler.getInterviewQuestions)

pyqRouter.get("/apti",PYQHandler.aptiLRPYQ)

pyqRouter.post("/add_question",PYQHandler.createCodePYQ)

pyqRouter.put("/update_question/:codeID",PYQHandler.updateCodingQuestion)

pyqRouter.delete("/delete_question/:codeID",PYQHandler.deleteCodingQuestion)

pyqRouter.post("/add_apit_question",PYQHandler.createAptiLR)

pyqRouter.put("/update_apit_question/:questionId",PYQHandler.updateAptiLRQuestion)

pyqRouter.delete("/delete_apit_question/:questionId",PYQHandler.deleteAptiLRQuestion)


pyqRouter.post("/add_interview_question",PYQHandler.addInterviewQuestion)

pyqRouter.put("/update_interview_question/:CodeID",PYQHandler.updateInterviewQuestion)

pyqRouter.delete("/delete_interview_question/:CodeID",PYQHandler.deleteInterviewQuestion)


pyqRouter.post("/mark_seen",PYQHandler.markSeen)

pyqRouter.get('/pyq_stats/:campusId/:pyqType', PYQHandler.pyqstats);

pyqRouter.post("/download_pyq_report",PYQHandler.downloadPyqReport)


export default pyqRouter;