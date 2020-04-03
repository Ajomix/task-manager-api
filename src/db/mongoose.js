const mongoose = require('mongoose')
mongoose.connect(process.env.connect,{
    useNewUrlParser:true,useUnifiedTopology: true,useFindAndModify:false
})
mongoose.set('useCreateIndex', true);
