const express = require("express"); 

const app = express();
const port = 3000;

app.use(express.json()); 


app.get("/", (req, res) => {
  res.send("<h1>Bienvenid@ al servidor</h1>");
});

let cats = require('./basededatos/cats/cat.json')
app.get('/cats', (req, res)=>{
  res.send("<h1>Bienvenid@ al servidor</h1>");
  })



app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
  });