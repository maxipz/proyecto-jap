const express = require("express");
const cors = require("cors");
const fs = require('fs'); 

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

// Acceder a los datos de los archivos JSON
const cats = require('./basededatos/cats/cat.json');
const cart = require('./basededatos/cart/buy.json');
const sell = require('./basededatos/sell/publish.json');
const userCart = require('./basededatos/user_cart/25801.json');
const catsProductsFolderPath = './basededatos/cats_products/';
const productsFolderPath = './basededatos/products/';
const productsCommentsFolderPath = './basededatos/products_comments/';

app.get("/", (req, res) => {
  res.send("<h1>Bienvenid@ al servidor</h1>");
});

app.get('/cats', (req, res) => {
  res.json(cats);
});

app.get('/cart', (req, res) => {
  res.json(cart);
});

app.get('/sell', (req, res) => {
  res.json(sell);
});

app.get('/userCart', (req, res) => {
  res.json(userCart);
});

app.get('/cats_products/:cat_id', (req, res) => {
  try {
    const catId = req.params.cat_id;  // Asegúrate de usar el mismo nombre de parámetro que en la ruta
    const filePath = `${catsProductsFolderPath}${catId}.json`;
    
    // Leer el archivo JSON de forma síncrona y parsearlo
    const data = fs.readFileSync(filePath, 'utf-8');
    const product = JSON.parse(data);

    res.json(product);
  } catch (err) {
    console.error('Error al leer el archivo de producto de cats_products:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});



app.get('/products/:productId', (req, res) => {
  try {
    const productId = req.params.productId;
    const filePath = `${productsFolderPath}${productId}.json`;
    
    // Leer el archivo JSON de forma síncrona y parsearlo
    const data = fs.readFileSync(filePath, 'utf-8');
    const product = JSON.parse(data);

    res.json(product);
  } catch (err) {
    console.error('Error al leer el archivo de producto:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});


app.get('/products_comments/:comment_id', (req, res) => {
  try {
    const commentId = req.params.comment_id;  // Asegúrate de usar el mismo nombre de parámetro que en la ruta
    const filePath = `${productsCommentsFolderPath}${commentId}.json`;
    
    // Leer el archivo JSON de forma síncrona y parsearlo
    const data = fs.readFileSync(filePath, 'utf-8');
    const comments = JSON.parse(data);

    res.json(comments);
  } catch (err) {
    console.error('Error al leer el archivo de comentarios de productos:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});


app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
