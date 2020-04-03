const express = require('express')
const router = new express.Router()
const auth = require('../middlewares/auth')
const Users = require('../model/User')
const multer = require('multer')
const {sendWellcome,sendCancledUser} = require('../email/account')

router.post('/users',async (req,res)=>{
    if(!req.body) return res.status(400).send({error: 'bad request'})
    try{
        const user = new Users(req.body)
        const token = await user.generateTokens()
        const checkOnce = await user.save()
        if(!user || !checkOnce) return res.send({error: 'Cant not create new users '})
        sendWellcome(user.email,user.name)
        res.status(201).send({user,token})
    }catch(e){
        res.status(400).send(e)
    }
    
})
router.get('/users/me',auth,async (req,res)=>{
    res.send(req.user)
 })
router.post('/users/logout',auth,async (req,res)=>{
    try{
        req.user.tokens = req.user.tokens.filter((token)=>{
            return token.token !== req.token
        })
        await req.user.save() 
        res.status(200).send()
    }catch{
        res.status(500).send()
    }
})
router.post('/users/logoutAll' ,auth,async (req,res)=>{
    try {
        req.user.tokens = req.user.tokens.splice()
        await req.user.save()
        res.status(200).send()
    }catch{
        res.status(500).send()
    }
})
router.post('/users/login',async(req, res )=>{
    if(!req.body.email || !req.body.password) return res.status(400).send({error:' Bad request , no have data to excute'})
    try{
        const user = await Users.credenticalUser(req.body.email,req.body.password)
        const token = await user.generateTokens()
        res.send({user,token})
    }catch(e){
        res.status(404).send()
    }
})


router.get('/users/:id' , async (req,res)=>{
    if(!req.params.id) return res.status(400).send({error:'Not have id or id illegal!'})
    try{
        const user = await Users.findById(req.params.id)
        if(!user) return res.status(404).send({error: 'Not have user like id parameter'})
        res.status(200).send(user)
    }catch(e){
        console.log(e)
        res.status(404).send()
    } 
  
})

router.patch('/users/me',auth,async(req,res)=>{
    const keyVal = Object.keys(req.body)
    const criteria = ['name','age','username','password','email']

    const checked = keyVal.every(val=> criteria.includes(val))
    if(!checked) return res.status(400).send({error : 'Cannot add your different key value ! '})
    try{
        keyVal.forEach(key => req.user[key] = req.body[key])
        await req.user.save() 
        res.send(user)
    }catch(e){
        console.log(e)
        res.status(400).send()
    }
})

router.delete('/users/me' ,auth,async(req,res)=>{
    try{
       sendCancledUser(req.user.email,req.user.name)
       await req.user.remove()
       res.send(req.user)
    }catch (e){
        console.log(e)
        res.status(400).send()
    }
})

 //upload config out 
const upload = multer({
limits:{
    fileSize:1000000
},
fileFilter(req,file,cb){
    if(!file.originalname.match(/.(jpg|jpeg|png)$/)){
        return cb(new Error('Please upload accurate file PNG or JPG or JPEG'))
    }
    cb(undefined,true)
}
})

router.post('/users/me/avatar' ,auth,upload.single('avatar'), async(req,res)=>{
    req.user.avatar = req.file.buffer
    req.user.avatar = req.file.buffer
    await req.user.save()
    res.send()
},(error,req,res,next)=>{
    console.log(req.file)
    res.status(400).send({ error:error.message})
})


router.delete('/users/avatar/me',auth,async(req,res)=>{
    try{
        req.user.avatar = ''
        await req.user.save()
        res.send(req.user)
    }catch{
        res.status(400).send()
    }
})

module.exports = router