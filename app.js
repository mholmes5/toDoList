const express = require("express");
const bodyParser = require("body-parser");

const app = express();

let tasks =["Buy Food","Cook Food","Eat Food"];

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
/*app.get("/", (req,res)=>{
  //res.sendFile(__dirname +"/index.html");
  let today = new Date
  let dayOfWeek = today.toLocaleString("en-US", {weekday: "long"});
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
  let today = new Date();

  let options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }

  let day= today.toLocaleDateString("en-US",options);
  res.render('list', {day:day, newListItems:tasks});
});


app.post("/",(req,res)=>{
  tasks.push(req.body.newTask);
  res.redirect("/");

});


app.listen(3000, ()=>{
  console.log("Server started on port 3000");
});
