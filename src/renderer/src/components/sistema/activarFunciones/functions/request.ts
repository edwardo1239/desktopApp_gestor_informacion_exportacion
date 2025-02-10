/* eslint-disable prettier/prettier */
export const requestContenedores = {
    data: {
        query: { "infoContenedor.cerrado": false },
        select: {},
        populate:
            [{
                path: "infoContenedor.clienteInfo",
                select: "CLIENTE",
            }],
    },
    collection: 'contenedores',
    action: 'getContenedores',
    query: 'proceso'
};

export const request_cerrar_contenedor = (contendor, accion): object => {
    return {
        data: {
            contenedor:{
                _id:contendor,
            "infoContenedor.cerrado": accion
            }
        },
        collection: 'contenedores',
        action: 'cerrar_contenedor',
        query: 'proceso'
    }
}

export const request_add_pallet_to_contenedor = (contendor): object => {
    return {
        data: {
            contenedor:{
                _id:contendor,
            }
        },
        collection: 'contenedores',
        action: 'add_pallet_contenedor',
        query: 'proceso'
    }
}