import { pool } from '../Database/database.mjs';
import moment from 'moment-timezone';
import ExcelJS from 'exceljs';
import sendNotification from '../Utils/notification.mjs'

class AttendanceHandler {
    static markAttendance = async (req, res) => {
        const { roundid, attendanceid } = req.body;

        try {
            // Fetch the current record
            console.log(roundid,attendanceid)
            const [rows] = await pool.query(
                'SELECT * FROM Attendances WHERE RoundID = ? AND AttendanceID = ?',
                [roundid, attendanceid]
            );

            if (rows.length === 0) {
                return res.status(404).json({ message: 'Record not found' });
            }

            // Get the current date in Indian time zone
            const indianTime = moment().tz('Asia/Kolkata').format('YYYY-MM-DD');

            // Update the record to mark as Absent
            const updateQuery = `
                UPDATE Attendances
                SET AttendanceStatus = 'Present', AttendanceDate = ?
                WHERE RoundID = ? AND AttendanceID = ?
            `;

            await pool.query(updateQuery, [indianTime, roundid, attendanceid]);

            const [attendanceDetails] = await pool.query(
                'SELECT StudentID FROM Attendances WHERE AttendanceID = ?',
                [attendanceid]
              );
              const studentID = attendanceDetails[0].StudentID;

              // Fetch the FCMToken using StudentID
              const [studentDetails] = await pool.query(
                'SELECT FCMToken FROM Student WHERE id = ?',
                [studentID]
              );

              const fcmToken = studentDetails[0].FCMToken;
                if(fcmToken){
                    const payload = {
                        title: 'Attendance Marked',
                        body: 'Your attendance has been marked as present',
                      };
                  
                      // Send notification in a non-blocking way
                      sendNotification(fcmToken, payload)
                }
              // Define the notification payload
              
          
            res.status(200).json({ message: 'Attendance marked as present' });
        } catch (error) {
            console.error('Error marking attendance:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }


    static downloadAttendance = async (req, res) => {
        try {
            const { branch, roundid, roundname, campusname, attendanceStatus } = req.body;
    
            // Adjust the query based on the branch parameter
            let query;
            let queryParams = [roundid, attendanceStatus];
    
            if (branch === 'ALL') {
                query = `
                    SELECT 
                        s.\`Name of Student\` as name, 
                        s.Branch as branch, 
                        s.\`College ID\` as collegeid, 
                        a.AttendanceStatus as attendance
                    FROM Attendances a
                    JOIN Student s ON a.StudentID = s.id
                    WHERE a.RoundID = ? AND a.AttendanceStatus = ?
                `;
            } else {
                query = `
                    SELECT 
                        s.\`Name of Student\` as name, 
                        s.Branch as branch, 
                        s.\`College ID\` as collegeid, 
                        a.AttendanceStatus as attendance
                    FROM Attendances a
                    JOIN Student s ON a.StudentID = s.id
                    WHERE s.Branch = ? AND a.RoundID = ? AND a.AttendanceStatus = ?
                `;
                queryParams.unshift(branch);  // Add branch to the beginning of the query parameters
            }
    
            // Fetch attendance data from the database based on branch, roundid, and attendanceStatus
            const [rows] = await pool.execute(query, queryParams);
    
            // Create a new Excel workbook and worksheet
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Attendance');
    
            // Add columns to the worksheet
            worksheet.columns = [
                { header: 'Name', key: 'name', width: 30 },
                { header: 'Branch', key: 'branch', width: 20 },
                { header: 'College ID', key: 'collegeid', width: 20 },
                { header: 'Attendance', key: 'attendance', width: 20 },
                { header: 'Campus', key: 'campus', width: 20 },
                { header: 'Round', key: 'round', width: 20 },
            ];
    
            // Add rows to the worksheet
            rows.forEach(row => {
                worksheet.addRow({
                    name: row.name,
                    branch: row.branch,
                    collegeid: row.collegeid,
                    attendance: row.attendance,
                    campus: campusname,
                    round: roundname,
                });
            });
    
            // Write the workbook to a buffer
            const buffer = await workbook.xlsx.writeBuffer();
    
            // Set appropriate headers and send the buffer to the client
            const filename = `${campusname}_${roundname}_${branch}_${attendanceStatus}_Attendance.xlsx`;
            res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.send(buffer);
        } catch (error) {
            console.error('Error generating attendance report', error);
            res.status(500).send('Error generating attendance report');
        }
    };
    
}

export default AttendanceHandler;