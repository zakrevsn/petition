DROP TABLE IF EXISTS users;

CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    firstname VARCHAR(250) NOT NULL CHECK (firstname!=''),
    lastname VARCHAR(250) NOT NULL CHECK (lastname!=''),
    email TEXT NOT NULL UNIQUE CHECK (email!=''),
    password VARCHAR(250) NOT NULL CHECK (password!='')
);
