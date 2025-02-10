/* eslint-disable prettier/prettier */
import { LimpiezaDiariaType } from "@renderer/types/limpieza_diaria";
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

export const ordensarDataImprimir = (data: LimpiezaDiariaType): OutputItem[] => {
    const arrOut: OutputItem[] = [];

    Object.keys(data).forEach((area) => {
        if (!excludeKeys.includes(area)) {
            Object.keys(data[area]).forEach((item) => {
                if (item !== 'responsable') {
                    const dataItem = data[area][item] as DataItem;
                    arrOut.push({
                        Area: area,
                        Item: item,
                        Cumple: dataItem.status ? "Cumple" : "No cumple",
                        Observaciones: dataItem.observaciones
                    });
                }
            });
        }
    });

    return arrOut;
};