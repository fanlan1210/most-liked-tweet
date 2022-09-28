require("dotenv").config();
const express = require("express");

const twitterQuery = require('./main');

const app = express();
const port = process.env.PORT || 3000;
app.use(express.static("public"));

app.get("/user/:username", (req, res)=>{
  twitterQuery(req.params.username)
  .then( (data) => {
    data.profile_image_url = data.profile_image_url.replace("_normal", "");
    res.json(data);
  },
  (err) =>{
    res.status(404).json({error: err});
  }
);
});

app.listen(port, ()=>{
  console.log("server starting on port: " + port);
});
