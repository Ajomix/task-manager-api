const express = require('express')
require('./db/mongoose')

const app = express()
const stuffRouter = require('./routers/task')
const userRouter = require('./routers/users')

const port = process.env.PORT

app.use(express.json())
app.use(stuffRouter)
app.use(userRouter) 

app.listen(port,()=>{
    console.log(port)
})

// const user = require('./model/User')
// const task = require('./model/stuff')
// const main = async ()=>{
//     //5e7f5820cb28781f8051f701
//     const users = await user.findById('5e7f65b48067dd196c472436')
//     await users.populate('mytask').execPopulate()
//     console.log(users.mytask)
// }
// main()