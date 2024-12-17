import {pool} from '../Database/database.mjs'

class CertificateHandler{

    static createCertificate = async (req, res) => {
        const { certificateName, certificateOrgnization, studentId } = req.body;
        
        if (!certificateName || !certificateOrgnization || !studentId) {
          return res.status(400).json({
            success: false,
            message: 'certificateName, certificateOrgnization, and studentId are required.',
          });
        }

        console.log("jhhh")
      
        try {
          // Query to check if the certificate already exists
          const checkCertificateQuery = `
            SELECT * FROM Certificate WHERE certificateName = ? AND certificateOrgnization = ? AND studentID = ?`;
          const [existingCertificate] = await pool.query(checkCertificateQuery, [
            certificateName,
            certificateOrgnization,
            studentId,
          ]);
      
          if (existingCertificate.length > 0) {
            return res.status(409).json({
              success: false,
              message: 'Certificate with the same name and organization already exists for this student.',
            });
          }
      
          // Insert the new certificate into the database
          const insertCertificateQuery = `
            INSERT INTO Certificate (certificateName, certificateOrgnization, studentID)
            VALUES (?, ?, ?)`;
          const [result] = await pool.query(insertCertificateQuery, [
            certificateName,
            certificateOrgnization,
            studentId,
          ]);
      
          // Return success with the created certificate ID
          return res.status(201).json({
            success: true,
            message: 'Certificate added successfully.',
            certificateID: result.insertId,
          });
        } catch (error) {
          // Handle any errors
          console.error('Error adding certificate:', error);
          return res.status(500).json({
            success: false,
            message: 'An error occurred while adding the certificate.',
          });
        }
      };

      static fetchCertificate = async (req, res) => {
        const { studentId } = req.body; // Assuming studentId is sent in the body of the request
      console.log("here")
        if (!studentId) {
          return res.status(400).json({
            success: false,
            message: "Student ID is required.",
          });
        }
      
        try {
          // Query to fetch certificates for the given studentId
          const fetchCertificatesQuery = `
            SELECT * FROM Certificate WHERE studentID = ?
          `;
      
          const [certificates] = await pool.query(fetchCertificatesQuery, [studentId]);
      
          if (certificates.length === 0) {
            // No certificates found for the given student ID
            return res.status(404).json({
              success: false,
              message: "No certificates found for the specified student ID.",
            });
          }
      
          // Return the list of certificates found
          return res.status(200).json({
            success: true,
            message: "Certificates retrieved successfully.",
            data: certificates,
          });
        } catch (error) {
          console.error("Error fetching certificates:", error);
          return res.status(500).json({
            success: false,
            message: "An error occurred while fetching certificates.",
          });
        }
      };

      static updateCertificate = async (req, res) => {
        const { certificateID, certificateName, certificateOrgnization } = req.body;
      
        // Check if all required fields are provided
        if (!certificateID || !certificateName || !certificateOrgnization) {
          return res.status(400).json({ success: false, message: "All fields are required." });
        }
      
        try {
          // Check if the certificate exists
          const checkCertificateQuery = 'SELECT * FROM Certificate WHERE certificateID = ?';
          const [certificate] = await pool.query(checkCertificateQuery, [certificateID]);
      
          if (certificate.length === 0) {
            return res.status(404).json({ success: false, message: "Certificate not found." });
          }
      
          // Update the certificate in the database
          const updateCertificateQuery = `
            UPDATE Certificate 
            SET certificateName = ?, certificateOrgnization = ? 
            WHERE certificateID = ?
          `;
          await pool.query(updateCertificateQuery, [certificateName, certificateOrgnization, certificateID]);
      
          return res.status(200).json({ success: true, message: "Certificate updated successfully." });
        } catch (error) {
          console.error("Error updating certificate:", error);
          return res.status(500).json({ success: false, message: "An error occurred while updating the certificate." });
        }
      };
      
      static deleteCertificate = async (req, res) => {
        const { certificateID } = req.body;
      
        // Check if certificateID is provided
        if (!certificateID) {
          return res.status(400).json({ success: false, message: "Certificate ID is required." });
        }
      
        try {
          // Check if the certificate exists in the database
          const checkCertificateQuery = 'SELECT * FROM Certificate WHERE certificateID = ?';
          const [certificate] = await pool.query(checkCertificateQuery, [certificateID]);
      
          if (certificate.length === 0) {
            return res.status(404).json({ success: false, message: "Certificate not found." });
          }
      
          // Delete the certificate
          const deleteCertificateQuery = 'DELETE FROM Certificate WHERE certificateID = ?';
          await pool.query(deleteCertificateQuery, [certificateID]);
      
          return res.status(200).json({ success: true, message: "Certificate deleted successfully." });
        } catch (error) {
          console.error("Error deleting certificate:", error);
          return res.status(500).json({ success: false, message: "An error occurred while deleting the certificate." });
        }
      };
      
      
      
}

export default CertificateHandler