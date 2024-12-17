import Database from '../Database/database.mjs'
import {pool} from '../Database/database.mjs';

class SubAdmin{
    static DB = new Database(
        "SubAdmin",
        ["id", "name", "password"]
    )

    static create = async (req, res) => {
        const { name, id, password } = req.body;
        const condition = 'id=?'
        const user = await SubAdmin.read(condition, [id])
        console.log(user)
        if (user.length) {
            return res.status(409).json({
                user: user
            })
           
        }
        
        const placeholders = '(?, ?, ?)';
        const result = await SubAdmin.DB.create(placeholders, [id, name, password]);
        res.status(201).json({
            user: result
        });
    };
    

    static read = async (condition,id) =>{      
        return await SubAdmin.DB.read(condition,[id])
    }

    static readAll= async (req,res)=>{
        res.status(200).json({
            SubAdmin: await SubAdmin.read()
        })
    }



    static update = async (req, res) => {
        const { sID, newId, name, password } = req.body;

        try {
            // Check if the new ID already exists in the database
            const [existingUser] = await pool.query('SELECT * FROM SubAdmin WHERE id=? AND sID != ?', [newId, sID]);
            if (existingUser.length > 0) {
                return res.status(409).json({
                    message: "New ID already exists"
                });
            }

            // Update the SubAdmin record
            const [result] = await pool.query('UPDATE SubAdmin SET id=?, name=?, password=? WHERE sID=?', [newId, name, password, sID]);

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: "SubAdmin not found"
                });
            }

            res.status(200).json({
                message: "SubAdmin updated successfully"
            });
        } catch (error) {
            console.error("Error updating SubAdmin:", error.message);
            res.status(500).json({
                message: "Internal server error"
            });
        }
    };
    

    static delete = async (req, res) => {
        const { sID} = req.params;
        console.log(sID)
        const condition = 'sID=?';
        const result = await SubAdmin.DB.delete(condition, [sID]);
        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "SubAdmin not found"
            });
        }
        res.status(200).json({
            message: "SubAdmin deleted successfully"
        });
    };
}

export default SubAdmin