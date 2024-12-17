import {pool} from '../Database/database.mjs'
import sendNotifcation from '../Utils/notification.mjs'


class NotificationHandler{



    static sendNotifcationn = async (req, res) => {
        try {
          const { campusId, pyq ,campusname} = req.body;
      
          // Fetch the first round of the specified campus
          const [firstRoundResult] = await pool.query(
            `SELECT RoundID FROM Round
             WHERE CampusID = ?
             ORDER BY RoundDate ASC
             LIMIT 1`, [campusId]
          );
         
          if (firstRoundResult.length === 0) {
            return res.status(404).json({ error: 'No rounds found for the specified campus' });
          }
         
      
          const firstRoundID = firstRoundResult[0].RoundID;
      
          // Fetch students in the first round
          const [studentsInRound] = await pool.query(
            `SELECT DISTINCT s.id AS StudentID, s.\`College MailID\`, s.FCMToken
             FROM Attendances a
             JOIN Student s ON a.StudentID = s.id
             WHERE a.RoundID = ?`, [firstRoundID]
          );
      
          if (studentsInRound.length === 0) {
            return res.status(404).json({ error: 'No students found for the specified round' });
          }
      
          // Prepare notification payload
          const payload = {
            notification: {
              title: 'Prep Material',
              body: `New update for ${campusname} ${pyq}. Check it out now!`,
            },
            data: {
              screen_id: `${campusId}`,
              screen: `/${pyq}`,   
            },
          };
      
          // Send notifications to each student
          for (const student of studentsInRound) {
            if (student.FCMToken) {
              await sendNotifcation(student.FCMToken, payload);
            }
          }
      
          res.status(200).json({ message: 'Notifications sent successfully' });
      
        } catch (error) {
          console.error('Error sending notifications:', error);
          res.status(500).json({ error: 'Error sending notifications' });
        }
      }


      static addNotification = async (req, res) => {
        const { title, shortLine, paragraphs } = req.body;
      
        if (!title || !shortLine || !Array.isArray(paragraphs) || paragraphs.length === 0) {
          return res.status(400).json({ success: false, message: 'Title, ShortLine, and paragraphs are required.' });
        }
      
        let connection;
        try {
          connection = await pool.getConnection();
      
          await connection.beginTransaction();
      
          const insertNotification = 'INSERT INTO Notification (Title, ShortLine) VALUES (?, ?)';
          const [result] = await connection.query(insertNotification, [title, shortLine]);
      
          const nID = result.insertId;
          const insertNotificationDetails = 'INSERT INTO NotificationDetails (nID, message) VALUES ?';
          const messageValues = paragraphs.map(paragraph => [nID, paragraph]);
      
          await connection.query(insertNotificationDetails, [messageValues]);
      
          await connection.commit();
      
          // Fetch all students with FCM tokens
          const [students] = await connection.query('SELECT FCMToken FROM Student WHERE FCMToken IS NOT NULL');
      
          // Prepare the notification payload
          const payload = {
            notification: {
              title: title,
              body: shortLine,
            },
            data: {
              screen_id: String(nID),
              screen: '/notification',
            },
          };
      
          // Send notifications to all students
          students.forEach(student => {
            if (student.FCMToken) {
              sendNotifcation(student.FCMToken, payload);
            }
          });
      
          res.status(201).json({ success: true, message: 'Notification added and sent successfully' });
        } catch (error) {
          if (connection) await connection.rollback();
          console.error('Error adding notification:', error);
          res.status(500).json({ success: false, message: 'An error occurred while adding the notification.' });
        } finally {
          if (connection) connection.release();
        }
      }


      static getNotifications = async (req, res) => {
        let connection;
        try {
          connection = await pool.getConnection();
          const query = `
            SELECT n.nID, n.Title, n.ShortLine, nd.ndID, nd.message
            FROM Notification n
            LEFT JOIN NotificationDetails nd ON n.nID = nd.nID
          `;
          
          const [results] = await connection.query(query);
    
          const notifications = results.reduce((acc, row) => {
            const { nID, Title, ShortLine, ndID, message } = row;
            if (!acc[nID]) {
              acc[nID] = {
                nID,
                Title,
                ShortLine,
                messages: []
              };
            }
            acc[nID].messages.push({ ndID, message });
            return acc;
          }, {});
    
          res.status(200).json({ success: true, notifications: Object.values(notifications) });
        } catch (error) {
          console.error('Error fetching notifications:', error);
          res.status(500).json({ success: false, message: 'An error occurred while fetching notifications.' });
        } finally {
          if (connection) connection.release();
        }
      };

      static fetchNotification = async (req, res) => {
        const notificationId = req.params.id;
      console.log(notificationId)
        try {
          const [rows] = await pool.query('SELECT * FROM Notification WHERE nID = ?', [notificationId]);
      
          if (rows.length === 0) {
            return res.status(404).json({
              success: false,
              message: 'Notification not found'
            });
          }
      
          const notification = rows[0];
          
          // Fetch paragraphs associated with the notification
          const [paragraphRows] = await pool.query('SELECT message FROM NotificationDetails WHERE nID = ?', [notificationId]);
          
          const paragraphs = paragraphRows.map(row => row.message);
      
          return res.status(200).json({
            success: true,
            data: {
              id: notification.id,
              title: notification.Title,
              shortLine: notification.ShortLine,
              paragraphs: paragraphs
            }
          });
        } catch (error) {
          console.error('Error fetching notification:', error);
          return res.status(500).json({
            success: false,
            message: 'Error fetching notification'
          });
        }
      }


      static updateNotification = async (req, res) => {
        const { nID } = req.params;
        const { title, shortLine, paragraphs } = req.body;
    
        try {
            // Update the notification title and short line
            await pool.query(
                "UPDATE Notification SET Title = ?, ShortLine = ? WHERE nID = ?",
                [title, shortLine, nID]
            );
    
            // Delete existing paragraphs
            await pool.query("DELETE FROM NotificationDetails WHERE nID = ?", [nID]);
    
            // Insert new paragraphs
            const insertPromises = paragraphs.map(paragraph =>
                pool.query("INSERT INTO NotificationDetails (nID, message) VALUES (?, ?)", [nID, paragraph])
            );
            await Promise.all(insertPromises);
    
            res.status(200).json({ message: "Notification updated successfully" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Failed to update notification" });
        }
    }
    

    
}



export default NotificationHandler;