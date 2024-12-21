const jwt = require('jsonwebtoken');

exports.auth = async(req,res,next)=>{
    //console.log("here");
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
            //console.log(decode);
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

exports.isUser = (req,res,next)=>{
    try {
        //console.log("yahatak");
        //console.log(req.user.role);
        if(req.user.role !=="User"){
            return res.status(401).json({
                success:false,
                message:"This is protected route for user"
            })
        }
    } catch (error) {
        res.status(500).json({
            success:false,
            message:"user role can't be verified, please try again."
        });
    }
    next();
}

exports.isAdmin = (req , res , next) => {
    try{
        if(req.user.role !== "Admin"){
            return res.status(401).json({
                success : false,
                message : "This is the protected route for the Admins only"
            })
        }
    }catch(error){
        res.status(500).json({
            success : false,
            message : "Admin role cannot be verified , please try again",
        });
    }
    //Call the next handler function
    next();
}