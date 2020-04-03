const mongoose = require('mongoose') 
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('./stuff')
const userSchema = new mongoose.Schema({ 
    name:{
        type:String , 
        require: true , 
        trim :true ,
        validate: value =>{
            if(value.length < 10) throw new Error('Lenth of your name need to be > 10 character ')
        }
    }
    ,
    age :{
        require:true ,
        trim:true ,
        type :Number,
        validate: value => {
            if (value < 10 ) throw new Error('Your age need to be > 10 year old ')
        }
    }
    ,
    username : {
        type:String,
        require:true, 
        validate : (value)=>{
                if(value.length < 6) throw new Error ('Length of username need to be > 6 character')
                if(value.includes(' ')) throw new Error('dont need \'  \' in your username ')
        },  
        trim:true
    },
    email : {
        type: String, 
        unique :true , 
        require:true,
        lowercase : true ,
        validate:value =>{
          if (!validator.isEmail(value)){
                throw new Error('email is illegal!')
          }
        
        },
        trim: true
    },password:{
        require: true , 
        type: String , 
        validate: value =>{
            if(value.length < 4) throw new Error('password need > 6 character ')
        },
        trim:true
    },
    tokens:[{
        token:{
            type:String, 
            require:true,
            
        }
    }]
    ,avatar:{
        type:Buffer
    }
},{
    timestamps:true
})
userSchema.virtual('mytask',{
    ref:'stuff',
    localField:'_id',
    foreignField:'own' 
})
userSchema.methods.toJSON = function(){
    const user  = this 
    const userObject = user.toObject()

    delete userObject.tokens
    delete userObject.password
    
    return userObject
   
}
userSchema.methods.generateTokens = async function (){
    const user = this 
    const token = jwt.sign({_id:user.id.toString()} , process.env.jwtVerify)
    user.tokens = user.tokens.concat({token})
    await user.save().then(()=>console.log('release tokens success ,concat ')).catch(e=>console.log(e))
    return token 
}
userSchema.statics.credenticalUser =  async (email,password)=>{
    const user = await Users.findOne({ email })
    if(!user) return {error : 'Wrong Email ? try again ! '}
    const isMatch = await bcrypt.compare(password,user.password)
    if(!isMatch) return {error: 'Invalid password , please try again !'}
    return user 
}
userSchema.pre('save' , async function (next){
    const user = this 
    console.log('middware is Running')
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password,8)
    }
    next()
})
userSchema.pre('remove',async function (next){
    const user = this 
    await Task.deleteMany({own:user._id})
    next()
})
const Users = mongoose.model('Users' , userSchema)
module.exports = Users 