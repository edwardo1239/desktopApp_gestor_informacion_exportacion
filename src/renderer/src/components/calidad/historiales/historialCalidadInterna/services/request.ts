/* eslint-disable prettier/prettier */

export const requestData = (page): object => {
    return {
        action: 'get_historial_calidad_interna',
        page: page
    }
}

export const request_guardar_cambios = (lote, formData): object => {
    return {
        action: 'modificar_calidad_interna_lote',
        _id: lote._id,
        __v: lote.__v,
        data:{
            "calidad.calidadInterna.acidez": Number(formData.acidez),
            "calidad.calidadInterna.brix": Number(formData.brix),
            "calidad.calidadInterna.ratio": Number(formData.ratio),
            "calidad.calidadInterna.zumo": Number(formData.zumo),
        }

    }
}