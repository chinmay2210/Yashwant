import { pool } from '../Database/database.mjs';
import ExcelJS from 'exceljs'; 
class SkillsHandler {
  static createSkill = async (req, res) => {
    const { Skill, Level, StudentID } = req.body;

    if (!Skill || !Level || !StudentID) {
      return res.status(400).json({ success: false, message: 'Skill, Level, and StudentID are required.' });
    }

    try {
      const checkSkillQuery = 'SELECT * FROM Skills WHERE Skill = ? AND StudentID = ?';
      const [existingSkill] = await pool.query(checkSkillQuery, [Skill, StudentID]);

      if (existingSkill.length > 0) {
        return res.status(409).json({ success: false, message: 'Skill already exists for this student.' });
      }

      const insertSkillQuery = 'INSERT INTO Skills (StudentID, Skill, Level) VALUES (?, ?, ?)';
      const [result] = await pool.query(insertSkillQuery, [StudentID, Skill, Level]);

      return res.status(201).json({ success: true, message: 'Skill created successfully.', skillID: result.insertId });
    } catch (error) {
      console.error('Error creating skill:', error);
      return res.status(500).json({ success: false, message: 'An error occurred while creating the skill.' });
    }
  };

  static updateSkill = async (req, res) => {
    const { SkillId, Skill, Level } = req.body;
    console.log(SkillId)
    if (!SkillId || !Skill || !Level) {
      return res.status(400).json({ success: false, message: 'SkillId, Skill, and Level are required.' });
    }

    try {
      const checkSkillQuery = 'SELECT * FROM Skills WHERE SkillID = ?';
      const [existingSkill] = await pool.query(checkSkillQuery, [SkillId]);

      if (existingSkill.length === 0) {
        return res.status(404).json({ success: false, message: 'Skill not found.' });
      }

      const updateSkillQuery = 'UPDATE Skills SET Skill = ?, Level = ? WHERE SkillID = ?';
      const [result] = await pool.query(updateSkillQuery, [Skill, Level, SkillId]);

      if (result.affectedRows === 0) {
        return res.status(500).json({ success: false, message: 'Failed to update skill.' });
      }

      return res.status(200).json({ success: true, message: 'Skill updated successfully.' });
    } catch (error) {
      console.error('Error updating skill:', error);
      return res.status(500).json({ success: false, message: 'An error occurred while updating the skill.' });
    }
  };

  static deleteSkill = async (req, res) => {
    const { skillId } = req.params; 
    if (!skillId) {
      return res.status(400).json({ success: false, message: 'SkillId is required.' });
    }
  
    try {
      const checkSkillQuery = 'SELECT * FROM Skills WHERE SkillID = ?';
      const [existingSkill] = await pool.query(checkSkillQuery, [skillId]);
  
      if (existingSkill.length === 0) {
        return res.status(404).json({ success: false, message: 'Skill not found.' });
      }
  
      const deleteSkillQuery = 'DELETE FROM Skills WHERE SkillID = ?';
      const [result] = await pool.query(deleteSkillQuery, [skillId]);
  
      if (result.affectedRows === 0) {
        return res.status(500).json({ success: false, message: 'Failed to delete skill.' });
      }
  
      return res.status(200).json({ success: true, message: 'Skill deleted successfully.' });
    } catch (error) {
      console.error('Error deleting skill:', error);
      return res.status(500).json({ success: false, message: 'An error occurred while deleting the skill.' });
    }
  };
  

  static readSkills = async (req, res) => {
    const { StudentId } = req.query;

    if (!StudentId) {
      return res.status(400).json({ success: false, message: 'StudentId is required.' });
    }

    try {
      const fetchSkillsQuery = 'SELECT * FROM Skills WHERE StudentID = ?';
      const [skills] = await pool.query(fetchSkillsQuery, [StudentId]);

      if (skills.length === 0) {
        return res.status(404).json({ success: false, message: 'No skills found for this student.' });
      }

      return res.status(200).json({ success: true, skills });
    } catch (error) {
      console.error('Error fetching skills:', error);
      return res.status(500).json({ success: false, message: 'An error occurred while fetching skills.' });
    }
  };

  static downloadStudentsBySkill = async (req, res) => {
    try {
        const { skill, level } = req.body;

        if (!skill) {
            return res.status(400).json({ success: false, message: 'Skill is required.' });
        }

        let query;
        let queryParams;

        if (level) {
            query = `
                SELECT s.\`Name of Student\`, s.\`College ID\`, s.\`Personal Email Address\`, s.\`Mobile 1\`
                FROM Skills k
                JOIN Student s ON k.StudentID = s.id
                WHERE k.Skill = ? AND k.Level = ?
            `;
            queryParams = [skill, level];
        } else {
            query = `
                SELECT s.\`Name of Student\`, s.\`College ID\`, s.\`Personal Email Address\`, s.\`Mobile 1\`
                FROM Skills k
                JOIN Student s ON k.StudentID = s.id
                WHERE k.Skill = ?
            `;
            queryParams = [skill];
        }

        const [rows] = await pool.query(query, queryParams);

        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: 'No students found with the specified skill and level.' });
        }

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Students');

        worksheet.columns = [
            { header: 'Name', key: 'name', width: 30 },
            { header: 'College ID', key: 'collegeid', width: 20 },
            { header: 'Email', key: 'email', width: 30 },
            { header: 'Mobile No.', key: 'mobile', width: 20 }
        ];

        rows.forEach(row => {
            worksheet.addRow({
                name: row['Name of Student'],
                collegeid: row['College ID'],
                email: row['Personal Email Address'],
                mobile: row['Mobile 1']
            });
        });

        const buffer = await workbook.xlsx.writeBuffer();

        res.setHeader('Content-Disposition', 'attachment; filename=students.xlsx');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.send(buffer);

    } catch (error) {
        console.error('Error generating students report', error);
        res.status(500).send('Error generating students report');
    }
};
}

export default SkillsHandler;
