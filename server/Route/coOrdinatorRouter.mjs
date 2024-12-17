import express from 'express'
import CoOrdinator from '../Handler/CoOrdinatorHandler.mjs'

const CoOrdinatorRouter = express.Router()

CoOrdinatorRouter.get("/", CoOrdinator.readAll)

CoOrdinatorRouter.post("/create",CoOrdinator.create)


CoOrdinatorRouter.put("/update",CoOrdinator.update)

CoOrdinatorRouter.delete("/delete/:cID",CoOrdinator.delete)

CoOrdinatorRouter.get("/get_campus",CoOrdinator.coFetchCampus)



export default  CoOrdinatorRouter;