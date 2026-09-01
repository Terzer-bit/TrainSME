CREATE TABLE IF NOT EXISTS users (
  user_id SERIAL PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL UNIQUE,
  hashed_password VARCHAR(255) NOT NULL,
  first_name VARCHAR(50) NOT NULL DEFAULT '',
  last_name VARCHAR(50) NOT NULL DEFAULT '',
  enterprise VARCHAR(50) NOT NULL,
  admin BOOLEAN NOT NULL DEFAULT false
);

CREATE TABLE IF NOT EXISTS tests (
  test_id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  correct_answers INTEGER NOT NULL,
  total_questions INTEGER NOT NULL DEFAULT 10,
  test_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  details JSONB DEFAULT '[]'::jsonb
);

CREATE TABLE IF NOT EXISTS services (
  service_id SERIAL PRIMARY KEY,
  service_name VARCHAR(50) NOT NULL,
  user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  salt TEXT NOT NULL,
  iv TEXT NOT NULL,
  auth_tag TEXT NOT NULL,
  subkey TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT unique_user_service UNIQUE (user_id, service_name)
);

-- 1. Insert seed users (Password for all: 1234asdf)
INSERT INTO users (username, email, hashed_password, first_name, last_name, enterprise, admin) VALUES
('admin', 'admin@example.com', '$2a$12$v1yAc3TKrHZU.QMxH0MKB.HXwvjrLZN/5XcFO4jDEIAXDInCBfXke', 'Administrator', 'System', 'Cookies.SA', true),
('analopez', 'ana@example.com', '$2a$12$.F0AaKAcaf.h03cYZybft.4nHNsPuf0o3pO./x6vI4kZYjJvAOni.', 'Ana', 'López', 'Cookies.SA', false)

ON CONFLICT (username) DO UPDATE 
SET first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name;

-- 2. Insert seed tests safely by username lookup (prevents foreign key errors)
INSERT INTO tests (user_id, correct_answers, total_questions, test_date, details)
SELECT user_id, 9, 10, NOW() - INTERVAL '2 days', '[
  {"id":1, "subject":"Security Alert", "userAnswer":"Phishing", "solution":"Phishing", "isCorrect":true, "explanation":"Spoofed sender domain."},
  {"id":2, "subject":"Quarterly Bonus", "userAnswer":"Phishing", "solution":"Phishing", "isCorrect":true, "explanation":"Urgency and malicious link."}
]'::jsonb FROM users WHERE username = 'analopez'
UNION ALL
SELECT user_id, 7, 10, NOW() - INTERVAL '15 days', '[]'::jsonb FROM users WHERE username = 'analopez'
UNION ALL
SELECT user_id, 4, 10, NOW() - INTERVAL '5 days', '[]'::jsonb FROM users WHERE username = 'carlosg';