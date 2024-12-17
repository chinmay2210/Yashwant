import express from 'express'
import SkillsHandler from '../Handler/SkillsHandler.mjs'

const SkillRouter =express.Router()


SkillRouter.post("/create",SkillsHandler.createSkill)
SkillRouter.delete("/delete/:skillId", SkillsHandler.deleteSkill); 


SkillRouter.put("/update/:skillId", SkillsHandler.updateSkill);


SkillRouter.get("/read",SkillsHandler.readSkills)

SkillRouter.post('/download',SkillsHandler.downloadStudentsBySkill)

export default SkillRouter;