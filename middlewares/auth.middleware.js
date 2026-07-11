const jwt = require('jsonwebtoken');
const prisma = require('../prisma/cliente');

const verificarToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: "Acceso denegado: Token no proporcionado" });
    }

    try {
        const verificado = jwt.verify(token, process.env.JWT_SECRET || 'MiClaveSecretaSuperSegura123!');
        const usuario = await prisma.usuario.findUnique({ where: { id: verificado.id } });
        
        if (!usuario) {
            return res.status(401).json({ error: "Usuario no encontrado" });
        }

        req.user = usuario;
        next();
    } catch (error) {
        return res.status(403).json({ error: "Token inválido o expirado" });
    }
};

const requerirRol = (rolPermitido) => {
    return (req, res, next) => {
        if (!req.user || req.user.rol !== rolPermitido) {
            return res.status(403).json({ error: `Acceso denegado: Se requieren permisos de ${rolPermitido}` });
        }
        next();
    };
};

module.exports = { verificarToken, requerirRol };