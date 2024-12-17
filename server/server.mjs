import express from "express";
import AuthRouter from "./Route/authRouter.mjs";
import cors from "cors"; 
import dotenv from "dotenv"; 
import CoOrdinatorRouter from "./Route/coOrdinatorRouter.mjs";
import StudentRouter from "./Route/studentRouter.mjs";
import CampusRouter from "./Route/campusRouter.mjs";
import AttendanceRouter from "./Route/attendanceRouter.mjs";
import SubAdminRouter from "./Route/subAdminRouter.mjs";
import SkillRouter from "./Route/skillsRoute.mjs";
import JwtOperation from "./Utils/jwtoken.mjs";
import pyqRouter from "./Route/pyqRouter.mjs";
import notificationRoute from "./Route/notificationRouter.mjs";
import EmployerRouter from "./Route/employerRouter.mjs";
import CertifcateRoute from "./Route/certificateRouter.mjs";
import statsRouter from "./Route/statsRouter.mjs";
import ResumeRouter from "./Route/ResumeRouter.mjs";
import JobRouter from "./Route/JobRouter.mjs";

dotenv.config();

const app = express();

// JSON Parsing Middleware
app.use(express.json());

app.use(
	cors({
		// origin: "http://localhost:3000",
		origin: "*",
		methods: ["GET", "POST", "PUT", "DELETE"],
	})
);

// Logging Middleware
app.use((req, res, next) => {
	console.log(`${req.method} ${req.url}`);
	next();
});

app.use((req, res, next) => {
	if (req.path.startsWith("/api/tpcycce/auth")) {
		// Skip JWT verification for /api/auth routes
		return next();
	}

	const token = req.headers["authorization"];

	if (!token) {
		return res.status(403).send("A token is required for authentication");
	}
	try {
		const decoded = JwtOperation.verifyToken(token);
		req.user = decoded;
	} catch (err) {
		return res.status(401).send("Invalid Token");
	}
	next();
});

// Error Handling Middleware
app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).send("Something went wrong!");
});

// Routes
app.use("/api/tpcycce/auth", AuthRouter);

app.use("/api/tpcycce/coordinator", CoOrdinatorRouter);

app.use("/api/tpcycce/subadmin", SubAdminRouter);

app.use("/api/tpcycce/student/", StudentRouter);

app.use("/api/tpcycce/campus/", CampusRouter);

app.use("/api/tpcycce/attendance", AttendanceRouter);

app.use("/api/tpcycce/skill", SkillRouter);

app.use("/api/tpcycce/pyq", pyqRouter);

app.use("/api/tpcycce/notification", notificationRoute);

app.use("/api/tpcycce/employer", EmployerRouter);

app.use("/api/tpcycce/certificate", CertifcateRoute);

app.use("/api/tpcycce/stats", statsRouter);

app.use("/api/tpcycce/resume",ResumeRouter)
app.use("/api/tpcycce/job",JobRouter)

app.listen(5001, "0.0.0.0");

// app.listen()
