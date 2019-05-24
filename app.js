const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const express = require("express");

const app = express();
const port = 3000;

//Enable bodyParser
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

//connect to mongodb w/ mongoose
mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser: true});



const articleSchema = {
  title: String,
  content: String
};

const Article = mongoose.model("Article", articleSchema);

///////Request Targeting all Articles//////////////////////////

app.route("/articles")
.get(function(req, res){
  Article.find({}, function(err, foundArticles){
    if(!err){
      res.send(foundArticles);
    } else {
      console.log(err);
    }
  });
})

.post(function(req, res){
  let bodyTitle = req.body.title;
  let bodyContent = req.body.content;

  const newArticle = new Article({
    title: bodyTitle,
    content: bodyContent
  });
  newArticle.save(function(err){
    if (!err){
      res.send("Successfully added a new article.");
    } else {
      res.send(err);
    }
  });
})

.delete(function(req, res){
  Article.deleteMany({}, function(err){
    if (!err){
      res.send("Artile model successfully emptied out.");
    } else {
      res.send(err);
    }
  });
});

////////Request Targeting A Specific Article//////////////////////////

app.route("/articles/:articleTitle")
.get(function(req, res){
  Article.findOne({title: req.params.articleTitle}, function(err, foundArticle){
    if(foundArticle){
      res.send(foundArticle);
      console.log(foundArticle);
    } else {
      res.send("No articles matching that title was found.");
      console.log(err);
    }
  });
})

.put(function(req, res){
  Article.update(
    {title: req.params.articleTitle},
    {title: req.body.title, content: req.body.content},
    {overwrite: true},
    function(err){
      if (!err){
        res.send("Succesfully updated article.");
      } else {
        res.send(err);
      }
  });
})

.patch(function(req, res){
  Article.update(
    {title: req.params.articleTitle},
    {$set: req.body},
    function(err){
      if (!err){
        res.send("Succesfully updated article.");
      } else {
        res.send(err);
      }
  });
})

.delete(function(req, res){
  Article.deleteOne({title: req.params.articleTitle}, function(err){
    if(!err){
      res.send("Successfully deleted article.");
    } else {
      res.send(err);
    }
  });
});

//Start server
app.listen(port, function(){
  console.log("Server running on port:" + port);
});
