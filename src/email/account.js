const nodemailer = require('nodemailer')
const transporter =  nodemailer.createTransport({
    service:'gmail',
    auth:{
            type: 'OAuth2',
            user:'dungbacninh.2002@gmail.com',
            clientId:process.env.clientId,
            clientSecret:process.env.clientSecret,
            refreshToken:process.env.refreshToken
            ,accessToken:process.env.accessToken
    }
})
const sendWellcome = (email, name)=>{
    transporter.sendMail({
        to:email, 
        from:'Task Manager App <dungbacninh.2002@gmail.com>',
        subject:'Thanks For Joining',
        text:`Hello ${name} thanks for joining with us , i expect you have many time to happy with my application .Thanks! `
    },(err,res)=>{
        console.log('Send Create mail Success ')
        if(err) console.log('Email sending Error')
    })
}
const sendCancledUser = (email,name)=>{
    transporter.sendMail({
        to:email, 
        from:'Task Manager App <dungbacninh.2002@gmail.com>',
        subject:'Sorry About my App ',
        text:`Hello ${name} sorry about my app make u feel unsastifield , i expected you will comeback`
    },(err, res)=>{
        console.log('Canceled Email Succes ')
        if(err)console.log('Email sending Error')
    })
}
module.exports = {
    sendWellcome,
    sendCancledUser
}