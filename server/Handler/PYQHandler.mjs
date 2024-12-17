import { pool } from '../Database/database.mjs'
import {BRANCHS} from '../Utils/constant.mjs'
import ExcelJS from 'exceljs';

class PYQHandler {

    static createCodePYQ = async (req, res) => {
        const { question, sampleInput, sampleOutput, explanation, code } = req.body;
        const campusID = req.body.campusID;

        // Validate required fields
        if (!question || !code || !campusID) {

            return res.status(400).json({ message: 'Question, code, and campusID are required.' });
        }

        try {

            // Insert the new coding question into the database
            const [result] = await pool.query(
                `INSERT INTO CodePYQ (Question, SampleInput, SampleOutput, Explanation, Code, CampusID)
                 VALUES (?, ?, ?, ?, ?, ?)`,
                [question, sampleInput || null, sampleOutput || null, explanation || null, code, campusID]
            );

            if (result.insertId) {
                console.log("here")
                return res.status(201).json({ message: 'Coding question added successfully' });
            } else {
                return res.status(500).json({ message: 'Failed to add coding question' });
            }
        } catch (error) {
            // Return error response
            console.error('Database error:', error);
            return res.status(500).json({ message: 'An error occurred while adding the coding question' });
        }
    };


    static updateCodingQuestion = async (req, res) => {
        const { codeID } = req.params;
        const { Question, SampleInput, SampleOutput, Explanation, Code } = req.body;

        if (!codeID) {
            return res.status(400).json({ message: 'Code ID is required' });
        }

        try {
            const query = `
                UPDATE CodePYQ 
                SET Question = ?, SampleInput = ?, SampleOutput = ?, Explanation = ?, Code = ? 
                WHERE CodeID = ?`;
            const values = [Question, SampleInput, SampleOutput, Explanation, Code, codeID];

            const [result] = await pool.query(query, values);

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Coding question not found' });
            }

            res.status(200).json({ message: 'Coding question updated successfully' });
        } catch (error) {
            console.error('Error updating coding question:', error);
            res.status(500).json({ message: 'An error occurred while updating the coding question' });
        }
    };



    static codePYQ = async (req, res) => {
        try {
            const { campusId } = req.query;
           
            if (!campusId) {
                return res.status(400).json({ message: "CampusID is required." });
            }

            // Query to fetch all coding questions for a specific campus
            const [rows] = await pool.query(
                'SELECT * FROM CodePYQ WHERE CampusID = ?',
                [campusId]
            );

            if (rows.length === 0) {
                return res.status(404).json({ message: 'No coding questions found for this campus.' });
            }

            // console.log(rows)

            res.status(200).json({ codingQuestions: rows });
        } catch (error) {
            console.error('Error fetching coding questions:', error.message);
            res.status(500).json({ message: 'An error occurred while fetching coding questions.' });
        }
    };


    static deleteCodingQuestion = async (req, res) => {
        const { codeID } = req.params;

        if (!codeID) {
            return res.status(400).json({ message: 'Code ID is required' });
        }

        try {
            const query = 'DELETE FROM CodePYQ WHERE CodeID = ?';
            const values = [codeID];

            const [result] = await pool.query(query, values);

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Coding question not found' });
            }

            res.status(200).json({ message: 'Coding question deleted successfully' });
        } catch (error) {
            console.error('Error deleting coding question:', error);
            res.status(500).json({ message: 'An error occurred while deleting the coding question' });
        }
    };


    static addInterviewQuestion = async (req, res) => {
        const { question, answer, campusID } = req.body;

        if (!question || !answer || !campusID) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        try {
            // Using pool.query to interact with the database
            const result = await pool.query(
                'INSERT INTO InterviewQuestion (Question, Answer, CampusID) VALUES (?,?,?)',
                [question, answer, campusID]
            );


            res.status(201).json({ message: 'Interview question added successfully' });
        } catch (error) {
            console.error('Error adding interview question:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    };

    static updateInterviewQuestion = async (req, res) => {
        const { CodeID } = req.params;
        const { question, answer } = req.body;

        if (!question || !answer) {
            return res.status(400).json({ message: 'Question and Answer are required' });
        }
        console.log("here")
        try {
            const query = `
                UPDATE InterviewQuestion
                SET Question = ?, Answer = ?
                WHERE CodeID = ?
            `;

            const [result] = await pool.query(query, [question, answer, CodeID]);

            if (result.affectedRows === 0) {

                return res.status(404).json({ message: 'Interview question not found' });
            }

            res.status(200).json({ message: 'Interview question updated successfully' });
        } catch (error) {
            console.error('Error updating interview question:', error.message);
            res.status(500).json({ message: 'An error occurred while updating the interview question' });
        }
    };


    static getInterviewQuestions = async (req, res) => {
        const { campusID } = req.query;
        console.log("hew")
        if (!campusID) {
            return res.status(400).json({ message: 'Campus ID is required' });
        }

        try {
            // Query to fetch interview questions by campus ID
            const [result] = await pool.query(
                'SELECT * FROM InterviewQuestion WHERE CampusID = ?',
                [campusID]
            );

            console.log(result)

            res.status(200).json({ data: result });
        } catch (error) {
            console.error('Error fetching interview questions:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    };

    static deleteInterviewQuestion = async (req, res) => {
        const { CodeID } = req.params;

        try {
            // Execute the DELETE query
            const query = `
            DELETE FROM InterviewQuestion
            WHERE CodeID = ?
        `;

            const [result] = await pool.query(query, [CodeID]);

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Interview question not found' });
            }

            res.status(200).json({ message: 'Interview question deleted successfully' });
        } catch (error) {
            console.error('Error deleting interview question:', error.message);
            res.status(500).json({ message: 'An error occurred while deleting the interview question' });
        }
    };

    static async createAptiLR(req, res) {
        try {
            const { Question, Option1, Option2, Option3, Option4, Explanation, Answer, CampusID } = req.body;

            // Input validation (can be expanded as needed)
            if (!Question || !Answer || !CampusID) {
                return res.status(400).json({ message: 'Question, Answer, and CampusID are required' });
            }

            // Insert into database
            await pool.query(
                'INSERT INTO AptiLRPYQ (Question, Option1, Option2, Option3, Option4, Explanation, Answer, CampusID) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                [Question, Option1, Option2, Option3, Option4, Explanation, Answer, CampusID]
            );

            res.status(201).json({ message: 'Apti/Logical Reasoning question created successfully' });
        } catch (error) {
            console.error('Error creating Apti/Logical Reasoning question:', error.message);
            res.status(500).json({ message: 'Server error. Please try again later.' });
        }
    }

    static updateAptiLRQuestion = async (req, res) => {
        const { questionId } = req.params;
        const { question, option1, option2, option3, option4, explanation, answer } = req.body;

        if (!questionId) {
            return res.status(400).json({ message: 'Question ID is required' });
        }

        try {
            const connection = await pool.getConnection();
            await connection.execute(
                `UPDATE AptiLRPYQ SET 
                Question = ?, 
                Option1 = ?, 
                Option2 = ?, 
                Option3 = ?, 
                Option4 = ?, 
                Explanation = ?, 
                Answer = ? 
                WHERE AptiLRID = ?`,
                [question, option1, option2, option3, option4, explanation, answer, questionId]
            );
            connection.release();

            return res.status(200).json({ message: 'Question updated successfully' });
        } catch (error) {
            console.error('Error updating Apti/Logical Reasoning question:', error);
            return res.status(500).json({ message: 'An error occurred while updating the question' });
        }
    };


    // Mock data for aptitude and LR PYQ
    static aptiLRPYQ = async (req, res) => {
        const { campusId } = req.query;

        if (!campusId) {
            return res.status(400).json({ message: 'Campus ID is required' });
        }

        try {
            const connection = await pool.getConnection();
            const [rows] = await connection.execute(
                'SELECT * FROM AptiLRPYQ WHERE CampusID = ?',
                [campusId]
            );
            connection.release();
                console.log(rows)
            return res.status(200).json({ aptiLRQuestions: rows });
        } catch (error) {
            console.error('Error fetching Apti/Logical Reasoning questions:', error);
            return res.status(500).json({ message: 'An error occurred while fetching data' });
        }
    };


    static deleteAptiLRQuestion = async (req, res) => {
        const { questionId } = req.params;

        if (!questionId) {
            return res.status(400).json({ message: 'Question ID is required' });
        }

        try {
            const connection = await pool.getConnection();
            const [result] = await connection.execute(
                'DELETE FROM AptiLRPYQ WHERE AptiLRID = ?',
                [questionId]
            );
            connection.release();

            if (result.affectedRows > 0) {
                return res.status(200).json({ message: 'Question deleted successfully' });
            } else {
                return res.status(404).json({ message: 'Question not found' });
            }
        } catch (error) {
            console.error('Error deleting Apti/Logical Reasoning question:', error);
            return res.status(500).json({ message: 'An error occurred while deleting the question' });
        }
    };


    static markSeen = async (req, res) => {
        const { studentId, campusId, pyq } = req.body;
        // Validate input data
        if (!studentId || !campusId || !pyq) {
            return res.status(400).json({ message: 'Missing required fields.' });
        }

        try {
            // Insert the data into the Seen table using the established pool
            const [result] = await pool.execute(
                'INSERT INTO Seen (StudentID, PYQ, CampusID) VALUES (?, ?, ?)',
                [studentId, pyq, campusId]
            );
                console.log(result.insertId)
            // Return success response
            return res.status(201).json({
                message: 'Record marked as seen successfully.',
                seenId: result.insertId
            });
        } catch (error) {
            console.log('Database error:', error);
            return res.status(500).json({ message: 'Internal server error.' });
        }
    }







    static pyqstats = async (req, res) => {
        const { campusId, pyqType } = req.params;
        console.log(campusId);
    
        try {
            // Fetch the first round of the specified campus
            const [firstRound] = await pool.query(
                `SELECT RoundID FROM Round
                 WHERE CampusID = ?
                 ORDER BY RoundDate ASC
                 LIMIT 1`, [campusId]
            );
    
            if (firstRound.length === 0) {
                return res.status(404).json({ error: 'No rounds found for the specified campus' });
            }
    
            const firstRoundID = firstRound[0].RoundID;
    
            // Initialize the result object
            const result = {};
    
            // Initialize aggregate data
            const allBranchData = {
                totalStudents: 0,
                seenCount: 0,
                notSeenCount: 0
            };
    
            // Iterate through each branch and get the statistics
            for (const branch of BRANCHS) {
                // Fetch the number of students in the first round for the branch
                const branchCondition = branch !== 'ALL' ? 'AND s.Branch = ?' : '';
                const params = [firstRoundID];
                if (branch !== 'ALL') params.push(branch);
    
                const [studentsInRound] = await pool.query(
                    `SELECT DISTINCT a.StudentID FROM Attendances a
                     JOIN Student s ON a.StudentID = s.id
                     WHERE a.RoundID = ? ${branchCondition}`, params
                );
    
                const branchTotalStudents = studentsInRound.length;
    
                // Fetch students who have seen the specified PYQ for the branch
                const seenBranchCondition = branch !== 'ALL' ? 'AND st.Branch = ?' : '';
                const seenParams = [pyqType, campusId];
                if (branch !== 'ALL') seenParams.push(branch);
    
                const [seenStudents] = await pool.query(
                    `SELECT DISTINCT s.StudentID FROM Seen s
                     JOIN Student st ON s.StudentID = st.id
                     WHERE s.PYQ = ? AND s.CampusID = ? ${seenBranchCondition}`, seenParams
                );
    
                const branchSeenCount = seenStudents.length;
                const branchNotSeenCount = branchTotalStudents - branchSeenCount;
    
                // Store branch data
                result[branch] = {
                    totalStudents: branchTotalStudents,
                    seenCount: branchSeenCount,
                    notSeenCount: branchNotSeenCount
                };
    
                // Update aggregate data
                if (branch !== 'ALL') {
                    allBranchData.totalStudents += branchTotalStudents;
                    allBranchData.seenCount += branchSeenCount;
                    allBranchData.notSeenCount += branchNotSeenCount;
                }
            }
    
            // Add aggregate data for 'ALL'
            result['ALL'] = allBranchData;
            res.json(result);
        } catch (error) {
            console.error(error);
            res.status(500).send('Server Error');
        }
    }
    



    static downloadPyqReport = async (req, res) => {
        try {
            const { branch, campusId, pyq, status } = req.body;
            console.log(status)
            // Fetch the first round of the specified campus
            const [firstRound] = await pool.query(
                `SELECT RoundID FROM Round
                 WHERE CampusID = ?
                 ORDER BY RoundDate ASC
                 LIMIT 1`, [campusId]
            );
    
            if (firstRound.length === 0) {
                return res.status(404).json({ error: 'No rounds found for the specified campus' });
            }
    
            const firstRoundID = firstRound[0].RoundID;
    
            // Fetch enrolled students based on the branch
            let studentQuery = `
                SELECT DISTINCT s.id AS StudentID, s.\`Name of Student\`, s.\`College ID\`, s.Branch
                FROM Attendances a
                JOIN Student s ON a.StudentID = s.id
                WHERE a.RoundID = ?`;
    
            let studentParams = [firstRoundID];
            if (branch !== 'ALL') {
                studentQuery += ' AND s.Branch = ?';
                studentParams.push(branch);
            }
    
            const [studentsInRound] = await pool.query(studentQuery, studentParams);
            const studentIdsInRound = studentsInRound.map(student => student.StudentID);
    
            if (studentIdsInRound.length === 0) {
                return res.status(404).json({ error: 'No students found for the specified criteria' });
            }
    
            let seenStudentIds;
            if (status == 0) {
                // Fetch students who have seen the PYQ
                [seenStudentIds] = await pool.query(
                    `SELECT DISTINCT s.id AS StudentID
                     FROM Seen se
                     JOIN Student s ON se.StudentID = s.id
                     WHERE se.PYQ = ? AND se.CampusID = ? AND s.id IN (?)`, [pyq, campusId, studentIdsInRound]
                );
            } else {
               
                // Fetch students who have not seen the PYQ
                [seenStudentIds] = await pool.query(
                    `SELECT DISTINCT s.id AS StudentID
                     FROM Student s
                     LEFT JOIN Seen se ON s.id = se.StudentID AND se.PYQ = ? AND se.CampusID = ?
                     WHERE s.id IN (?) AND se.StudentID IS NULL`, [pyq, campusId, studentIdsInRound]
                );
            }
    
            // Convert the list of seen student IDs to a Set for quick lookup
            const seenStudentIdsSet = new Set(seenStudentIds.map(student => student.StudentID));
    
            // Filter students based on seen status
            const filteredStudents = studentsInRound.filter(student => {
                return status === 'seen'
                    ? seenStudentIdsSet.has(student.StudentID)
                    : !seenStudentIdsSet.has(student.StudentID);
            });
    
            console.log(filteredStudents);
    
            // Create Excel workbook and worksheet
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Attendance');
    
            worksheet.columns = [
                { header: 'Name', key: 'name', width: 30 },
                { header: 'Branch', key: 'branch', width: 20 },
                { header: 'College ID', key: 'collegeid', width: 20 },
                { header: 'Prep Type', key: 'preptype', width: 20 },
                { header: 'Status', key: 'status', width: 20 }
            ];
    
            filteredStudents.forEach(student => {
                worksheet.addRow({
                    name: student['Name of Student'],
                    branch: student.Branch,
                    collegeid: student['College ID'],
                    preptype:pyq,
                    status: status === 1 ? 'Seen' : 'Not Seen'
                });
            });
    
            // Write to buffer and send response
            const buffer = await workbook.xlsx.writeBuffer();
            res.setHeader('Content-Disposition', `attachment; filename=${pyq}_${branch}_${status}_Report.xlsx`);
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.send(buffer);
    
        } catch (error) {
            console.error('Error generating report', error);
            res.status(500).send('Error generating report');
        }
    };
    
    
    
    

}

export default PYQHandler;
