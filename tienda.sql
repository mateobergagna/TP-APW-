-- Script de base de datos para la tienda 3D

-- Si las tablas existen, las eliminamos para poder reiniciar la BD fácilmente
DROP TABLE IF EXISTS usuarios CASCADE;
DROP TABLE IF EXISTS productos CASCADE;

-- Tabla de Usuarios
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL
);

-- Tabla de Productos
CREATE TABLE productos (
    id SERIAL PRIMARY KEY,
    producto VARCHAR(100) NOT NULL,
    precio NUMERIC(10, 2) NOT NULL,
    imagen VARCHAR(255)
);

-- (Opcional) Datos iniciales de prueba
INSERT INTO usuarios (username, password_hash) 
VALUES ('admin', '$2a$10$C8.rFj2e/4.C31f.1h42N.zC3d47HjXfQ5Vp8p.B.zU2N4K.t/Cg.'); -- Password es 'admin123'
