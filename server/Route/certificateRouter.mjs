import express from 'express'
import CertificateHandler from '../Handler/CertificateHandler.mjs'

const CertifcateRoute = express.Router()

CertifcateRoute.post("/add_certificate",CertificateHandler.createCertificate)

CertifcateRoute.post("/fetch_certificate",CertificateHandler.fetchCertificate)

CertifcateRoute.put("/update_certificate",CertificateHandler.updateCertificate)

CertifcateRoute.delete("/delete_certificate",CertificateHandler.deleteCertificate)
export default CertifcateRoute