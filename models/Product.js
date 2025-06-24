const db = require('../config/db');

class Product {
  // Récupérer tous les produits avec leurs catégories
  static getAll(callback) {
    const query = `
      SELECT 
        p.id, 
        p.name, 
        p.description,
        p.price,
        p.sale_price,
        p.stock_quantity,
        p.sku,
        p.category_id,
        p.image_url,
        p.is_active,
        p.is_featured,
        p.created_at,
        p.updated_at,
        c.name as category_name,
        c.slug as category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.is_active = TRUE
      ORDER BY p.name
    `;
    db.query(query, (err, results) => {
      if (err) {
        callback(err, null);
        return;
      }
      callback(null, results);
    });
  }

  // Récupérer un produit par ID
  static getById(id, callback) {
    const query = `
      SELECT 
        p.id, 
        p.name, 
        p.description,
        p.price,
        p.sale_price,
        p.stock_quantity,
        p.sku,
        p.category_id,
        p.image_url,
        p.is_active,
        p.is_featured,
        p.created_at,
        p.updated_at,
        c.name as category_name,
        c.slug as category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = ? AND p.is_active = TRUE
    `;
    db.query(query, [id], (err, results) => {
      if (err) {
        callback(err, null);
        return;
      }
      callback(null, results[0]);
    });
  }

  // Récupérer les produits par catégorie
  static getByCategory(categoryId, callback) {
    const query = `
      SELECT 
        p.id, 
        p.name, 
        p.description,
        p.price,
        p.sale_price,
        p.stock_quantity,
        p.sku,
        p.category_id,
        p.image_url,
        p.is_active,
        p.is_featured,
        p.created_at,
        p.updated_at,
        c.name as category_name,
        c.slug as category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.category_id = ? AND p.is_active = TRUE
      ORDER BY p.name
    `;
    db.query(query, [categoryId], (err, results) => {
      if (err) {
        callback(err, null);
        return;
      }
      callback(null, results);
    });
  }

  // Récupérer les produits par slug de catégorie
  static getByCategorySlug(categorySlug, callback) {
    const query = `
      SELECT 
        p.id, 
        p.name, 
        p.description,
        p.price,
        p.sale_price,
        p.stock_quantity,
        p.sku,
        p.category_id,
        p.image_url,
        p.is_active,
        p.is_featured,
        p.created_at,
        p.updated_at,
        c.name as category_name,
        c.slug as category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE c.slug = ? AND p.is_active = TRUE
      ORDER BY p.name
    `;
    db.query(query, [categorySlug], (err, results) => {
      if (err) {
        callback(err, null);
        return;
      }
      callback(null, results);
    });
  }

  // Rechercher des produits par nom
  static search(searchTerm, callback) {
    const query = `
      SELECT 
        p.id, 
        p.name, 
        p.description,
        p.price,
        p.sale_price,
        p.stock_quantity,
        p.sku,
        p.category_id,
        p.image_url,
        p.is_active,
        p.is_featured,
        p.created_at,
        p.updated_at,
        c.name as category_name,
        c.slug as category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE (p.name LIKE ? OR p.description LIKE ?) AND p.is_active = TRUE
      ORDER BY p.name
    `;
    const searchPattern = `%${searchTerm}%`;
    db.query(query, [searchPattern, searchPattern], (err, results) => {
      if (err) {
        callback(err, null);
        return;
      }
      callback(null, results);
    });
  }

  // Récupérer les produits en vedette
  static getFeatured(callback) {
    const query = `
      SELECT 
        p.id, 
        p.name, 
        p.description,
        p.price,
        p.sale_price,
        p.stock_quantity,
        p.sku,
        p.category_id,
        p.image_url,
        p.is_active,
        p.is_featured,
        p.created_at,
        p.updated_at,
        c.name as category_name,
        c.slug as category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.is_featured = TRUE AND p.is_active = TRUE
      ORDER BY p.created_at DESC
      LIMIT 10
    `;
    db.query(query, (err, results) => {
      if (err) {
        callback(err, null);
        return;
      }
      callback(null, results);
    });
  }

  // Créer un nouveau produit
  static create(productData, callback) {
    const query = `
      INSERT INTO products (
        name, description, price, sale_price, stock_quantity, 
        sku, category_id, image_url, is_active, is_featured
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    db.query(query, [
      productData.name,
      productData.description || null,
      productData.price,
      productData.sale_price || null,
      productData.stock_quantity || 0,
      productData.sku || null,
      productData.category_id || null,
      productData.image_url || null,
      productData.is_active !== undefined ? productData.is_active : true,
      productData.is_featured || false
    ], (err, result) => {
      if (err) {
        callback(err, null);
        return;
      }
      callback(null, { id: result.insertId, ...productData });
    });
  }

  // Mettre à jour un produit
  static update(id, productData, callback) {
    const query = `
      UPDATE products SET 
        name = ?, description = ?, price = ?, sale_price = ?, 
        stock_quantity = ?, sku = ?, category_id = ?, image_url = ?, 
        is_active = ?, is_featured = ?, updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `;
    
    db.query(query, [
      productData.name,
      productData.description || null,
      productData.price,
      productData.sale_price || null,
      productData.stock_quantity || 0,
      productData.sku || null,
      productData.category_id || null,
      productData.image_url || null,
      productData.is_active !== undefined ? productData.is_active : true,
      productData.is_featured || false,
      id
    ], (err, result) => {
      if (err) {
        callback(err, null);
        return;
      }
      callback(null, { id, ...productData });
    });
  }

  // Supprimer un produit (soft delete)
  static delete(id, callback) {
    const query = 'UPDATE products SET is_active = FALSE, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
    db.query(query, [id], (err, result) => {
      if (err) {
        callback(err, null);
        return;
      }
      callback(null, result);
    });
  }

  // Supprimer définitivement un produit
  static hardDelete(id, callback) {
    const query = 'DELETE FROM products WHERE id = ?';
    db.query(query, [id], (err, result) => {
      if (err) {
        callback(err, null);
        return;
      }
      callback(null, result);
    });
  }

  // Mettre à jour le stock
  static updateStock(id, quantity, callback) {
    const query = 'UPDATE products SET stock_quantity = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
    db.query(query, [quantity, id], (err, result) => {
      if (err) {
        callback(err, null);
        return;
      }
      callback(null, result);
    });
  }
}

module.exports = Product; 