const express = require("express");
const cors  = require("cors");


const cats = require('./basededatos/cats/cat.json');





const app = express();
const port = 3000;



app.use(express.json()); 
app.use(cors());


app.get("/", (req, res) => {
  res.send("<h1>Bienvenid@ al servidor</h1>");
});


app.get('/cats', (req, res)=>{
  res.json(cats)
  })




app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
  });