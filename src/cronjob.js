const cron = require("node-cron")
cron.schedule("* * * * *", ()=> {
    console.log('cron job scheduled', new Date())
})