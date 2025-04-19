CREATE TABLE IF NOT EXISTS users (
  user_id SERIAL PRIMARY KEY,
  username VARCHAR(50) NOT NULL,
  email VARCHAR(50) NOT NULL UNIQUE,
  master_hash VARCHAR(64) -- No need to store it as BYTEA
  --encryption_salt BYTEA Already included on the bcrypt hash
);

INSERT INTO users (username, email, master_hash) VALUES
('juanillopepinillo', 'juan@example.com', '$2a$12$v1yAc3TKrHZU.QMxH0MKB.HXwvjrLZN/5XcFO4jDEIAXDInCBfXke'),
('analopez', 'ana@example.com', '$2a$12$.F0AaKAcaf.h03cYZybft.4nHNsPuf0o3pO./x6vI4kZYjJvAOni.');

CREATE TABLE IF NOT EXISTS tests (
  test_id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  correct_answers INTEGER NOT NULL,
  test_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO tests (user_id, correct_answers) VALUES
(1, 3),
(1, 7);

CREATE TABLE IF NOT EXISTS services (
  service_id SERIAL PRIMARY KEY,
  service_name VARCHAR(50) NOT NULL,
  user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  salt TEXT NOT NULL,           -- Salt (in hex or base64)
  iv TEXT NOT NULL,             -- IV or Initialization Vector (in hex or base64)
  subkey TEXT NOT NULL          -- ciphered subkey (in hex or base64)
);

INSERT INTO services (service_name, user_id, salt, iv, subkey) VALUES
('Google', 1,  'b2a3c4d5e6f7a8b9c0d1e2f3g4h5i6j7', 'a1b2c3d4e5f6078890abcdef12345678', 'e8a1c3f56c78eae9a44d6729f2a82843');
