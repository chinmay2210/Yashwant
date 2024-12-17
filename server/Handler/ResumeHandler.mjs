import {pool} from '../Database/database.mjs';
import multer from 'multer';

// Configure multer for file handling
const storage = multer.memoryStorage(); // Store file in memory for easy access
const upload = multer({ storage });

class ResumeHandler {
  // Middleware to handle file upload
  static uploadResume = async (req, res) => {
    const { studentID, resume_type } = req.body;
    const file = req.file; // Multer saves the uploaded file here

    if (!studentID || !resume_type || !file) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    try {
     

      // Insert resume into the Resumes table
      const sql = `
        INSERT INTO Resumes (studentID, resume_type, resume_data, uploaded_at)
        VALUES (?, ?, ?, CURRENT_TIMESTAMP)
      `;
      const [result] = await pool.execute(sql, [
        studentID,
        resume_type,
        file.buffer, 
      ]);

      return res.status(201).json({ message: "Resume uploaded successfully!" });
    } catch (error) {
      console.error("Error uploading resume:", error);
      return res.status(500).json({ message: "Server error. Please try again later." });
    }
  };

  static fetchResumeByStudentId = async (req, res) => {
    const { studentID } = req.params;
  
    if (!studentID) {
      return res.status(400).json({ message: "Student ID is required." });
    }
  
    try {
      // Query to get all resumes for the studentID
      const [resumes] = await pool.query(
        "SELECT resume_type, resume_data, uploaded_at FROM Resumes WHERE studentID = ?",
        [studentID]
      );
  
      if (resumes.length === 0) {
        return res.status(404).json({ message: "No resumes found for the student." });
      }

      const formattedResumes = resumes.map(resume => {
        if (resume.resume_data) {
          return {
            ...resume,
            resume_data: Buffer.from(resume.resume_data).toString('base64'), // Convert to base64 string for JSON response
            resume_url: `data:${resume.resume_type === 'pdf' ? 'application/pdf' : 'video/mp4'};base64,${Buffer.from(resume.resume_data).toString('base64')}` // Create a data URL
          };
        } else {
          // Handle undefined resume_data
          return {
            ...resume,
            resume_data: null, // or any default value
            resume_url: null,
          };
        }
      }).filter(resume => resume.resume_data); // Filter out resumes with null data

      // Return formatted resumes data
      res.json(formattedResumes);
    } catch (error) {
      console.error("Error fetching resumes:", error);
      res.status(500).json({ message: "Error fetching resumes." });
    }
  };
  
  
  
  
}

export default ResumeHandler;

// Export multer upload so it can be used in the router
export const uploadMiddleware = upload.single('resume'); // Accept a single file upload with the field name 'resume'
