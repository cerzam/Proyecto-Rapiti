const pool = require('../config/database');

const getTiendas = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, nombre, categoria, direccion, horario, abierto, lat, lng FROM stores ORDER BY id ASC'
    );
    res.json({ success: true, count: rows.length, data: rows });
  } catch (error) {
    next(error);
  }
};

const getTienda = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [[tienda]] = await pool.query(
      'SELECT id, nombre, categoria, direccion, horario, abierto, lat, lng FROM stores WHERE id = ?',
      [id]
    );
    if (!tienda) return res.status(404).json({ message: 'Tienda no encontrada' });

    const [productos] = await pool.query(
      'SELECT id, nombre, precio FROM store_products WHERE store_id = ? ORDER BY id ASC',
      [id]
    );

    res.json({ success: true, data: { ...tienda, productos } });
  } catch (error) {
    next(error);
  }
};

const crearTienda = async (req, res, next) => {
  try {
    const { nombre, categoria, direccion, horario, abierto, lat, lng, productos } = req.body;
    const [result] = await pool.query(
      'INSERT INTO stores (nombre, categoria, direccion, horario, abierto, lat, lng) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [nombre, categoria, direccion, horario || null, abierto ?? true, lat || null, lng || null]
    );
    const storeId = result.insertId;

    if (productos && productos.length > 0) {
      const valores = productos.map(p => [storeId, p.nombre, p.precio]);
      await pool.query('INSERT INTO store_products (store_id, nombre, precio) VALUES ?', [valores]);
    }

    res.status(201).json({ success: true, message: 'Tienda creada', data: { id: storeId } });
  } catch (error) {
    next(error);
  }
};

const actualizarTienda = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nombre, categoria, direccion, horario, abierto, lat, lng, productos } = req.body;

    const [result] = await pool.query(
      'UPDATE stores SET nombre = ?, categoria = ?, direccion = ?, horario = ?, abierto = ?, lat = ?, lng = ? WHERE id = ?',
      [nombre, categoria, direccion, horario || null, abierto ?? true, lat || null, lng || null, id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Tienda no encontrada' });

    if (productos !== undefined) {
      await pool.query('DELETE FROM store_products WHERE store_id = ?', [id]);
      if (productos.length > 0) {
        const valores = productos.map(p => [id, p.nombre, p.precio]);
        await pool.query('INSERT INTO store_products (store_id, nombre, precio) VALUES ?', [valores]);
      }
    }

    res.json({ success: true, message: 'Tienda actualizada' });
  } catch (error) {
    next(error);
  }
};

const eliminarTienda = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query('DELETE FROM stores WHERE id = ?', [id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Tienda no encontrada' });
    res.json({ success: true, message: 'Tienda eliminada' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getTiendas, getTienda, crearTienda, actualizarTienda, eliminarTienda };
