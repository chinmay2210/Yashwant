import Database from '../Database/database.mjs'
import {pool} from '../Database/database.mjs';
class CoOrdinator {

   static DB = new Database(
        "coordinator",
        ["id", "name", "password"]
    )

    static create = async (req, res) => {
        const { name, id, password } = req.body;
        console.log(name, id, password)
        const condition = 'id=?'
        const user = await CoOrdinator.read(condition, [id])
        console.log(user)
        if (user.length) {
            return res.status(409).json({
                user: user
            })
           
        }
        
        const placeholders = '(?, ?, ?)';
        const result = await CoOrdinator.DB.create(placeholders, [id, name, password]);
        res.status(201).json({
            user: result
        });
    };
    

    static read = async (condition,id) =>{      
        return await CoOrdinator.DB.read(condition,[id])
    }

    static readAll= async (req,res)=>{
        res.status(200).json({
            coordinator: await CoOrdinator.read()
        })
    }



    static update = async (req, res) => {
        const { cID, newId, name, password } = req.body;

        try {
            // Check if the new ID already exists in the database
            const [existingUser] = await pool.query('SELECT * FROM coordinator WHERE id=? AND cID != ?', [newId, cID]);
            if (existingUser.length > 0) {
                return res.status(409).json({
                    message: "New ID already exists"
                });
            }

            // Update the coordinator record
            const [result] = await pool.query('UPDATE coordinator SET id=?, name=?, password=? WHERE cID=?', [newId, name, password, cID]);

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: "Coordinator not found"
                });
            }

            res.status(200).json({
                message: "Coordinator updated successfully"
            });
        } catch (error) {
            console.error("Error updating coordinator:", error.message);
            res.status(500).json({
                message: "Internal server error"
            });
        }
    };
    

    static delete = async (req, res) => {
        const { cID} = req.params;
        console.log(cID)
        const condition = 'cID=?';
        const result = await CoOrdinator.DB.delete(condition, [cID]);
        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Coordinator not found"
            });
        }
        res.status(200).json({
            message: "Coordinator deleted successfully"
        });
    };
    
    static coFetchCampus = async (req, res) => {
        try {
          // Fetch all campuses and their associated rounds
          const [rows] = await pool.execute(`
            SELECT 
              c.CampusID, c.CampusName, c.Message, c.package, c.Date, c.Location,
              r.RoundID, r.RoundName, r.RoundDate
            FROM 
              Campus c
            LEFT JOIN 
              Round r ON c.CampusID = r.CampusID
            ORDER BY 
              c.CampusID DESC, r.RoundID ASC
          `);
      
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
            if (row.RoundID) {
              campus.Rounds.push({
                RoundID: row.RoundID,
                RoundName: row.RoundName,
                RoundDate: row.RoundDate
              });
            }
          });
      
          res.status(200).json({
            "success":true,
            "campus":result
          }
            );
        } catch (error) {
          console.error('Error fetching campus details:', error);
          res.status(500).json({ error: 'Internal Server Error' });
        }
      };
 
    

}


export default CoOrdinator;