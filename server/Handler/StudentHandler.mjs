// StudentHandler.js
import Database from '../Database/database.mjs';
import { pool } from '../Database/database.mjs'
import xlsx from 'xlsx';

class StudentHandler {
  static column = [
    `Branch`, `Section`, `College ID`, `Name of Student`, `Gender`, `DoB`, `SSC YOP`, `SSC %age`, `HSC YoP`, `HSSC %age`, `SGPA1`, `SGPA2`, `SGPA3`, `SGPA4`, `SGPA5`, `SGPA6`, `SGPA7`, `Avg. SGPA`, `mobile`, `Personal Email Address`, `College MailID`, `Your career choice`, `DIPLOMA %`, `DIPLOMA YOP`
  ];

  static DB = new Database(
    "Student",
    StudentHandler.column
  );

  static addStudent = async (req, res) => {
    try {
      if (!req.file) {
        console.log("No file uploaded");
        return res.status(400).json({ message: 'No file uploaded' });
      }

      // Read the uploaded file
      const buffer = req.file.buffer;
      const workbook = xlsx.read(buffer, { type: 'buffer' });
      const sheet_name_list = workbook.SheetNames;
      const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
      let i = 1
      for (const row of data) {
        const collegeID = row['College ID'];
        const students = await StudentHandler.DB.read('`College ID` = ?', [collegeID]);

        if (!students.length) {
          const studentData = StudentHandler.column.map(key => row[key]);

          await StudentHandler.DB.create(
            `(${StudentHandler.column.map(() => '?').join(', ')})`, studentData
          );
        }
        console.log(i)
        i++
      }

      res.status(200).json({
        message: 'File uploaded and processed successfully',
        data: data,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'File upload failed', error: error.message });
    }
  };



  static fetchStudents = async (req, res) => {
    try {
      const { branch, id } = req.query;
      let condition = '';

      if (branch && id) {
        condition = 'Branch = ? AND `College ID` = ?';
        const students = await StudentHandler.DB.read(condition, [branch, id]);
        return res.json({ students });
      }

      if (branch) {
        // Fetch based on branch only
        condition = 'Branch = ?';
        const students = await StudentHandler.DB.read(condition, [branch]);
        return res.json({ students });
      }

      if (id) {
        // Fetch based on branch only
        condition = '`College ID` = ?';
        const students = await StudentHandler.DB.read(condition, [id]);
        return res.json({ students });
      }

      // If neither branch nor id is provided, return an error
      return res.status(400).json({ message: 'Please provide branch or id' });
    } catch (error) {
      console.error('Error fetching students:', error);
      return res.status(500).json({ message: 'Error fetching students', error });
    }
  };


  static update = async (req, res) => {
    try {
      const { id, collegeID, ...studentData } = req.body;
      console.log(collegeID)
      // Check if another student with the same college ID exists
      const query = 'SELECT * FROM Student WHERE `College ID`= ? AND id != ?';
      const values = [collegeID, id];
      const [result] = await pool.query(query, values);

      if (result.length) {
        return res.status(409).json({ message: "Another student with the same college ID already exists" });
      }

      const updateQuery = `
    UPDATE Student 
    SET 
        \`Name of Student\` =?, 
        Branch =?, 
        Section =?,
        Gender =?,
        DoB = ?,
        \`SSC YOP\` =?,
        \`SSC %age\` =?,
        \`HSC YoP\` =?,
        \`HSSC %age\` =?,
        SGPA1 = ?,
        SGPA2 = ?,
        SGPA3 = ?,
        SGPA4 = ?,
        SGPA5 = ?,
        SGPA6 = ?,
        SGPA7 = ?,
        \`Avg. SGPA\` = ?,
        \`mobile\` = ?,
        \`Personal Email Address\` = ?,
        \`College MailID\` = ?,
        \`College ID\` = ?
    WHERE id = ${id}
`;


      const updateValues = [
        studentData.name,
        studentData.branch,
        studentData.section,
        studentData.gender,
        studentData.dob.toString(),
        studentData.sscYOP,
        studentData.sscPercentage,
        studentData.hscYOP,
        studentData.hscPercentage,
        studentData.sgpa1,
        studentData.sgpa2,
        studentData.sgpa3,
        studentData.sgpa4,
        studentData.sgpa5,
        studentData.sgpa6,
        studentData.sgpa7,
        studentData.avgSGPA,
        studentData.mobile,
        studentData.personalEmail,
        studentData.collegeMailID,
        collegeID,
        req.params.id
      ];

      const [updatedStudent] = await pool.query(updateQuery, updateValues);

      if (updatedStudent.length) {
        return res.status(404).json({ message: "Student not found" });
      }

      // Return success response
      res.status(200).json({ message: "Student updated successfully" });
    } catch (error) {
      // Handle errors
      console.error(error);
      res.status(500).json({ message: "An error occurred while updating student information" });
    }
  };


  static delete = async (req, res) => {
    try {
      const { id } = req.params;

      const del = pool.query(
        'delete from Attendances where StudentID = ?', [id]
      )

      const d = await pool.query(`delete from Skills where StudentID = ?`, [id])
      const condition = 'id=?';
      const result = await StudentHandler.DB.delete(condition, [id]);
      if (result.affectedRows === 0) {
        return res.status(404).json({
          message: "Student not found"
        });
      }
      res.status(200).json({
        message: "Student deleted successfully"
      });
    } catch (error) {
      res.status(500).json({
        message: "Cannot delete student"
      });
    }

  };





  static fetchCampus = async (req, res) => {
    try {
      const studentId = req.params.id;
      if (!studentId) {
        return res.status(400).json({ error: 'Student ID is required' });
      }

      // Fetch unique campus and round details for the student
      const [rows] = await pool.execute(`
        SELECT 
          c.CampusID, c.CampusName, c.Message, c.package, c.Date, c.Location,
          r.RoundID, r.RoundName, r.RoundDate,
          a.AttendanceID, a.AttendanceStatus, a.AttendanceDate
        FROM 
          Campus c
        JOIN 
          Round r ON c.CampusID = r.CampusID
        JOIN 
          Attendances a ON r.RoundID = a.RoundID
        WHERE 
          a.StudentID = ?
        ORDER BY 
          c.Date DESC, r.RoundDate ASC
      `, [studentId]);

      // Organize the data into the required format
      const result = [];
      const campusMap = new Map();

      rows.forEach(row => {
        if (!campusMap.has(row.CampusID)) {
          const campusDetails = {
            CampusID: row.CampusID,
            CampusName: row.CampusName,
            Message: row.Message,
            package: row.package,
            Date: row.Date,
            Location: row.Location,
            Rounds: []
          };
          campusMap.set(row.CampusID, campusDetails);
          result.push(campusDetails);
        }

        const campus = campusMap.get(row.CampusID);
        campus.Rounds.push({
          RoundID: row.RoundID,
          RoundName: row.RoundName,
          RoundDate: row.RoundDate,
          Attendance: {
            AttendanceID: row.AttendanceID,
            AttendanceStatus: row.AttendanceStatus,
            AttendanceDate: row.AttendanceDate
          }
        });
      });
      res.status(200).json({
        "success": true,
        "campus": result
      }
      );
    } catch (error) {
      console.error('Error fetching campus details:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };


  static fetchStudentStat = async (req, res) => {
    const studentId = req.params.id;
  console.log(studentId)
    try {
      // Fetch student skills
      const skillsQuery = `
        SELECT Skill, Level 
        FROM Skills 
        WHERE StudentID = ?
      `;
      const [skills] = await pool.execute(skillsQuery, [studentId]);
  
      // Fetch student certificates
      const certificatesQuery = `
        SELECT certificateName, certificateOrgnization 
        FROM Certificate 
        WHERE studentID = ?
      `;
      const [certificates] = await pool.execute(certificatesQuery, [studentId]);
  
      // Fetch student placement information
      const placementQuery = `
        SELECT Campus.CampusName, Campus.package, Campus.Date, Campus.Location, Placement.StudentID
        FROM Placement
        JOIN Campus ON Placement.CampusID = Campus.CampusID
        WHERE Placement.StudentID = ?
      `;
      const [placement] = await pool.execute(placementQuery, [studentId]);

      const [student] = await pool.execute(`select * from Student where id = ?`,[studentId])
  console.log(student)
      // Send response with skills, certificates, and placement details
      res.status(200).json({
        skills,
        certificates,
        placement,
        student:student[0]
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "An error occurred while fetching student data." });
    }
  };
  


}

export default StudentHandler;
