const prisma = require('../prisma/cliente')
// controlador que sirve para las acciones de las mesas

// metodo para obtener todas las mesas
// funcion asincrona para obtener las mesas de la base de datos
const obtenerMesas = async (req, res) => {
    // aqui iria la logica para obtener las mesas de la base de datos
    // equivalencia select * from mesas
    
    // CORREGIDO: .mesa en singular
    const lista_mesas = await prisma.mesa.findMany();
    res.status(200).json(lista_mesas);
}

//funcion para obtener una mesa por su ID
const obtenerMesaById = async (req, res) => {
    //obtener el id de la ruta
    const idMesa = Number(req.params.id);
    // select * from mesas where id =?
    
    // CORREGIDO: .mesa en singular
    const mesas = await prisma.mesa.findUnique({
        where: { id: idMesa },
    })
    
    // validamos si la mesa no existe
    if (!mesas) {
        return res.status(404).json({ error: "Mesa no encontrada" });
    }   
    res.status(200).json(mesas);    
}
            
//funcion para crear una nueva mesa
const crearMesa = async (req, res) => {
    //obtenemos los datos para crear la mesa del body de la peticion como un formulario
    const { numero, capacidad, disponible } = req.body;

    // insert into mesas (numero, capacidad, disponible) values (?,?,?)
    
    // CORREGIDO: .mesa en singular
    const nuevaMesa = await prisma.mesa.create({
        data: {
           numero,
           capacidad,
           disponible,  
        },
    })
    // 201= created successfully, 201=0k
    res.status(201).json({
        message: "Mesa registrada correctamente",
        mesa: nuevaMesa  
    });
}

//exportando los metodos para ocuparlos en cualquier ruta
module.exports = {
    obtenerMesas,
    obtenerMesaById,
    crearMesa
};