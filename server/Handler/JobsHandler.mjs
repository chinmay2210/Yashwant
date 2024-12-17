import {pool} from '../Database/database.mjs'

class JobsHandler{
    static fetchJobs = async (req, res) => {
        try {
            // Query to get all job requests along with employer names
            const query = `
                SELECT 
                    er.employerName, 
                    erq.employerRequestID, 
                    erq.skill, 
                    erq.skillLevel, 
                    erq.cgpa, 
                    erq.branch, 
                    erq.hasSkillCertificate, 
                    erq.status
                FROM EmployerRequest erq
                JOIN Employer er ON erq.employerID = er.employerID
            `;
    
            const [jobRequests] = await pool.query(query);
    
            if (jobRequests.length === 0) {
                return res.status(404).json({ message: "No job requests found." });
            }
    
            // Return job requests with employer names
            res.json(jobRequests);
        } catch (error) {
            console.error("Error fetching job requests:", error);
            res.status(500).json({ message: "Error fetching job requests." });
        }
    };


    static applyForJob = async (req, res) => {
        const { employerRequestID, studentID } = req.body;
      
        // Check if employerRequestID and studentID are provided
        if (!employerRequestID || !studentID) {
          return res.status(400).json({ message: "Employer Request ID and Student ID are required." });
        }
      
        try {
          // Check if the student has already applied for this job
          const checkQuery = "SELECT * FROM Jobs WHERE employerRequestID = ? AND StudentID = ?";
          const [checkResult] = await pool.query(checkQuery, [employerRequestID, studentID]);
      
          if (checkResult.length > 0) {
            return res.status(400).json({ applied: true, message: "You have already applied for this job." });
          }
      
          // Insert the new job application
          const insertQuery = "INSERT INTO Jobs (employerRequestID, StudentID) VALUES (?, ?)";
          await pool.query(insertQuery, [employerRequestID, studentID]);
      
          return res.status(201).json({ message: "Successfully applied for the job." });
        } catch (error) {
          console.error("Error applying for job:", error);
          return res.status(500).json({ message: "Error applying for job." });
        }
      };
}


export default JobsHandler