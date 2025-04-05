/* eslint-disable prettier/prettier */
export const formularios = {
    Unidad_enfriamiento: {
        titulo: "Unidad de Enfriamiento",
        formularios: {
            funcionamiento: "La unidad de enfriamiento está funcionando adecuadamente.",
            temperatura: "El equipo de refrigeración tiene la temperatura adecuada para proceder a realizar el cargue."
        }
    },
    furgon: {
        titulo: "Furgón",
        formularios: {
            talanquera: "El vehículo cuenta con talanquera para el aseguramiento de los pallets.",
            dannos: "Se verificó que el furgón no tiene rupturas, daños y/o enmendaduras.",
            sellos_puertas: "Los sellos de las puertas, conductos de aire y paredes laterales están en buenas condiciones.",
            materiales: "Las superficies internas del furgón (pisos, paredes, puertas y techos) están fabricadas de materiales fáciles de limpiar, lavar y desinfectar",
            reparaciones: "Se verifica la inexistencia de reparaciones recientes, pegamentos y/o soldaduras inapropiadas.",
            limpio: "Se observa que se ha aplicado correctamente procedimientos de limpieza y desinfección previos a la carga",
            plagas: "El vehículo se encuentra libre de plagas",
            olores: "El vehículo se encuentra libre de olores extraños o desagradables",
            insumos: "El vehículo se encuentra libre de otros insumos u objetos diferentes a la carga principal",
            medidas: "El vehículo cumple con las medidas adecuadas (ancho, largo y alto), para el correcto cargue del producto."
        }
    },
    documentacion: {
        titulo: "Documentación",
        formularios: {
            corresponse: "La documentación presentada por el conductor corresponde a la del vehículo",
            identificacion: "Se reconoció debidamente el vehículo, la identificación del conductor y se verificó la coincidencia con el Manifiesto de Carga enviado por la empresa de transporte"
        }
    }
}

export const initData = {
    funcionamiento: { cumple: false, observaciones: '' },
    temperatura: { cumple: false, observaciones: '' },
    talanquera: { cumple: false, observaciones: '' },
    dannos: { cumple: false, observaciones: '' },
    sellos_puertas: { cumple: false, observaciones: '' },
    materiales: { cumple: false, observaciones: '' },
    reparaciones: { cumple: false, observaciones: '' },
    limpio: { cumple: false, observaciones: '' },
    plagas: { cumple: false, observaciones: '' },
    olores: { cumple: false, observaciones: '' },
    insumos: { cumple: false, observaciones: '' },
    medidas: { cumple: false, observaciones: '' },
    corresponse: { cumple: false, observaciones: '' },
    identificacion: { cumple: false, observaciones: '' },
}
export const contenedoresRequest = {
    action: 'get_transporte_formulario_contenedores',
}

export const send_data = (state, contenedorSelect): object => {
    return {
        action: 'put_transporte_formulario_inspeccionMula',
        _id: contenedorSelect._id,
        __V: contenedorSelect.__v,
        data: state
    }
}