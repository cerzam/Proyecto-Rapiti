const pool = require('../config/database');

const getProductos = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, name, price, image_url FROM products ORDER BY id ASC'
    );
    res.json({ success: true, count: rows.length, data: rows });
  } catch (error) {
    next(error);
  }
};

const crearProducto = async (req, res, next) => {
  try {
    const { nombre, precio, imagen } = req.body;
    const [result] = await pool.query(
      'INSERT INTO products (name, price, image_url) VALUES (?, ?, ?)',
      [nombre, precio, imagen || null]
    );
    res.status(201).json({
      success: true,
      message: 'Producto creado exitosamente',
      data: { id: result.insertId, nombre, precio, imagen }
    });
  } catch (error) {
    next(error);
  }
};

const actualizarProducto = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nombre, precio, imagen } = req.body;
    const [result] = await pool.query(
      'UPDATE products SET name = ?, price = ?, image_url = ? WHERE id = ?',
      [nombre, precio, imagen || null, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    res.json({ success: true, message: 'Producto actualizado' });
  } catch (error) {
    next(error);
  }
};

const eliminarProducto = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query('DELETE FROM products WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    res.json({ success: true, message: 'Producto eliminado' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getProductos, crearProducto, actualizarProducto, eliminarProducto };
