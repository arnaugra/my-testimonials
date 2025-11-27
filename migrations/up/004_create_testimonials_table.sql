-- create testimonials table (up)
CREATE TABLE IF NOT EXISTS testimonials (
  id INT AUTO_INCREMENT PRIMARY KEY,
  project_id INT DEFAULT NULL,
  invitation_id INT NOT NULL,

  author VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  validated BOOLEAN DEFAULT FALSE,
  image_url TEXT DEFAULT NULL,

  created_at DATETIME NOT NULL DEFAULT NOW(),
  soft_deleted BOOLEAN DEFAULT FALSE,

  FOREIGN KEY (project_id) REFERENCES projects(id),
  FOREIGN KEY (invitation_id) REFERENCES invitations(id)
);