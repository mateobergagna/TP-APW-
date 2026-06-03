-- Conectar a la base de datos 'tienda'
\c tienda;

-- Crear la tabla 'productos'
CREATE TABLE productos (
    id SERIAL PRIMARY KEY,
    producto VARCHAR(100) NOT NULL,
    precio NUMERIC(10, 2) NOT NULL,
    imagen VARCHAR(255)
);

-- Insertar los 8 productos originales de 3D_MATT
INSERT INTO productos (producto, precio, imagen) VALUES
    ('Porta púas Marshall', 8000.00, NULL),
    ('Llaveros', 2000.00, NULL),
    ('Soporte para Notebook', 10000.00, NULL),
    ('Soporte para Auriculares', 4500.00, NULL),
    ('Macetas', 8000.00, NULL),
    ('Marcapáginas', 2000.00, NULL),
    ('Medallas', 2000.00, NULL),
    ('Juego de Mesa', 8000.00, NULL);
