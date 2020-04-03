const mongoose = require('mongoose') 
const stuffSchema = new mongoose.Schema({
    name:{
        type:String
        ,validate:(value)=>{
            if(value.length < 6){
                throw new Error('character of name need to be > 6 ')
            }
        }
    },
    desciption:{
        type:String,
        validate :value=>{
            if(!value) throw new Error('May not be Blank ')
        }
    },
    complete: {
        type:Boolean,
        default: 'false'
    },
    own:{
        type:mongoose.Schema.Types.ObjectId,
        require:true,
        ref:'Users'
    }
},{
    timestamps:true
})
const Stuff = mongoose.model('stuff' ,stuffSchema)
module.exports =Stuff