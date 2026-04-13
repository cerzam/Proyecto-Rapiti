const pool = require('../config/database');

// GET /api/blog — público
const getPosts = async (req, res, next) => {
  try {
    const [rows] = await pool.query(`
      SELECT bp.id, bp.title, bp.content, bp.created_at, bp.updated_at,
             u.name AS autor, u.id AS autor_id
      FROM blog_posts bp
      JOIN users u ON bp.author_id = u.id
      ORDER BY bp.created_at DESC
    `);
    res.json({ success: true, count: rows.length, data: rows });
  } catch (error) {
    next(error);
  }
};

// GET /api/blog/:id — público
const getPost = async (req, res, next) => {
  try {
    const [rows] = await pool.query(`
      SELECT bp.id, bp.title, bp.content, bp.created_at, bp.updated_at,
             u.name AS autor, u.id AS autor_id
      FROM blog_posts bp
      JOIN users u ON bp.author_id = u.id
      WHERE bp.id = ?
    `, [req.params.id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Publicación no encontrada' });
    }
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    next(error);
  }
};

// POST /api/blog — solo autenticados
const crearPost = async (req, res, next) => {
  try {
    const { title, content } = req.body;
    const authorId = req.user.id;

    const [result] = await pool.query(
      'INSERT INTO blog_posts (title, content, author_id) VALUES (?, ?, ?)',
      [title, content, authorId]
    );

    res.status(201).json({
      success: true,
      message: 'Publicación creada',
      data: { id: result.insertId, title, content, autor_id: authorId }
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/blog/:id — solo autor o admin
const actualizarPost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;
    const userId = req.user.id;
    const userRol = req.user.rol;

    // Verificar que el post existe y obtener el autor
    const [rows] = await pool.query('SELECT author_id FROM blog_posts WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Publicación no encontrada' });
    }

    const esAutor = rows[0].author_id === userId;
    const esAdmin = userRol === 'admin' || userRol === 'tienda';

    if (!esAutor && !esAdmin) {
      return res.status(403).json({ message: 'No tienes permiso para editar esta publicación' });
    }

    await pool.query(
      'UPDATE blog_posts SET title = ?, content = ? WHERE id = ?',
      [title, content, id]
    );

    res.json({ success: true, message: 'Publicación actualizada' });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/blog/:id — solo autor o admin
const eliminarPost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const userRol = req.user.rol;

    const [rows] = await pool.query('SELECT author_id FROM blog_posts WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Publicación no encontrada' });
    }

    const esAutor = rows[0].author_id === userId;
    const esAdmin = userRol === 'admin' || userRol === 'tienda';

    if (!esAutor && !esAdmin) {
      return res.status(403).json({ message: 'No tienes permiso para eliminar esta publicación' });
    }

    await pool.query('DELETE FROM blog_posts WHERE id = ?', [id]);

    res.json({ success: true, message: 'Publicación eliminada' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getPosts, getPost, crearPost, actualizarPost, eliminarPost };
