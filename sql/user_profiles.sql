CREATE TABLE user_profiles(
    id SERIAL PRIMARY KEY,
    age INTEGER,
    city VARCHAR(300),
    url VARCHAR(600),
    user_id INTEGER REFERENCES users(id) NOT NULL UNIQUE
);
-- these fields should be optional, for those who do not add profile info we do not add to
--user_profiles table;
-- select from signature table + profile table
-- add to sighners profile data; if user gives url add link to
-- by login we should already have the name and lastname saved;

-- {{#signers}}
--{{#if url}}
--<a href="{{url}}"></a>

--{{else}}
--{{if}}
--{{/#signers}}

-- check how url starts; if starts wrong change to http:// or throw them out if they start wrong
--http://
--https://
--//
-- fix it in post in user_profiles
-- NOT allow javascript links!!!

--we need new route to see all signers in signers route app.get('/signers/:city',(req,res)
--change toLowerCase


--WHERE LOWER(city) = LOWER($1);

--new route and modify query from signers to show signers only from one city;
--template remains the same;
