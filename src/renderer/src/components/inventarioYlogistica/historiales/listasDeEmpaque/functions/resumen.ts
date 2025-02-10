/* eslint-disable prettier/prettier */
import { contenedoresType } from "@renderer/types/contenedoresType";

export function resumenCalidad (
    contenedor:contenedoresType, 
    calidad:string,
): object {
    const out = {}
    let total = 0;

    contenedor.pallets.forEach((pallet) => {
        let palletFlag = false
        const calibre = new Set()
        pallet.EF1.forEach(item => {
            total += item.cajas
            if(item.calidad === calidad){
                if(!Object.prototype.hasOwnProperty.call(out, item.calibre)){
                    out[item.calibre] = {
                        cantidad:0,
                        pallets: 0,
                    }
                }
                out[item.calibre].cantidad += item.cajas
                palletFlag = true
                calibre.add(item.calibre)
            }
        })
        if(palletFlag){
            const arrCalibre = [...calibre]
            arrCalibre.forEach(cal => {
                out[cal as string].pallets += 1
            })
        }
    })

    Object.keys(out).forEach(item => {
        out[item].porcentage = (out[item].cantidad * 100) / total
    })
    return out
}