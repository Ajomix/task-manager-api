const jwt = require('jsonwebtoken')
const Users = require('../model/User')
const auth = async (req,res,next)=>{
   try{
        const token = req.header('Authorization').replace('Bearer ','')
        const decode = jwt.verify(token,process.env.jwtVerify)
        const user = await Users.findOne({_id:decode._id , 'tokens.token':token})
        if(!user){
            throw new Error()
        }
        req.user = user
        req.token = token
        next()
   }catch(e){
       console.log(e)
       res.status(401).send('please check Authoriztion ')
   }
}

module.exports = auth