-- create projects table (up)
CREATE TABLE IF NOT EXISTS projects (
  id INT AUTO_INCREMENT PRIMARY KEY,

  name VARCHAR(255) NOT NULL,
  image_url VARCHAR(255) DEFAULT NULL,

  created_at DATETIME NOT NULL DEFAULT NOW(),
  soft_deleted BOOLEAN DEFAULT FALSE
);