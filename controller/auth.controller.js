const prisma = require('../prisma/cliente');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const registrarUsuario = async (req, res) => {
    try {
        const { nombre, correo, password, rol } = req.body;

        const existe = await prisma.usuario.findUnique({ where: { correo } });
        if (existe) return res.status(400).json({ error: "El correo ya existe" });

        // Encriptar la contraseña con 10 vueltas (lo que exige la rúbrica)
        const hashedPassword = await bcrypt.hash(password, 10);

        const nuevoUsuario = await prisma.usuario.create({
            data: { nombre, correo, password: hashedPassword, rol: rol || 'cliente' }
        });

        const { password: _, ...usuarioSinPassword } = nuevoUsuario;
        res.status(201).json({ mensaje: "Registrado con éxito", usuario: usuarioSinPassword });
    } catch (error) {
        res.status(500).json({ error: "Error al registrar usuario" });
    }
};

const loginUsuario = async (req, res) => {
    try {
        const { correo, password } = req.body;
        const usuario = await prisma.usuario.findUnique({ where: { correo } });

        if (!usuario) return res.status(401).json({ error: "Credenciales incorrectas" });

        const passwordValido = await bcrypt.compare(password, usuario.password);
        if (!passwordValido) return res.status(401).json({ error: "Credenciales incorrectas" });

        const token = jwt.sign(
            { id: usuario.id, rol: usuario.rol },
            process.env.JWT_SECRET || 'MiClaveSecretaSuperSegura123!',
            { expiresIn: '8h' }
        );

        res.status(200).json({ mensaje: "Login correcto", token });
    } catch (error) {
        res.status(500).json({ error: "Error en el login" });
    }
};

const obtenerPerfil = async (req, res) => {
    const { password: _, ...perfil } = req.user;
    res.status(200).json(perfil);
};

module.exports = { registrarUsuario, loginUsuario, obtenerPerfil };