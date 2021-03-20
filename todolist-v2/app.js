//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const date = require(__dirname + "/date.js");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todoListDB", {useNewUrlParser: true, useUnifiedTopology: true});

const itemsSchema = {
  name: {
    type: String,
    required: true
  }
};

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
  name: "Book Flights"
});

const item2 = new Item({
  name: "Get Covid Test"
});

const item3 = new Item({
  name: "Get Visa"
});

const defaultItems = [item1, item2, item3];

// Item.insertMany(defaultItems, (err)=>{
//   if(err){
//     console.log(err);
//   }else{
//     console.log("Default Items saved to database successfully");
//   }
// });

app.get("/", function(req, res) {
  const day = date.getDate();
  var tasks =[];

  Item.find({},(err, foundItems)=>{

    if(foundItems.length === 0){
      Item.insertMany(defaultItems, (err)=>{
        if(err){
          console.log(err);
        }else{
          console.log("Default Items saved to database successfully");
          res.redirect("/");
        }
      });

    }else{
      //console.log(foundItems);
      res.render("list", {listTitle: day, newListItems: foundItems});
    }

  });



});

app.get("/:customListName", function(req,res){
  console.log(req.params.customListName);
});

app.post("/", function(req, res){

  const itemName = req.body.newItem
  const item = new Item({
    name: itemName
  });

  item.save(item, function (err,result) {
    if(err){
      console.log("Error saving: " +err);
    } else {
      res.redirect("/");
    }
  });

});

app.post("/delete", function(req,res){
  const itemId = req.body.checkbox;

  Item.findByIdAndDelete(itemId,function(err){
    if(err){
      console.log(err);
    }else{
      res.redirect("/");
    }
  })
});

app.get("/:list", function(req,res){
  console.log(req.params.list);
});

app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
