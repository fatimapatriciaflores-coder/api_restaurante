CREATE TABLE IF NOT EXISTS "User" (
    "id" SERIAL PRIMARY KEY,
    "email" TEXT UNIQUE NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "role" TEXT DEFAULT 'USER'
);

CREATE TABLE IF NOT EXISTS "Mesa" (
    "id" SERIAL PRIMARY KEY,
    "numero" INTEGER UNIQUE NOT NULL,
    "capacidad" INTEGER NOT NULL,
    "isDeleted" BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS "Reservacion" (
    "id" SERIAL PRIMARY KEY,
    "userId" INTEGER REFERENCES "User"("id"),
    "mesaId" INTEGER REFERENCES "Mesa"("id"),
    "fecha" TIMESTAMP NOT NULL,
    "status" TEXT DEFAULT 'PENDIENTE'
);

INSERT INTO "User" ("email", "password", "name", "role") VALUES
('admin@restaurante.com', '$2b$10$AdminEncryptedPasswordHere', 'Administrador', 'ADMIN'),
('cliente@restaurante.com', '$2b$10$ClientEncryptedPasswordHere', 'Florencia Mendoza', 'USER')
ON CONFLICT DO NOTHING;

INSERT INTO "Mesa" ("numero", "capacidad", "isDeleted") VALUES
(1, 2, FALSE),
(2, 4, FALSE)
ON CONFLICT DO NOTHING;