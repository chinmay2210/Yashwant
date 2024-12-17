import JwtOperation from '../Utils/jwtoken.mjs'
import { pool } from '../Database/database.mjs'
import { generateOTP, sendOTPMail } from '../Utils/email.mjs'


class AuthHandler {

    static adminLogin = async (req, res) => {

        const { username, password } = req.body;
        if (username === process.env.ADMIN && password === process.env.ADMINPASSWORD) {
            const payload = {
                "id": username,
                "role": "Admin"
            }
            const token = JwtOperation.generateToken(payload);

            res.status(201).json({
                token: token
            });
        } else {
            res.status(401).json({
                message: 'Unauthorized'
            });
        }
    };

    static studentLogin = async (req, res) => {
        try {
            const { email, password, mtoken } = req.body;
            const [userRows] = await pool.query('SELECT * FROM Student WHERE `College MailID` = ?', [email]);
            console.log(userRows)
            if (userRows.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "User not found",
                });
            }

            const user = userRows[0];
            const payload = {
                "id": user.id,
                "role": "Student"
            };
            const token = JwtOperation.generateToken(payload);

            // Update the FCMToken column with the mtoken
            await pool.query('UPDATE Student SET FCMToken = ? WHERE `College MailID` = ?', [mtoken, email]);

            if (user.password == null) {
                return res.status(200).json({
                    token: token,
                    success: true,
                    message: "User Found",
                    new_user: true,
                    user: user,
                });
            }

            if (user.password !== password) {
                return res.status(401).json({
                    success: false,
                    message: "Incorrect password",
                });
            } else {
                return res.status(200).json({
                    token: token,
                    success: true,
                    message: "User Found",
                    new_user: false,
                    user: user,
                });
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                success: false,
                message: "Internal Server Error",
            });
        }
    };



    static updatePassword = async (req, res) => {
        try {
            const { email, password, mtoken } = req.body;
            console.log(email, password)
            if (!email || !password) {
                return res.status(400).json({ error: 'Email and password are required.' });
            }
            console.log("here")

            let query = 'UPDATE Student SET password = ?';
            let values = [password];

            // Conditionally add FCMToken to the query and values
            if (mtoken) {
                query += ', FCMToken = ?';
                values.push(mtoken);
            }

            query += ' WHERE `College MailID` = ?';
            values.push(email);

            const result = await pool.query(query, values);
            const token = JwtOperation.generateToken(email);

            return res.status(200).json({
                token: token,
                message: 'Password updated successfully'
            });
        } catch (err) {
            console.error('Error updating password:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    };


    static forgetPassword = async (req, res) => {
        try {
            const { email } = req.body;

            if (!email) {
                return res.status(400).json({ message: 'Email is required' });
            }


            const [userResult] = await pool.query('SELECT * FROM Student WHERE `College MailID` = ?', [email]);

            if (userResult.length === 0) {
                return res.status(404).json({ message: 'User with this email does not exist' });
            }

            // Generate OTP
            const otp = generateOTP();
            console.log(otp)

            // Send OTP email
            sendOTPMail(email, otp, 'Password Reset OTP');

            // Respond with success message
            return res.status(200).json({ message: 'OTP has been sent to your email', otp: otp, user: userResult[0] });
        } catch (error) {
            console.error('Error in forgetPassword:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    };




    static coLogin = async (req, res) => {
        try {
            const { id, password } = req.body;

            const [userRows] = await pool.query('SELECT * FROM coordinator WHERE id = ?', [id]);

            if (userRows.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "User not found",
                });
            }

            const user = userRows[0];
            console.log(user)
            if (user.password !== password) {
                return res.status(401).json({
                    success: false,
                    message: "Incorrect password",
                });
            } else {
                const payload = {
                    "id": user.cID,
                    "role": "Co-ordinator"
                }
                const token = JwtOperation.generateToken(payload);
                return res.status(200).json({
                    token: token,
                    success: true,
                    message: "User Found",
                    new_user: false,
                    user: user,
                });
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                success: false,
                message: "Internal Server Error",
            });
        }

    };


    static subAdminLogin = async (req, res) => {
        try {
            const { username, password } = req.body;
            const [userRows] = await pool.query('SELECT * FROM SubAdmin WHERE id = ?', [username]);
            console.log(username)
            if (userRows.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "User not found",
                });
            }
            console.log("here")
            const user = userRows[0];
            console.log(user)
            if (user.password !== password) {
                return res.status(401).json({
                    success: false,
                    message: "Incorrect password",
                });
            } else {
                const payload = {
                    "id": user.sID,
                    "role": "Subadmin"
                }
                const token = JwtOperation.generateToken(payload);
                return res.status(201).json({
                    role: "subadmin",
                    token: token,
                    success: true,
                    message: "User Found",
                    new_user: false,
                    user: user,
                });
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                success: false,
                message: "Internal Server Error",
            });
        }
    }

    static employerRegistration = async (req, res) => {
        try {
            const { employerName, employerEmail, employerPassword } = req.body;

            // 1. Check if all required values are present
            if (!employerName || !employerEmail || !employerPassword) {
                return res.status(400).json({
                    success: false,
                    message: 'Please provide all required fields: employerName, employerEmail, employerPassword'
                });
            }

            // 2. Check if the employer with the same email already exists
            const emailCheckQuery = 'SELECT * FROM Employer WHERE employerEmail = ?';
            const [existingEmployer] = await pool.query(emailCheckQuery, [employerEmail]);

            if (existingEmployer.length > 0) {
                return res.status(409).json({
                    success: false,
                    message: 'An employer with this email already exists.'
                });
            }

            // 3. Insert the new employer details into the database
            const insertEmployerQuery = `
            INSERT INTO Employer (employerName, employerEmail, employerPassword,status)
            VALUES (?, ?, ?, ?)
        `;
            await pool.query(insertEmployerQuery, [employerName, employerEmail, employerPassword,"Pending"]);
            
            // 4. Respond with success status and message
            return res.status(201).json({
                success: true,
                message: 'Employer registered successfully.'
            });
        } catch (error) {
            console.error('Error during employer registration:', error);
            return res.status(500).json({
                success: false,
                message: 'An error occurred during registration. Please try again later.'
            });
        }
    }


    static employerLogin = async (req, res) => {
        try {
            const { email, password } = req.body;
    
            const [userRows] = await pool.query('SELECT * FROM Employer WHERE employerEmail = ?', [email]);
    
            if (userRows.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "User not found",
                });
            }
    
            const user = userRows[0];
    
            // Check if the employer status is pending
            if (user.status === "Pending") {
                return res.status(403).json({
                    success: false,
                    message: "Approval status is still pending.",
                });
            }
    
            console.log(user);
            if (user.employerPassword !== password) {
                return res.status(401).json({
                    success: false,
                    message: "Incorrect password",
                });
            } else {
                const payload = {
                    "id": user.employerID,
                    "role": "Employer"
                };
                const token = JwtOperation.generateToken(payload);
                return res.status(200).json({
                    token: token,
                    success: true,
                    user: user,
                    role: "Employer"
                });
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                success: false,
                message: "Internal Server Error",
            });
        }
    }
    

    static sendOtp = async(req,res)=>{
        try {
            const { email } = req.body;

            if (!email) {
                return res.status(400).json({ message: 'Email is required' });
            }


            const [userResult] = await pool.query('SELECT * FROM Employer WHERE employerEmail = ?', [email]);

            if (userResult.length !== 0) {
                return res.status(404).json({ message: 'User with this email already exist' });
            }

            // Generate OTP
            const otp = generateOTP();
            console.log(otp)

            // Send OTP email
            sendOTPMail(email, otp, 'Registration OTP');

            // Respond with success message
            return res.status(200).json({ message: 'OTP has been sent to your email', otp: otp, user: userResult[0] });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    };

    static forgetEmployerPassword = async (req, res) => {
    }


}



export default AuthHandler;
