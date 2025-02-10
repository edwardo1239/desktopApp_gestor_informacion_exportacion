/* eslint-disable prettier/prettier */
type consultaType = {
    tipoFruta?: string
    enf?:string
    "calidad.calidadInterna.fecha"?: {
        $gte?: Date
        $lt?: Date
    }
}

export const crear_filtro = (filtro):consultaType => {
    const consulta: consultaType = {}
    if(filtro.tipoFruta && filtro.tipoFruta !== ''){
        consulta.tipoFruta = filtro.tipoFruta
    }
    if(filtro.rnf && filtro.rnf !== ''){
        consulta.enf = filtro.enf
    }
    if(filtro.fecha && filtro.fecha !== '' && filtro.fecha !== null && filtro.fecha !== undefined){
        consulta["calidad.calidadInterna.fecha"] = {};
        consulta["calidad.calidadInterna.fecha"].$gte = new Date(0);
        consulta["calidad.calidadInterna.fecha"].$lt = filtro.fecha;
    }
    return consulta
}