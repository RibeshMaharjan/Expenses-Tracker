CREATE TABLE products (
    product_id INT PRIMARY KEY,
    product_name TEXT,
    category TEXT
);

CREATE TABLE product_categories (
    category_id INT PRIMARY KEY,
    category_name TEXT,
    description TEXT
);

INSERT INTO products (product_id, product_name, category) VALUES
(1, 'Laptop', 'Electronics'),
(2, 'Keyboard', 'Electronics'),
(3, 'T-shirt', 'Clothing');

INSERT INTO products (product_id, product_name, category) VALUES
(5, 'Keyboard', 'TESTING_1');

UPDATE product_categories SET
	description = 'TESTING'
	WHERE category_id = 104

INSERT INTO product_categories (category_id, category_name, description) VALUES
(101, 'Electronics', 'Electronic devices'),
(102, 'Clothing', 'Garments');

INSERT INTO product_categories (category_id, category_name, description) VALUES
(104, 'TESTING_RIGHT', 'TESTING_RIGHT');

SELECT * FROM products;
SELECT * FROM product_categories;

SELECT p.product_name, pc.description
FROM products p
JOIN product_categories pc ON p.category = pc.category_name;

SELECT p.product_id, p.product_name, pc.description
FROM products p
JOIN product_categories pc ON p.category = pc.category_name WHERE category_id = 101
UNION
SELECT p.product_id, p.product_name, pc.description
FROM products p
JOIN product_categories pc ON p.category = pc.category_name WHERE category_id = 102;

SELECT p.product_name, pc.description
FROM products p
LEFT OUTER JOIN product_categories pc ON p.category = pc.category_name
WHERE pc.description ~ '^El';



