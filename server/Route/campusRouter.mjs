import express from 'express'
import CampusHandler from '../Handler/CampusHandler.mjs'
import multer from 'multer'


const storage = multer.memoryStorage();
const upload = multer({ storage });

const CampusRouter = express.Router()


CampusRouter.post("/create",upload.single('file'),CampusHandler.create)

CampusRouter.get("/read", CampusHandler.read);

CampusRouter.get("/:campusID",CampusHandler.getCampusDetails)

CampusRouter.put("/update/:campusID",upload.single('file'),CampusHandler.update)

CampusRouter.get("/round_att/:roundID",CampusHandler.readRound)

CampusRouter.get("/round/:campusID",CampusHandler.readAllRound)

CampusRouter.put("/update_round",upload.single('file'),CampusHandler.updateRound)

CampusRouter.post("/add_round",CampusHandler.addRound)

CampusRouter.get("/gct",CampusHandler.getCampusList)

export default CampusRouter;