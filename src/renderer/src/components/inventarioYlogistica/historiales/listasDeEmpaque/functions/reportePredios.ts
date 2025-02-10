/* eslint-disable prettier/prettier */

import { contenedoresType } from "@renderer/types/contenedoresType";
import { proveedoresType } from "@renderer/types/proveedoresType";

export type resumenPredioType = {
    [key: string]: {
        predio: string
        ICA: string,
        cajas: number;
        peso: number;
        pesoBruto: number
    }
}

export const resumenPredios =
    (contenedor: contenedoresType):
        [resumenPredioType, totalCajas: number, pesoTotal: number] => {
        const out: resumenPredioType = {};
        let totalCajas = 0;
        let pesoTotal = 0;
        contenedor.pallets.forEach((pallet) => {
            pallet.EF1.forEach((item) => {
                const id = item.lote?.predioID
                const predio = item.lote?.predio;
                const ICA = item.lote && item.lote.ICA && item.lote.ICA.code;
                const peso = Number(item.tipoCaja.split('-')[1])
                if (predio && ICA && id) {
                    if (!out[id]) {
                        out[id] = {
                            predio: predio,
                            cajas: 0,
                            peso: 0,
                            pesoBruto: 0,
                            ICA: ICA
                        };
                    }
                    out[id].cajas += item.cajas
                    out[id].peso += item.cajas * peso

                }
                totalCajas += item.cajas
                pesoTotal += peso * item.cajas
            });
        });

        return [out, totalCajas, pesoTotal];
    };

export const resumenPrediosClientes = (
    resumen: resumenPredioType,
    proveedores: proveedoresType[]
): [resumenPredioType, totalCajas: number, pesoTotal: number] => {
    const newOut = {}
    let totalPeso = 0;
    let totalCajas = 0;
    Object.entries(resumen).forEach(([key, value]) => {
        totalPeso += value.peso;
        totalCajas += value.cajas;
        const proveedor = proveedores.find(pro => pro._id === key)
        if (proveedor) {
            newOut[key] = value
        }
    })
    return [newOut, totalCajas, totalPeso]
}