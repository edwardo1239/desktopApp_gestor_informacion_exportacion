/* eslint-disable prettier/prettier */
const excludeKeys = [
    "_id", 
    "createdAt", 
    "fechaFin", 
    "fechaInicio", 
    "ID", 
    "formulario", 
    "__v",
    "responsable"
];
import { LimpiezaMensualType } from "@renderer/types/limpieza_mensual";

interface DataItem {
    status: boolean;
    observaciones: string;
}

interface OutputItem {
    Area: string;
    Item: string;
    Cumple: string;
    Observaciones: string;
}

export const ordensarDataImprimir = (data: LimpiezaMensualType): OutputItem[] => {
    const arrOut: OutputItem[] = [];
    Object.keys(data).forEach((area) => {
        if (!excludeKeys.includes(area)) {
            Object.keys(data[area]).forEach((item) => {
                    const dataItem = data[area][item] as DataItem;
                    arrOut.push({
                        Area: area,
                        Item: item,
                        Cumple: dataItem.status ? "Cumple" : "No cumple",
                        Observaciones: dataItem.observaciones
                    });
            });
        }
    });

    return arrOut;
};