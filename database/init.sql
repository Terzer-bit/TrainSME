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
  user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE
);

INSERT INTO services (service_name, user_id) VALUES
('Google', 1),
('Instagram', 1);