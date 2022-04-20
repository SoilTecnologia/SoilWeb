const cron = require('node-cron')
import express from 'express';

var app = express();
const api = 'http://localhost:3308/'


function SendAction(){
  console.log("Enviar action quando necessário")
}

app.get('/scheduling/getAllScheduling',(req, res)=>{
  

})

module.exports = cron.schedule('*/1 * * * *', SendAction, {
  scheduled: false
})