//This packages allow you to specify the file path where files are located on the server
const path = require("path");
//This packages allow you access to the file system so you can read, write, or modify files
const fs = require("fs");
// This is a variable that loads the data from the json file that the application works with into an array we'll be working with
const notesArray = require("../db/db.json");
// This is a variable that requires a package that creates a unique id for our records - universally unique identifier
const { v4: uuidv4 } = require('uuid');

//Below defines the routes for interacting with data whether recieving or sending
module.exports = app => {
//Returns the contents of notesArray back to the client that requests the data
    app.get("/api/notes", (req, res) => {
        res.json(notesArray);
    })
//Route that responds to a post request that recieves data from the client(web browswer) and adds that data to the notesArray before it gets written back to the source file. It also returns back to the client the new note via req.body. 
    app.post("/api/notes", (req, res) => {
        // Variable that holds the client input
        const newNote = req.body;
        // This is a reference to the file that will be written to
        const file = path.join(__dirname, "../db/db.json");
        // Creates the unique id property/key and gets a unique id generated  the uuidv4 package
        newNote.id = uuidv4();
        // Adds a newNote object to the array
        notesArray.push(newNote);
        // Writes the entire updated notesArray to the db.json file
        fs.writeFile(file, JSON.stringify(notesArray, null, 4), err => {
            if (err) throw err;
            console.log("New note saved!");
        });
        //This sends back the newNote object to the client (usually the web browser)
        res.send(newNote);
    });

    //Route that reponds to the delete request that removes an object from db.json based on a unique id
    // The URL will pass the id that will be removed 
    app.delete("/api/notes/:id", (req, res) => {
    //Sets id to the param id value given by client (by clicking the delete button)
        const id = req.params.id;
    // This is a reference to the file that will be modified
        const file = path.join(__dirname, "../db/db.json");
    // For each object in the notesArray (declared here as note)    
        for(const note of notesArray){
        // If the note id equals the param id that was passed by the client    
                if(id === note.id) {
        // then the index is equal to the index of the note object in the notesArray            
                const index = notesArray.indexOf(note);
        //Splice (removes) the note located at the value of the index. The second argument means only remove 1 instance of it
                notesArray.splice(index, 1);
        // Writes the entire updated notesArray to the db.json file so that the file is updated
                fs.writeFile(file, JSON.stringify(notesArray, null, 4), err => {
        // In case the file cannot be written, an error will be thrown
                    if (err) throw err;
        // Logs confirmation message that note was deleted
                    console.log("Your note was deleted.");
                });
        // Ends the request session and notifies the client the request has been processed
                res.end();
            }
        }
    })
}