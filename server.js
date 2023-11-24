const express = require('express');
const path = require('path');
const fs = require('fs');

const PORT = process.env.port || 3001;

const app = express();

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

// GET Route for homepage
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

//GET Route for notes
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

app.get('/api/notes', (req, res) => {
  fs.readFile('./db/db.json', (err, data) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log(data);

      var notesData = JSON.parse(data)
      console.log(notesData)

      res.send(notesData)
    });
});

app.post('/api/notes', (req, res) => {
  console.log(req.body)
  fs.readFile('./db/db.json', (err, data) => {
      if (err) {
        console.error(err);
        return;
      }

      const newNotes = {
          title:req.body.title,
          text:req.body.text
      }

      var notesData = JSON.parse(data)
      console.log(notesData)

      notesData.push(newNotes);

      fs.writeFile('./db/db.json', JSON.stringify(notesData), (err, data) => {
          if (err) {
              console.error(err);
              return;
          }
  
          res.send(notesData)
      });
    });

  });

      app.delete("/api/notes/:id", function(req, res) {
      console.log("req params", req.params.id)
      fs.readFile('./db/db.json', 'utf-8', (err, data) => {
          if (err) {
              console.error(err);
              return;
          };
          let notes = JSON.parse(data);
          const updatedNotes = notes.filter(({ id }) => id !== req.params.id);
          fs.writeFile('./db/db.json', JSON.stringify(updatedNotes), (err) => {
              if (err) {
                  console.error(err);
                  return;
              }
              res.json({ message: 'Note deleted successfully' })
          });
      });   

});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/index.html'))
});

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);