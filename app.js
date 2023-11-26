const express = require("express");
const cors = require("cors");
const fs = require('fs');
const jwt = require("jsonwebtoken");
const SECRET_KEY = "CLAVE SECRETA PROYECTO";
const mariadb = require("mariadb");

const pool = mariadb.createPool({
  host: "localhost",
  user: "root",
  password: "1234",
  database: "cart",
  connectionLimit: 5,
});

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

// Auth
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (username === "adminProyecto" && password === "adminProyecto") {
    const token = jwt.sign({ username }, SECRET_KEY);
    res.status(200).json({ token });
  } else {
    res.status(401).json({ message: "Usuario y/o contraseña incorrecto" });
  }
});

// Middleware que autoriza a realizar peticiones a /users
app.use("/cart", (req, res, next) => {
  try {
    const decoded = jwt.verify(req.headers["access-token"], SECRET_KEY);
    console.log(decoded);
    next();
  } catch (err) {
    res.status(401).json({ message: "Usuario no autorizado" });
  }
});
//---

app.get('/cats', (req, res) => {
  res.json(cats);
});

app.get("/cart", async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query(
      "SELECT id, name, count, unitCost, currency, image FROM products"
    );

    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Se rompió el servidor" });
  } finally {
    if (conn) conn.release(); //release to pool
  }
});

app.get('/sell', (req, res) => {
  res.json(sell);
});

app.get('/userCart', (req, res) => {
  res.json(userCart);
});

app.get('/cats_products', (req, res) => {
  try {
    const files = fs.readdirSync(catsProductsFolderPath);
    
    // Leer cada archivo JSON de forma síncrona y parsearlo
    const products = files.filter(file => file.endsWith('.json'))
      .map(file => {
        const filePath = catsProductsFolderPath + file;
        const data = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(data);
      });
    res.json(products);

  } catch (err) {
    console.error('Error al leer la carpeta:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
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

app.get('/products', (req, res) => {
  try {
    const files = fs.readdirSync(productsFolderPath);
    
    // Leer cada archivo JSON de forma síncrona y parsearlo
    const products = files.filter(file => file.endsWith('.json'))
      .map(file => {
        const filePath = productsFolderPath + file;
        const data = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(data);
      });
    res.json(products);

  } catch (err) {
    console.error('Error al leer la carpeta de productos:', err);
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

app.get('/products_comments', (req, res) => {
  try {
    const files = fs.readdirSync(productsCommentsFolderPath);
    
    // Leer cada archivo JSON de forma síncrona y parsearlo
    const comments = files.filter(file => file.endsWith('.json'))
      .map(file => {
        const filePath = productsCommentsFolderPath + file;
        const data = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(data);
      });
    res.json(comments);

  } catch (err) {
    console.error('Error al leer la carpeta de comentarios de productos:', err);
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

app.post("/cart", async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const response = await conn.query(
      `INSERT INTO products(name, count, unitCost, currency, image) VALUE(?, ?, ?, ?, ?)`,
      [req.body.name, req.body.count, req.body.unitCost, req.body.currency, req.body.image]
    );

    res.json({ id: parseInt(response.insertId), ...req.body });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Se rompió el servidor" });
  } finally {
    if (conn) conn.release(); //release to pool
  }
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
