import { Request,Response,NextFunction } from 'express';
import jwt, { JwtPayload, VerifyErrors } from "jsonwebtoken";
import { COOKIE_NAME } from './constants.js';

export const createToken = (id: string, email: string, expiresIn: string)=>{
    const payload = { id,email };
    const secret = process.env.JWT_SECRET;
     if (!secret) throw new Error("JWT_SECRET is not defined");
    // const token = jwt.sign(payload, process.env.JWT_SECRET,{
    //     expiresIn,

    // }); 
    return jwt.sign(payload, secret, {
    expiresIn: expiresIn as jwt.SignOptions["expiresIn"],
  });
    // return token;
}

export const verifyToken = async(req: Request, res: Response, next: NextFunction)=>{
const token = req.signedCookies[`${COOKIE_NAME}`];
if(!token || token.trim()===""){
    return res.status(401).json({message:"Token not received"})
}
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not defined");

return new Promise<void>((resolve,reject)=>{
    return jwt.verify(token, secret , (err: VerifyErrors | null, decoded: JwtPayload | string | undefined)=>{
        if(err){
            reject(err.message);
            return res.status(401).json({message: "JWT token expired"});
        } else {
            console.log("Token verification successfull");
            resolve();
            res.locals.jwtData = decoded;
            return next();
        }
    })
})
};
