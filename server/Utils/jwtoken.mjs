import jwt from 'jsonwebtoken'

class JwtOperation{

    static generateToken(id){
        return jwt.sign(id,process.env.JWT_SECRET)
    }
    
    static verifyToken(token){
        return jwt.verify(token,process.env.JWT_SECRET)
    }

}


export default JwtOperation;