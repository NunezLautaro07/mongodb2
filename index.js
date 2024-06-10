const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

mongoose.connect(process.env.DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const productoSchema = new mongoose.Schema({
    nombre: String,
    precio: Number,
    descripcion: String,
});

const Producto = mongoose.model('Producto', productoSchema);

// Operación para obtener todos los productos
app.get('/productos', async (req, res) => {
    try {
        const productos = await Producto.find();
        res.json(productos);
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).send('Error al obtener productos');
    }
});

// Operación para agregar un nuevo producto
app.post('/productos', async (req, res) => {
    try {
        const { nombre, precio, descripcion } = req.body;
        const nuevoProducto = new Producto({ nombre, precio, descripcion });
        await nuevoProducto.save();
        res.status(201).json(nuevoProducto);
    } catch (error) {
        console.error('Error al agregar producto:', error);
        res.status(500).send('Error al agregar producto');
    }
});

// Operación para actualizar un producto por ID
app.put('/productos/:id', async (req, res) => {
    try {
        const updateProducto = await Producto.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updateProducto);
    } catch (error) {
        console.error('Error al actualizar producto:', error);
        res.status(500).send('Error al actualizar producto');
    }
});

// Operación para eliminar un producto por ID
app.delete('/productos/:id', async (req, res) => {
    try {
        const deletedProducto = await Producto.findByIdAndDelete(req.params.id);
        res.json(deletedProducto);
    } catch (error) {
        console.error('Error al eliminar producto:', error);
        res.status(500).send('Error al eliminar producto');
    }
});

app.listen(port, () => {
    console.log(`Servidor Express escuchando en el puerto ${port}`);
});
