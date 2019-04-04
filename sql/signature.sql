DROP TABLE IF EXISTS signature;

CREATE TABLE signature(
    id SERIAL PRIMARY KEY,
    firstname VARCHAR(250) NOT NULL CHECK (firstname!=''),
    lastname VARCHAR(250) NOT NULL CHECK (lastname!=''),
    signature TEXT NOT NULL CHECK (signature!=''),
    timestamp TIMESTAMP DEFAULT NOW()
);
