const express = require("express");
const bodyParser = require("body-parser");

const app = express();

let tasks =[];
let workItems = [];

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
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
    month: 'long',
    day: 'numeric'
  }

  let day= today.toLocaleDateString("en-US",options);
  res.render('list', {listTitle:day, newListItems:tasks});
});

app.post("/",(req,res)=>{
  //console.log(req.body);
  if(req.body.list==="Work"){
    workItems.push(req.body.newTask);
    res.redirect("/" +req.body.list);
  }else{
    tasks.push(req.body.newTask);
    res.redirect("/");
  }

});

app.get("/work", (req,res)=>{
  res.render("list", {listTitle:"Work List", newListItems:workItems})
});


app.post("/work",(req,res)=>{
  workItems.push(req.body.newTask);
  res.redirect("/work");

});

app.get("/about",(req,res)=>{
  res.render("about.ejs");
})

app.listen(3000, ()=>{
  console.log("Server started on port 3000");
});
