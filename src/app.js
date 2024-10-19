const express = require("express")

const app = express();

app.use("/test",(req, res)=> {
    res.send("hello from dev")
});



app.listen(3000);