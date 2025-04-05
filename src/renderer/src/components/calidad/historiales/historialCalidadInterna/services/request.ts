/* eslint-disable prettier/prettier */

export const requestData = (page): object => {
    return {
        action: 'get_calidad_historial_calidadInterna',
        page: page
    }
}

export const request_guardar_cambios = (lote, formData): object => {
    return {
        action: 'put_calidad_historial_calidadInterna',
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