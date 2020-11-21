const express = require('express');
const mongose = require('mongoose');

//storing the passwords and confidential data
require('dotenv').config();

const app = express();
const port = process.env.PORT || 8010;
const uri = process.env.ATLAS_URI_SERVER;

//import the paths
const authRoute = require('./routes/auth');
const mainPage = require('./routes/mainroute');

//database connection
mongose.connect(uri,{useUnifiedTopology:true,useNewUrlParser:true,useCreateIndex:true});
const connection = mongose.connection;
connection.once('open', ()=>{console.log('(+) Connected to database')});

//Middleware
app.use(express.json());


//Routes Middleware
app.use('/api/main',mainPage);
app.use('/api/user',authRoute);

app.listen(port, () =>{
    console.log(`(+)Server is up and Running in the port ${port}`);
});