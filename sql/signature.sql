DROP TABLE IF EXISTS signature;

CREATE TABLE signature(
    id SERIAL PRIMARY KEY,
    firstname VARCHAR(250) NOT NULL,
    lastname VARCHAR(250) NOT NULL,
    signature TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT NOW()
);
