//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");

const date = require(__dirname + "/date.js");

const day = date.getDate();
const year = date.getYear();

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

const listSchema = {
  name: {
    type: String,
    required: true
  },
  items: [itemsSchema]
};

const List = mongoose.model("List", listSchema);

const defaultItems = [item1, item2, item3];

// Item.insertMany(defaultItems, (err)=>{
//   if(err){
//     console.log(err);
//   }else{
//     console.log("Default Items saved to database successfully");
//   }
// });

app.get("/", function(req, res) {

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
      res.render("list", {listTitle: day, newListItems: foundItems, year:year});
    }

  });



});

app.get("/:customListName", function(req,res){
  const customListName = _.capitalize(req.params.customListName);

  List.findOne({name:customListName}, function(err,foundList){
    if(!err){
      if(!foundList){

        const list = new List({
          name: customListName,
          items: defaultItems
        });

        list.save();
        console.log("List not Found");
        res.redirect("/" +customListName);
      }else{
        //console.log("Found List: " +foundList);
        res.render("list", {listTitle:foundList.name, newListItems:foundList.items, year:year})
      }
    }else{
      console.log(err);
    }
    //res.render("list", {listTitle:customListName, newListItems:result, year:year})
  });


});

app.post("/", function(req, res){

  const itemName = req.body.newItem;
  const listName = req.body.list;

  const item = new Item({
    name: itemName
  });

  if(listName === day){
    item.save(item, function (err,result) {
      if(!err){
        res.redirect("/");
      }
    });
  }else{
    List.findOne({name: listName}, function(err,foundList){
      foundList.items.push(item);
      foundList.save(item, function (err,result) {
        if(!err){
          res.redirect("/" +foundList.name);
        }
      });
    });
  }
});

app.post("/delete", function(req,res){
  const itemId = req.body.checkbox;
  const listName = req.body.listName;

  if(listName === day){
    Item.findByIdAndDelete(itemId,function(err){
      if(err){
        console.log(err);
      }else{
        res.redirect("/");
      }
    });
  }else{
    List.findOneAndUpdate(
      {name: listName},
      {$pull: {items:{_id:itemId}}},
      function(err,foundList){
        if(!err){
          res.redirect("/" +listName);
        }
      });
  }
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
