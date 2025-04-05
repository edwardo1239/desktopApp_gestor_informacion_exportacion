/* eslint-disable prettier/prettier */
import { formatearFecha } from "@renderer/functions/fechas";
import { contenedoresType } from "@renderer/types/contenedoresType";
import { proveedoresType } from "@renderer/types/proveedoresType";
import { useEffect } from "react";
import { aplicar_ggn_code, aplicar_ggn_fecha } from "../functions/ggn";

type propsType = {
    contenedor: contenedoresType
    final: boolean
    proveedores: proveedoresType[]

}

const headers = [
    "PALLET ID",
    "PACKING DATE",
    "LABEL",
    "VARIETY",
    "PRODUCT",
    "WEIGHT",
    "CATEGORY",
    "SIZE",
    "QTY",
    "FARM CODE",
    "N° GG",
    "EXPIRATION DATE"
];
const label = {
    Limon: "TAHITI",
    Naranja: "ORANGE"
}



export default function TablaInfoListaEmpaque(props: propsType): JSX.Element {

    useEffect(() => {
        console.log(props.contenedor)
    }, [props.final])
    const mostrarKilose = (item): string => {
        const peso = Number(item.tipoCaja.split("-")[1]);
        if (props.final) {
            if (peso >= 17.3) return "40LB";
            if (peso >= 14) return "37LB";
            if (peso > 4 && peso < 5) return ("4,5Kg");
        }

        return (peso + "Kg");
    }

    return (
        <table className="table-main-informe-proveedor">
            <thead>
                <tr>
                    {headers
                        .filter(item => !(item === "PRODUCT") ||
                            (props.final && (typeof props.contenedor.infoContenedor.clienteInfo === 'object' &&
                                props.contenedor.infoContenedor.clienteInfo._id === '659dbd9a347a42d89929340e')))
                        .map(item => (
                            <th key={item}>{item}</th>
                        ))
                    }
                </tr>
            </thead>
            <tbody>
                {props.contenedor.pallets.map((_, index) => (
                    props.contenedor.pallets[index].EF1.map((item) => (
                        <tr className={`${index % 2 === 0 ? 'fondo-par' : 'fondo-impar'}`} key={index + item.fecha}>
                            <td>{index + 1}{props.contenedor.numeroContenedor}</td>
                            <td>{formatearFecha(item.fecha, true)}</td>
                            <td>{item.tipoCaja.split("-")[0]}</td>
                            <td>{label[item.tipoFruta]}</td>
                            {props.final &&
                                (typeof props.contenedor.infoContenedor.clienteInfo === "object" ?
                                    props.contenedor.infoContenedor.clienteInfo.CLIENTE : "") === 'KONGELATO' &&
                                <td>
                                    COL-{mostrarKilose(item)}
                                    {item.tipoFruta === 'Limon' ? 'Limes' : 'Oranges'}
                                    {item.calibre}ct
                                </td>}
                            <td>{mostrarKilose(item)}</td>
                            <td>{item.calidad}</td>
                            <td>{item.calibre}</td>
                            <td>{item.cajas}</td>
                            <td>{
                                item.SISPAP ? item.lote && item.lote.ICA && item.lote.ICA.code  : 'Sin SISPAP'
                            }</td>
                            <td>{aplicar_ggn_code(item, props.contenedor)}</td>
                            <td>
                                {aplicar_ggn_fecha(item, props.contenedor) !== "" ?
                                    formatearFecha(aplicar_ggn_fecha(item, props.contenedor)) : "N/A"}
                            </td>
                        </tr>
                    ))
                ))}
            </tbody>
        </table>
    )
}
