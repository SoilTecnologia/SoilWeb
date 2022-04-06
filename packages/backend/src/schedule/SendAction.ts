const cron = require('node-cron')




function SendAction(){
  console.log("Enviar action quando necessário")
}

module.exports = cron.schedule('*/1 * * * *', SendAction, {
  scheduled: false
})