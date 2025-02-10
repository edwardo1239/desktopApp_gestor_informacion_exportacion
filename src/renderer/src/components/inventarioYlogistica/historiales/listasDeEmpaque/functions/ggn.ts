/* eslint-disable prettier/prettier */

import { contenedoresType, EF1Type } from "@renderer/types/contenedoresType";

export function aplicar_ggn_code (item:EF1Type, contenendor:contenedoresType): string {
    if(item.lote?.GGN && item.lote.GGN.code)  {
        if(typeof contenendor.infoContenedor.clienteInfo === 'object'){
            const cont = contenendor.infoContenedor.clienteInfo.PAIS_DESTINO;
            const lote = item.lote.GGN.paises
            if(lote.some(elemento => cont.includes(elemento))){
                return item.lote.GGN.code
            }
        }
    }
    return ""
}

export function aplicar_ggn_fecha (item:EF1Type, contenendor:contenedoresType): string {
    if(item.lote?.GGN && item.lote.GGN.code)  {
        if(typeof contenendor.infoContenedor.clienteInfo === 'object'){
            const cont = contenendor.infoContenedor.clienteInfo.PAIS_DESTINO;
            const lote = item.lote.GGN.paises
            if(lote.some(elemento => cont.includes(elemento))){
                return item.lote.GGN.fechaVencimiento
            }
        }
    }
    return ""
}
