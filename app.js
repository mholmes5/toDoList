const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.set('view engine', 'ejs');

/*app.get("/", (req,res)=>{
  //res.sendFile(__dirname +"/index.html");
  var today = new Date
  var dayOfWeek = today.toLocaleString("en-US", {weekday: "long"});
  if(today.getDay()===6 || today.getDay()===0){
    res.send("<h1>Yay it is the weekend</h1><p>Today is " +dayOfWeek +".</p>");
  }else{
    res.set("Content-Type","text/html");
    res.write("<h2>Boo it is the weekend.</h2>");
    res.write("<h4>I have to work</h4>");
    res.write("<p>It is only " +dayOfWeek +".</p>");
    res.send();
  }
});*/

app.get("/", (req,res)=>{
  var today = new Date();
  var dayOfWeek = today.toLocaleString("en-US",{weekday: "long"});
  res.render('list', {day:dayOfWeek});
});

app.listen(3000, ()=>{
  console.log("Server started on port 3000");
});
