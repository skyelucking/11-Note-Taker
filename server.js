var bodyParser = require('body-parser');
var express = require('express');
var app = express ();
var path = require('path');
var PORT = process.env.PORT || 8080;


//parse application
app.use(express.urlencoded({ extended: true }))

//parse application/json
app.use(bodyParser.json())
app.use(express.json());
app.use(express.static("public"));

require('./routing/api-routes.js')(app);
require('./routing/html-routes.js')(app);


app.listen(PORT, function (){
    console.log("App listening on PORT " + PORT)
});