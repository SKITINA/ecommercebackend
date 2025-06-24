const db = require('../config/db');

class Category {
  // Récupérer toutes les catégories
  static getAll(callback) {
    const query = 'SELECT * FROM categories WHERE is_active = TRUE ORDER BY name';
    db.query(query, (err, results) => {
      if (err) {
        callback(err, null);
        return;
      }
      callback(null, results);
    });
  }

  // Récupérer une catégorie par ID
  static getById(id, callback) {
    const query = 'SELECT * FROM categories WHERE id = ? AND is_active = TRUE';
    db.query(query, [id], (err, results) => {
      if (err) {
        callback(err, null);
        return;
      }
      callback(null, results[0]);
    });
  }

  // Récupérer une catégorie par slug
  static getBySlug(slug, callback) {
    const query = 'SELECT * FROM categories WHERE slug = ? AND is_active = TRUE';
    db.query(query, [slug], (err, results) => {
      if (err) {
        callback(err, null);
        return;
      }
      callback(null, results[0]);
    });
  }

  // Créer une nouvelle catégorie
  static create(categoryData, callback) {
    const query = 'INSERT INTO categories (name, description, slug, is_active) VALUES (?, ?, ?, ?)';
    const slug = categoryData.slug || categoryData.name.toLowerCase().replace(/\s+/g, '-');
    
    db.query(query, [
      categoryData.name,
      categoryData.description || null,
      slug,
      categoryData.is_active !== undefined ? categoryData.is_active : true
    ], (err, result) => {
      if (err) {
        callback(err, null);
        return;
      }
      callback(null, { id: result.insertId, ...categoryData, slug });
    });
  }

  // Mettre à jour une catégorie
  static update(id, categoryData, callback) {
    const query = 'UPDATE categories SET name = ?, description = ?, slug = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
    const slug = categoryData.slug || categoryData.name.toLowerCase().replace(/\s+/g, '-');
    
    db.query(query, [
      categoryData.name,
      categoryData.description || null,
      slug,
      categoryData.is_active !== undefined ? categoryData.is_active : true,
      id
    ], (err, result) => {
      if (err) {
        callback(err, null);
        return;
      }
      callback(null, { id, ...categoryData, slug });
    });
  }

  // Supprimer une catégorie (soft delete)
  static delete(id, callback) {
    const query = 'UPDATE categories SET is_active = FALSE, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
    db.query(query, [id], (err, result) => {
      if (err) {
        callback(err, null);
        return;
      }
      callback(null, result);
    });
  }

  // Supprimer définitivement une catégorie
  static hardDelete(id, callback) {
    const query = 'DELETE FROM categories WHERE id = ?';
    db.query(query, [id], (err, result) => {
      if (err) {
        callback(err, null);
        return;
      }
      callback(null, result);
    });
  }

  // Récupérer les catégories avec le nombre de produits
  static getAllWithProductCount(callback) {
    const query = `
      SELECT 
        c.*,
        COUNT(p.id) as product_count
      FROM categories c
      LEFT JOIN products p ON c.id = p.category_id AND p.is_active = TRUE
      WHERE c.is_active = TRUE
      GROUP BY c.id
      ORDER BY c.name
    `;
    db.query(query, (err, results) => {
      if (err) {
        callback(err, null);
        return;
      }
      callback(null, results);
    });
  }
}

module.exports = Category; 