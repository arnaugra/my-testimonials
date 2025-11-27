-- create invitations table (up)
CREATE TABLE IF NOT EXISTS invitations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  project_id INT DEFAULT NULL,

  token VARCHAR(255) UNIQUE NOT NULL,

  expires_at DATETIME NOT NULL,
  used_at DATETIME DEFAULT NULL,
  soft_deleted BOOLEAN DEFAULT FALSE,

  FOREIGN KEY (project_id) REFERENCES projects(id)
);
