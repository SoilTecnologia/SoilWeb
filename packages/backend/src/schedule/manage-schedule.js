const SendAction = require("./SendAction")

class manageSchedule{
  constructor(){
    this.jobs = [SendAction]
  }

  run(){
    this.jobs.forEach(job => job.start())
  }
}

module.exports = new manageSchedule()