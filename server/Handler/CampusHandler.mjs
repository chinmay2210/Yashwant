import Database from '../Database/database.mjs'
import { pool } from '../Database/database.mjs'
import xlsx from 'xlsx'
import { BRANCHS } from '../Utils/constant.mjs'
import sendNotification from '../Utils/notification.mjs'
import ExcelJS from 'exceljs'
import path from 'path'
import fs from 'fs'

class CampusHandler {

    static CDB = new Database(
        "Campus",
        ['CampusName', 'Message', 'package', 'Location', 'Date', 'Status','eligibleStudents']
    )

    static RDB = new Database(
        "Round",
        ['CampusID', 'RoundName', 'RoundDate']
    )

    static ADB = new Database(
        'Attendances',
        ['StudentID', 'RoundID', 'AttendanceStatus', 'AttendanceDate']
    )

    static SDB = new Database(
        'Student',
        ['id', 'College ID']
    )

    static create = async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({ message: 'No file uploaded' });
            }
    
            const { campusName, Message, pack, Location, rounds } = req.body;
            const buffer = req.file.buffer;
            const workbook = xlsx.read(buffer, { type: 'buffer' });
            const sheet_name_list = workbook.SheetNames;
            const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
            const collegeIds = data.map(row => row["College ID"]);
    
            // Check if the campus with the same name exists
            const [existingCampuses] = await CampusHandler.CDB.read('`CampusName` = ?', [campusName]);
    
            if (existingCampuses) {
                console.log(existingCampuses);
                return res.status(409).json({ message: 'Campus with the same name already exists' });
            }

            const campus_status = "Pending";
            const campusID = await CampusHandler.CDB.create('(?, ?, ?, ?,?,?,?)', [campusName, Message, pack, Location, rounds[0].roundDate,campus_status,collegeIds.length]);
    
            // Check for existing students
            const a = collegeIds.map(() => '?').join(',');
            const condition = `\`College ID\` IN (${a})`;
            const students = await CampusHandler.SDB.read(condition, collegeIds);
            const studentIdMap = students.reduce((acc, student) => {
                acc[student['College ID']] = student.id;
                return acc;
            }, {});
    
            // Create the rounds and attendance for the first round
            let firstRoundProcessed = false;
            const notificationPromises = [];
    
            for (const round of rounds) {
                const roundID = await CampusHandler.RDB.create('(?, ?, ?)', [campusID, round.roundName, round.roundDate]);
    
                if (!firstRoundProcessed) {
                    for (const row of data) {
                        const collegeId = row["College ID"];
                        const studentID = studentIdMap[collegeId];
                        if (studentID) {
                            const existingAttendance = await CampusHandler.ADB.read('`StudentID` = ? AND `RoundID` = ?', [studentID, roundID]);
                            if (existingAttendance.length === 0) {
                                await CampusHandler.ADB.create('(?, ?, ?, ?)', [studentID, roundID, 'Absent', round.roundDate]);
                            
                                const [s] = await pool.query('SELECT FCMToken FROM Student WHERE id = ?', [studentID]);
                                const fcmToken = s[0]?.FCMToken;  // Adjust based on the actual column name in your database
    
                                if (fcmToken) {
                                    const payload = {
                                        notification: {
                                            title: `${campusName} arrived`,
                                            body: `Be ready for ${round.roundName} round`,
                                        },
                                        data: {
                                            screen_id: `404`,
                                            screen: '/campus',   
                                          },
                                    };
    
                                    // Add the notification promise to the list
                                    notificationPromises.push(sendNotification(fcmToken, payload));
                                }
                            }
                        }
                    }
                    firstRoundProcessed = true;
                }
            }
    
            // Wait for all notifications to be sent
         Promise.all(notificationPromises);
    
            res.status(200).json({ message: 'Campus created successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error creating campus', error });
        }
    };


    static read = async (req, res) => {
        try {
            // Fetch all campuses
            const [campuses] = await pool.query("SELECT * FROM Campus WHERE status = 'Pending'");

            console.log(campuses)
            if (campuses.length === 0) {
            
                return res.status(404).json({ message: 'No campuses found' });
            }
           
            // Iterate over each campus to fetch rounds and attendance details
            const campusDataPromises = campuses.map(async (campus) => {
                // Fetch rounds for the current campus
                const rounds = await this.RDB.read('`CampusID` = ?', [campus.CampusID]);

                // Fetch attendance details for each round
                const roundDataPromises = rounds.map(async (round) => {
                    const attendances = await this.ADB.read('`RoundID` = ?', [round.RoundID]);

                    // Count present and absent students
                    const presentCount = attendances.filter(record => record.AttendanceStatus === 'Present').length;
                    const absentCount = attendances.filter(record => record.AttendanceStatus === 'Absent').length;

                    return {
                        roundID: round.RoundID,
                        roundName: round.RoundName,
                        roundDate: round.RoundDate,
                        presentCount,
                        absentCount
                    };
                });

                const roundData = await Promise.all(roundDataPromises);


                return {
                    campusID: campus.CampusID,
                    campusName: campus.CampusName,
                    package: campus.package,
                    date: campus.Date,
                    rounds: roundData
                };
            });
           
            const campusData = await Promise.all(campusDataPromises);
            res.status(200).json(campusData);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error fetching campus details', error });
        }
    };


    static getCampusDetails = async (req, res) => {
        try {
            const { campusID } = req.params;
            const [campus] = await CampusHandler.CDB.read('`CampusID` = ?', [campusID]);
            if (!campus) {
                return res.status(404).json({ message: 'Campus not found' });
            }

            const rounds = await CampusHandler.RDB.read('`CampusID` = ?', [campusID]);

            res.status(200).json({ campus, rounds });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error fetching campus details', error });
        }
    };


    static update = async (req, res) => {
        try {
            const { campusID } = req.params;
            const { campusName, Message, pack, Location, status } = req.body;
            console.log('Campus Name:', campusName);
            console.log('Message:', Message);
    
            // Start a transaction to ensure data integrity
            const connection = await pool.getConnection();
            try {
                await connection.beginTransaction();
    
                // Check if the campus with the same name exists (excluding current campus)
                const [existingCampuses] = await connection.query(
                    'SELECT * FROM Campus WHERE CampusName = ? AND CampusID != ?',
                    [campusName, campusID]
                );
    
                if (existingCampuses.length > 0) {
                    await connection.rollback();
                    return res.status(409).json({ message: 'Campus with the same name already exists' });
                }
    
                // Update Campus details
                const updateQuery = `
                    UPDATE Campus
                    SET CampusName = ?, Message = ?, package = ?, Location = ?, status = ?
                    WHERE CampusID = ?`;
                const updateValues = [campusName, Message, pack, Location, status, campusID];
                const [updateResult] = await connection.query(updateQuery, updateValues);
    
                if (updateResult.affectedRows === 0) {
                    await connection.rollback();
                    return res.status(404).json({ message: 'Campus not found' });
                }
    
                // If status is 'Completed', process the XLSX file
                if (status === 'Complated') {
                    if (!req.file) {
                        await connection.rollback();
                        return res.status(400).json({ message: 'XLSX file is required when status is Completed' });
                    }
    
                    // Read the XLSX file from buffer using ExcelJS
                    const workbook = new ExcelJS.Workbook();
                    await workbook.xlsx.load(req.file.buffer);
                    const worksheet = workbook.worksheets[0]; // Assuming data is in the first sheet
    
                    // Find the column index for 'College ID'
                    const headerRow = worksheet.getRow(1);
                    let collegeIdCol = null;
                    headerRow.eachCell((cell, colNumber) => {
                        if (cell.value && cell.value.toString().trim().toLowerCase() === 'college id') {
                            collegeIdCol = colNumber;
                        }
                    });
    
                    if (!collegeIdCol) {
                        await connection.rollback();
                        return res.status(400).json({ message: 'College ID column not found in the XLSX file' });
                    }
    
                    // Iterate through the rows and collect College IDs
                    const collegeIds = [];
                    worksheet.eachRow((row, rowNumber) => {
                        if (rowNumber === 1) return; // Skip header row
                        const collegeId = row.getCell(collegeIdCol).value;
                        if (collegeId !== null && collegeId !== undefined && !isNaN(collegeId)) {
                            collegeIds.push(collegeId);
                        }
                    });
    
                    if (collegeIds.length === 0) {
                        await connection.rollback();
                        return res.status(400).json({ message: 'No valid College IDs found in the XLSX file' });
                    }
    
                    // Fetch Student IDs corresponding to the College IDs
                    const [students] = await connection.query(
                        'SELECT id FROM Student WHERE `College ID` IN (?)',
                        [collegeIds]
                    );
    
                    if (students.length === 0) {
                        await connection.rollback();
                        return res.status(400).json({ message: 'No students found for the provided College IDs' });
                    }
    
                    // Prepare data for insertion into Placement table
                    const placementData = students.map(student => [campusID, student.id]);
    
                    // Insert into Placement table
                    const insertPlacementQuery = 'INSERT INTO Placement (CampusID, StudentID) VALUES ?';
                    await connection.query(insertPlacementQuery, [placementData]);

                    const placedStudents = students.length;
    
                    const updateCampusStatsQuery = `
                        UPDATE Campus
                        SET  placedStudents = ?
                        WHERE CampusID = ?`;
                    await connection.query(updateCampusStatsQuery, [ placedStudents, campusID]);
                }
    
                // Commit the transaction
                await connection.commit();
    
                res.status(200).json({
                    message: 'Campus updated successfully',
                    studentsAdded: status === 'Completed' ? students.length : 0,
                });
            } catch (transactionError) {
                // Rollback the transaction in case of error
                await connection.rollback();
                console.error('Transaction error:', transactionError);
                res.status(500).json({ message: 'Error updating campus', error: transactionError.message });
            } finally {
                // Release the connection back to the pool
                connection.release();
            }
        } catch (error) {
            console.error('Error updating campus:', error);
            res.status(500).json({ message: 'Error updating campus', error: error.message });
        }
    };



    static readRound = async (req, res) => {
        try {
            const { roundID } = req.params;

            const attendanceData = [];

            // Fetch round and campus details
            const roundQuery = `
                SELECT r.RoundID, r.RoundName, r.RoundDate, c.CampusID, c.CampusName, c.Date AS CampusDate
                FROM Round r
                INNER JOIN Campus c ON r.CampusID = c.CampusID
                WHERE r.RoundID = ?
            `;
            const roundResult = await pool.query(roundQuery, [roundID]);
            const roundDetails = roundResult[0];

            for (const branch of BRANCHS) {
                let query;
                if (branch === 'ALL') {
                    query = `
                        SELECT
                            COUNT(*) AS total,
                            SUM(CASE WHEN AttendanceStatus = 'Present' THEN 1 ELSE 0 END) AS present,
                            SUM(CASE WHEN AttendanceStatus = 'Absent' THEN 1 ELSE 0 END) AS absent
                        FROM Attendances
                        WHERE RoundID = ?
                    `;
                } else {
                    query = `
                        SELECT
                            COUNT(*) AS total,
                            SUM(CASE WHEN a.AttendanceStatus = 'Present' THEN 1 ELSE 0 END) AS present,
                            SUM(CASE WHEN a.AttendanceStatus = 'Absent' THEN 1 ELSE 0 END) AS absent
                        FROM Attendances a
                        INNER JOIN Student s ON a.StudentID = s.id
                        WHERE s.Branch = ? AND a.RoundID = ?
                    `;
                }

                const result = await pool.query(query, branch === 'ALL' ? [roundID] : [branch, roundID]);
                attendanceData.push({ branch, ...result[0] });
            }

            res.json({ success: true, data: { round: roundDetails, attendance: attendanceData } });
        } catch (error) {
            console.error("Error fetching attendance:", error);
            res.status(500).json({ success: false, error: "Internal server error" });
        }
    }


    static readAllRound = async (req, res) => {
        try {
            const { campusID } = req.params;

            const query = `
                SELECT * 
                FROM Round
                WHERE CampusID = ?
            `;

            const [rounds] = await pool.query(query, [campusID]);
            console.log(rounds)
            res.json({ success: true, data: rounds });
        } catch (error) {
            console.error("Error fetching rounds:", error);
            res.status(500).json({ success: false, error: "Internal server error" });
        }
    }

    static updateRound = async (req, res) => {
        try {
            const { roundID, roundName, roundDate } = req.body;
            const file = req.file;
           
            if (!roundID || !roundName || !roundDate) {
                return res.status(400).json({ message: "Missing required fields" });
            }
            const updateQuery = `
                UPDATE Round
                SET RoundName = ?, RoundDate = ?
                WHERE RoundID = ?;
            `;
            const values = [roundName, roundDate, roundID];
            const result = await pool.query(updateQuery, values);

            if (result.rowCount === 0) {
                return res.status(404).json({ message: "Round not found" });
            }

            if (file) {
                const buffer = req.file.buffer;
                const workbook = xlsx.read(buffer, { type: 'buffer' });
                const sheet_name_list = workbook.SheetNames;
                const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
                const collegeIds = data.map(row => row["College ID"]);
                const a = collegeIds.map(() => '?').join(',');
                const condition = `\`College ID\` IN (${a})`;
                const students = await CampusHandler.SDB.read(condition, collegeIds);
                const studentIdMap = students.reduce((acc, student) => {
                    acc[student['College ID']] = student.id;
                    return acc;
                }, {});
             
                for (const row of data) {
                  
                    const collegeId = row["College ID"];
                    const studentID = studentIdMap[collegeId];
                    if (studentID) {
                        const existingAttendance = await CampusHandler.ADB.read('`StudentID` = ? AND `RoundID` = ?', [studentID, roundID]);
                        if (existingAttendance.length === 0) {
                            await CampusHandler.ADB.create('(?, ?, ?, ?)', [studentID, roundID, 'Absent', roundDate]);

                            const [s] = await pool.query('SELECT FCMToken FROM Student WHERE id = ?', [studentID]);
                            const fcmToken = s[0]?.FCMToken;  // Adjust based on the actual column name in your database

                            if (fcmToken) {
                            
                                const payload = {
                                    notification: {
                                        title: `Next Round!!`,
                                        body: `Be ready for ${roundName} round`,
                                    },
                                    data: {
                                        screen_id: `${roundID}`,
                                        screen: '/campus',   
                                      },
                                };

                                // Add the notification promise to the list
                            
                               sendNotification(fcmToken, payload);
                                
                            }

                        }
                    }
                }
               


            }


            res.status(200).json({
                message: "Round updated successfully",
            });
        } catch (error) {
            console.error('Error updating round:', error);
            res.status(500).json({ message: "An error occurred while updating the round" });
        }
    }

    static addRound = async (req, res) => {
       
        const { campusID, roundName, date } = req.body;
       
        if (!campusID || !roundName || !date) {
            return res.status(400).json({ message: "All fields are required" });
        }

        try {
            const [result] = await pool.query(
                'INSERT INTO Round (CampusID, RoundName, RoundDate) VALUES (?, ?, ?)',
                [campusID, roundName, date]
            );

            return res.status(201).json({ message: "Round created successfully", roundID: result.insertId });
        } catch (error) {
            console.error('Error adding round:', error);
            return res.status(500).json({ message: "An error occurred while creating the round" });
        }
    };


    static getCampusList = async (req, res) => {
        try {
           
            // Query to fetch campus ID and campus name
            const query = 'SELECT CampusID AS id, CampusName AS name FROM Campus';
            
            // Execute the query
            const [rows] = await pool.execute(query);

            // Check if any campuses were found
            if (rows.length > 0) {
                // Return the list of campuses with a success status code
                res.status(200).json({ campuses: rows });
            } else {
                console.log("campusnot found")
                res.status(404).json({
                    
                    message: 'No campuses found' });
            }
        } catch (error) {
            // Log the error and return a server error status code
            console.error('Error fetching campus list:', error);
            res.status(500).json({ message: 'An error occurred while fetching campus data' });
        }
    }

    static criteriaBasedCampus = async (req, res) => {
        try {
            const { campusName, message, pack, location, rounds, eligibilityType, selectedBranches, liveBacklogAllowed, liveBacklogCount, deadBacklogAllowed, deadBacklogCount, cgpa } = req.body;
    
            // 1. Check if the campus with the same name exists
            const existingCampusQuery = 'SELECT * FROM Campus WHERE CampusName = ?';
            const [existingCampuses] = await database.query(existingCampusQuery, [campusName]);
            
            if (existingCampuses.length > 0) {
                return res.status(409).json({ message: 'Campus with the same name already exists' });
            }
    
            const campusStatus = "Pending";
            // 2. Insert new campus
            const insertCampusQuery = 'INSERT INTO Campus (CampusName, Message, package, Location, Date, status, eligibleStudents) VALUES (?, ?, ?, ?, ?, ?, ?)';
            const campusID = await database.query(insertCampusQuery, [campusName, message, pack, location, rounds[0].roundDate, campusStatus, 0]);
    
            // 3. Fetch eligible students based on criteria
            const branchCondition = selectedBranches.map(() => '?').join(',');
            const liveBacklogCheck = liveBacklogAllowed === 'no' ? 'AND `Avg. SGPA` IS NOT NULL' : '';
            const deadBacklogCheck = deadBacklogAllowed === 'no' ? 'AND `Avg. SGPA` IS NOT NULL' : '';
            
            const eligibleStudentsQuery = `
                SELECT * FROM Student 
                WHERE Branch IN (${branchCondition}) 
                AND \`Avg. SGPA\` >= ?
                ${liveBacklogCheck}
                ${deadBacklogCheck}
            `;
    
            const parameters = [...selectedBranches, cgpa];
            const [students] = await database.query(eligibleStudentsQuery, parameters);
    
            // 4. Check if we have eligible students
            if (students.length === 0) {
                return res.status(404).json({ message: 'No eligible students found based on the criteria.' });
            }
    
            // 5. Create the round and attendance for the first round
            const roundQuery = 'INSERT INTO Round (CampusID, RoundName, RoundDate) VALUES (?, ?, ?)';
            const roundID = await database.query(roundQuery, [campusID.insertId, rounds[0].roundName, rounds[0].roundDate]);
    
            for (const student of students) {
                const studentID = student.id;
    
                // Create attendance record for each student in the first round
                const attendanceQuery = 'INSERT INTO Attendances (StudentID, RoundID, AttendanceStatus, AttendanceDate) VALUES (?, ?, "Absent", ?)';
                await database.query(attendanceQuery, [studentID, roundID.insertId, rounds[0].roundDate]);
            }
    
            res.status(200).json({ message: 'Campus created successfully', eligibleStudents: students.length });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error creating campus', error });
        }
    };
    


}

export default CampusHandler;
