import express from 'express'
import SubAdmin from '../Handler/SubAdminHandler.mjs'

const SubAdminRouter = express.Router()

SubAdminRouter.get("/", SubAdmin.readAll)

SubAdminRouter.post("/create",SubAdmin.create)


SubAdminRouter.put("/update",SubAdmin.update)

SubAdminRouter.delete("/delete/:sID",SubAdmin.delete)





export default  SubAdminRouter;