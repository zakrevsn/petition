DROP TABLE IF EXISTS signature;

CREATE TABLE signature(
    id SERIAL PRIMARY KEY,
    signature TEXT NOT NULL CHECK (signature!=''),
    user_id INTEGER REFERENCES users(id) NOT NULL UNIQUE,
    timestamp TIMESTAMP DEFAULT NOW()
);
