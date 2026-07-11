const prisma = require('../prisma/cliente');

const crearReservacion = async (req, res) => {
    try {
        const { fecha, hora, personas, mesaId } = req.body;
        const usuarioId = req.user.id; // Obtenido del token de seguridad

        // VALIDACIÓN: Evitar choques de reservas en la misma fecha y hora para esa mesa
        const conflicto = await prisma.reservacion.findFirst({
            where: {
                mesaId: Number(mesaId),
                fecha: new Date(fecha),
                hora: new Date(hora),
                estado: { in: ['pendiente', 'confirmada'] }
            }
        });

        if (conflicto) {
            return res.status(400).json({ error: "La mesa ya está ocupada en esa fecha y hora" });
        }

        const nuevaReserva = await prisma.reservacion.create({
            data: {
                fecha: new Date(fecha),
                hora: new Date(hora),
                personas: Number(personas),
                mesaId: Number(mesaId),
                usuarioId
            }
        });

        res.status(201).json({ mensaje: "Reservación creada con éxito", reservacion: nuevaReserva });
    } catch (error) {
        res.status(500).json({ error: "Error al crear reservación" });
    }
};

const obtenerMisReservaciones = async (req, res) => {
    try {
        const misReservas = await prisma.reservacion.findMany({
            where: { usuarioId: req.user.id },
            include: { mesa: true }
        });
        res.status(200).json(misReservas);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener tus reservaciones" });
    }
};

const obtenerTodasReservaciones = async (req, res) => {
    try {
        const { estado } = req.query;
        let filtro = {};
        if (estado) filtro.estado = estado;

        const todas = await prisma.reservacion.findMany({
            where: filtro,
            include: { mesa: true, usuario: true }
        });
        res.status(200).json(todas);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener todas las reservaciones" });
    }
};

const cambiarEstadoReservacion = async (req, res) => {
    try {
        const idReserva = Number(req.params.id);
        const { estado } = req.body; // pendiente, confirmada, cancelada

        const actualizada = await prisma.reservacion.update({
            where: { id: idReserva },
            data: { estado }
        });
        res.status(200).json({ mensaje: "Estado de reservación cambiado", reservacion: actualizada });
    } catch (error) {
        res.status(500).json({ error: "Error al cambiar el estado" });
    }
};

const cancelarPropiaReservacion = async (req, res) => {
    try {
        const idReserva = Number(req.params.id);

        const reserva = await prisma.reservacion.findUnique({ where: { id: idReserva } });
        if (!reserva) return res.status(404).json({ error: "Reservación no encontrada" });

        if (reserva.usuarioId !== req.user.id) {
            return res.status(403).json({ error: "No tienes permisos para cancelar esta reservación" });
        }

        const cancelada = await prisma.reservacion.update({
            where: { id: idReserva },
            data: { estado: 'cancelada' }
        });

        res.status(200).json({ mensaje: "Cancelaste tu reservación con éxito", reservacion: cancelada });
    } catch (error) {
        res.status(500).json({ error: "Error al cancelar la reservación" });
    }
};

module.exports = {
    crearReservacion,
    obtenerMisReservaciones,
    obtenerTodasReservaciones,
    cambiarEstadoReservacion,
    cancelarPropiaReservacion
};