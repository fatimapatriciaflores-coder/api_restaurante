const prisma = require('../prisma/cliente');

// GET /api/mesas (Lista todas y permite filtrar por ?disponible=true)
const obtenerMesas = async (req, res) => {
    try {
        const { disponible } = req.query;
        let filtro = {};
        if (disponible !== undefined) {
            filtro.disponible = disponible === 'true';
        }
        const lista_mesas = await prisma.mesa.findMany({ where: filtro });
        res.status(200).json(lista_mesas);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener las mesas" });
    }
};

// GET /api/mesas/:id
const obtenerMesaById = async (req, res) => {
    try {
        const idMesa = Number(req.params.id);
        const mesa = await prisma.mesa.findUnique({ where: { id: idMesa } });
        if (!mesa) {
            return res.status(404).json({ error: "Mesa no encontrada" });
        }   
        res.status(200).json(mesa);    
    } catch (error) {
        res.status(500).json({ error: "Error al buscar la mesa" });
    }
};
            
// POST /api/mesas (Solo Admin)
const crearMesa = async (req, res) => {
    try {
        const { numero, capacidad, disponible } = req.body;
        const nuevaMesa = await prisma.mesa.create({
            data: { numero, capacidad, disponible }
        });
        res.status(201).json({ message: "Mesa registrada correctamente", mesa: nuevaMesa });
    } catch (error) {
        res.status(500).json({ error: "Error al crear la mesa" });
    }
};

// PUT /api/mesas/:id (Solo Admin)
const actualizarMesa = async (req, res) => {
    try {
        const idMesa = Number(req.params.id);
        const { numero, capacidad, disponible } = req.body;
        const mesaActualizada = await prisma.mesa.update({
            where: { id: idMesa },
            data: { numero, capacidad, disponible }
        });
        res.status(200).json({ message: "Mesa actualizada correctamente", mesa: mesaActualizada });
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar la mesa" });
    }
};

// DELETE /api/mesas/:id (Soft Delete - Solo Admin)
const desactivarMesa = async (req, res) => {
    try {
        const idMesa = Number(req.params.id);
        // Soft delete: cambiamos disponibilidad a false en lugar de borrar de la BD
        const mesaDesactivada = await prisma.mesa.update({
            where: { id: idMesa },
            data: { disponible: false }
        });
        res.status(200).json({ message: "Mesa desactivada correctamente (Soft Delete)", mesa: mesaDesactivada });
    } catch (error) {
        res.status(500).json({ error: "Error al desactivar la mesa" });
    }
};

module.exports = {
    obtenerMesas,
    obtenerMesaById,
    crearMesa,
    actualizarMesa,
    desactivarMesa
};