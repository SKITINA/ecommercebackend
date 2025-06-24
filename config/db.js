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
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  // Table des produits
  const createProductsTable = `
    CREATE TABLE IF NOT EXISTS products (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(200) NOT NULL,
      price DECIMAL(10,2) NOT NULL,
      category_id INT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
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