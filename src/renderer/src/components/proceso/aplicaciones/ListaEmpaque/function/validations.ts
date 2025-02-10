/* eslint-disable prettier/prettier */

import { contenedoresType } from "@renderer/types/contenedoresType";
import { predioType } from "../types";


export const validarActualizarPallet = (cajas: number, loteActual: predioType, pallet: number, contenedor: contenedoresType):number => {
    if (isNaN(cajas)) { throw new Error('Ingrese el numero de cajas'); }
    if (cajas <= 0) { throw new Error('Ingrese el numero de cajas'); }
    if (loteActual.enf === '') { throw new Error('Seleccione un lote'); }
    if (pallet === -1) { throw new Error('Pallet no permitido'); }
    const cajasActual = cajas - Number(contenedor?.pallets[pallet].EF1.reduce((acu, item) => (acu += item.cajas), 0));
    if (cajasActual < 1) { throw new Error('Error en el numero de cajas'); }
    if (
        contenedor?.infoContenedor.tipoFruta !== 'Mixto' &&
        contenedor?.infoContenedor.tipoFruta !== loteActual.tipoFruta
    ) {
        throw new Error('El contenedor tiene un tipo de fruta diferente');
    }
    if (contenedor.pallets[pallet].settings.tipoCaja === '') 
        { throw new Error('Error configure el pallet'); }
    if (contenedor.pallets[pallet].settings.calibre === '') 
        { throw new Error('Error configure el pallet'); }
    if (contenedor.pallets[pallet].settings.calidad === '') 
        { throw new Error('Error configure el pallet'); }
    return cajasActual;
};
export const validarSumarDato = (cajas: number, loteActual: predioType, pallet: number, contenedor: contenedoresType): void => {
    if (isNaN(cajas)) { throw new Error('Ingrese el numero de cajas'); }
    if (cajas <= 0) { throw new Error('Ingrese el numero de cajas'); }
    if (loteActual.enf === '') { throw new Error('Seleccione un lote'); }
    if (pallet === -1) { throw new Error('Pallet no permitido'); }
    if (contenedor.pallets[pallet].settings.tipoCaja === '') 
        { throw new Error('Error configure el pallet'); }
    if (contenedor.pallets[pallet].settings.calibre === '') 
        { throw new Error('Error configure el pallet'); }
    if (contenedor.pallets[pallet].settings.calidad === '') 
        { throw new Error('Error configure el pallet'); }
};
export const validarEliminar = ( loteActual: predioType, seleccion: number[]): void => {
    if (loteActual.enf === '') { throw new Error('Seleccione un lote'); }
    if (seleccion.length === 0) { throw new Error('Seleccione el item que desea eliminar'); }
};