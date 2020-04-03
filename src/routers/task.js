const express = require('express')
const router = new express.Router()
const auth = require('../middlewares/auth')
const Stuff = require('../model/stuff')

router.get('/stuff',auth,async(req,res)=>{
    const own = req.user_id
    const match = {}
    if(req.query.complete){
        match.complete = req.query.complete === 'true'
    }
    try{
        const user = req.user
        await user.populate({
            path:'mytask',
            match,
            options:{
                limit:parseInt(req.query.limit)
                ,skip:parseInt(req.query.skip)
            }
        }).execPopulate()
        res.status(200).send(user.mytask)
    }catch{
        res.status(404).send()
    }
})
router.get('/stuff/:id',(request,response)=>{
    Stuff.findById(request.params.id).then(rs=>{
        if(!rs){
            response.status(404).send()
        }
        response.send(rs)
    }).catch(e=>{
        response.status(404).send()
    })
})
router.post('/stuff',auth,async(req,res)=>{
    const task = new Stuff({
        ...req.body,
        own:req.user._id
    })
    try{
        await task.save()
        res.status(201).send(task)
    }catch{
        res.status(400).send()
    }
} )
router.patch('/stuff/:id' ,async (req,res)=>{
    if (!req.params.id) return res.send({error : 'May not be Blank!'})
    const keyVal = Object.keys(req.body)
    const mainKeyVal = ['name' , 'complete' ,'desciption']
    const checked = keyVal.every(checker => mainKeyVal.includes(checker))
    if (!checked) {
        return res.status(400).send({error : 'Cannot add your different key value ! '})
    }
    
    try {
        const stuff = await Stuff.findByIdAndUpdate(req.params.id , req.body ,{new:true, runValidators :true})
        if(!stuff){
           return res.status(400).send()
        }
        res.send(stuff)
        console.log('Update Success ')
    } catch (e) {
        console.log(e)
        res.status(404).send()
    }
})
router.delete('/stuff/:id' ,async (req,res)=>{
    if(!req.params.id) return res.send({error:'May be not blank your ID to delete !'})
    try {
        const stuffToDel = await Stuff.findByIdAndDelete(req.params.id)
        if(!stuffToDel ) return res.status(400).send()
        res.send(stuffToDel)
    }catch (e){
        console.log(e)
        res.status(404).send()
    }
})

module.exports = router