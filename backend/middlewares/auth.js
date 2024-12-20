const jwt = require('jsonwebtoken');

exports.auth = async(req,res,next)=>{
    try {
        const token= req.cookies.token || req.body.token || req.header("Authorisation").replace("Bearer ","");

        if(!token){
            return res.status(401).json({
                success : false,
                message : "Token is missing",
            });
        }
        try{
            const decode = await jwt.verify(token , process.env.JWT_SECRET);
            console.log(decode);
            req.user = decode;
        }catch(error){
            return res.status(401).json({
                success : false,
                message : "Token is Invalid",
            })
        }

        next();
    } catch (error) {
        return res.status(401).json({
            success : false,
            message : "Something went wrong while validation of the token",
        })
    }
}