CREATE TABLE IF NOT EXISTS users (
  user_id SERIAL PRIMARY KEY,
  username VARCHAR(50) NOT NULL,
  email VARCHAR(50) NOT NULL UNIQUE,
  hashed_password VARCHAR(64), -- No need to store it as BYTEA, encryption_salt Already included on the bcrypt hash
  enterprise VARCHAR(50) NOT NULL, 
  admin BOOLEAN NOT NULL
);

INSERT INTO users (username, email, hashed_password, enterprise, admin) VALUES
('admin', 'admin@example.com', '$2a$12$v1yAc3TKrHZU.QMxH0MKB.HXwvjrLZN/5XcFO4jDEIAXDInCBfXke', 'Cookies.SA', true),
('analopez', 'ana@example.com', '$2a$12$.F0AaKAcaf.h03cYZybft.4nHNsPuf0o3pO./x6vI4kZYjJvAOni.', 'Cookies.SA', false);

CREATE TABLE IF NOT EXISTS tests (
  test_id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  correct_answers INTEGER NOT NULL,
  test_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO tests (user_id, correct_answers) VALUES
(2, 3),
(2, 7);

CREATE TABLE IF NOT EXISTS services (
  service_id SERIAL PRIMARY KEY,
  service_name VARCHAR(50) NOT NULL,
  user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  salt TEXT NOT NULL,           -- Salt (in hex or base64)
  iv TEXT NOT NULL,             -- IV or Initialization Vector (in hex or base64)
  subkey TEXT NOT NULL          -- ciphered subkey (in hex or base64)
);

INSERT INTO services (service_name, user_id, salt, iv, subkey) VALUES
('Google', 2,  'd17ed7d02e12fd4096c959ee38346bf5', '0db82c636e953c0c74b822e28dc28a4d', '75cdeddeb93493ccf65b81b5c252642875c8f89b7822725c81095aa41946cb2c');
