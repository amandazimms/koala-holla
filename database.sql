-- run this from within host (localhost for this project)
CREATE DATABASE koala_holla;

-- run this from within the new koala_holla database
CREATE TABLE koalas (
    id SERIAL PRIMARY KEY,
    koala_name varchar(20) NOT NULL,
    age int NOT NULL,
    gender varchar(1) NOT NULL,
    ready_for_transfer boolean NOT NULL,
    notes varchar(200)
);

INSERT INTO koalas ("koala_name", "age", "gender", "ready_for_transfer", "notes") 
VALUES('Ben', 13, 'M', TRUE, 'Enjoys reading manga');

INSERT INTO koalas ("koala_name", "age", "gender", "ready_for_transfer", "notes") 
VALUES('Memow', 12, 'F', FALSE, 'koala that says meow');