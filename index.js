const express = require('express');
const swaggerUi = require("swagger-ui-express")
const swaggerDocument = require("./swagger.json");
const cors = require('cors');
// const app = express();
const app = require("./server").expressApp
const server = require("./server").httServer
// require("./src/service/connectSocket")
const dotenv = require('dotenv');
dotenv.config({path:'./config.env'})
const bodyParser = require('body-parser');
//Route Imports
const admin=require('./src/routes/adminroutes');
const userRequest = require('./src/routes/userroutes');
const payment = require('./src/routes/paymentRoute');

require('./src/db/connection')

app.use(cors({
  origin:"*"
})); 


const PORT=process.env.PORT;
const HOST= process.env.HOST;
app.use(cors({
  origin:"*"
})); 

app.use((req,res,next)=>{
  console.log(new Date(Date.now()));
  console.log(req.url);
  console.log("req====",Object.keys(req));
  next()
})

app.use(express.json());



app.use('/user', userRequest);
app.use('/payment', payment);
app.use('/admin', admin);



app.use(
  '/api-docs',
  swaggerUi.serve, 
  swaggerUi.setup(swaggerDocument)
);

server.listen(PORT,HOST,(err)=>{
    if(!err){console.log("server started",PORT)}
    else{
      console.log(err)
    }
});