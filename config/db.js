const mysql = require('mysql2');

// Configuration de la connexion à la base de données MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'ecommerce'
});

// Connexion à la base de données
db.connect((err) => {
  if (err) {
    console.error('Erreur de connexion à MySQL:', err);
    return;
  }
  console.log('✅ Connexion à MySQL réussie!');
});

// Création des tables si elles n'existent pas
const createTables = () => {
  // Table des catégories
  const createCategoriesTable = `
    CREATE TABLE IF NOT EXISTS categories (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL UNIQUE,
      description TEXT,
      slug VARCHAR(150) UNIQUE,
      is_active BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `;

  // Table des produits
  const createProductsTable = `
    CREATE TABLE IF NOT EXISTS products (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(200) NOT NULL,
      description TEXT,
      price DECIMAL(10,2) NOT NULL,
      sale_price DECIMAL(10,2),
      stock_quantity INT DEFAULT 0,
      sku VARCHAR(100) UNIQUE,
      category_id INT,
      image_url VARCHAR(500),
      is_active BOOLEAN DEFAULT TRUE,
      is_featured BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
    )
  `;

  db.query(createCategoriesTable, (err) => {
    if (err) {
      console.error('Erreur lors de la création de la table categories:', err);
    } else {
      console.log('✅ Table categories créée ou déjà existante');
    }
  });

  db.query(createProductsTable, (err) => {
    if (err) {
      console.error('Erreur lors de la création de la table products:', err);
    } else {
      console.log('✅ Table products créée ou déjà existante');
    }
  });
};

// Exécuter la création des tables au démarrage
createTables();

module.exports = db; 