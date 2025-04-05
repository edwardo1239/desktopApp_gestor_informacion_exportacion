/* eslint-disable prettier/prettier */

import { formatearFecha } from "@renderer/functions/fechas"
import { precioProveedorType } from "@renderer/types/preciosTypes"
import { proveedoresType } from "@renderer/types/proveedoresType"
import { IoMdText } from "react-icons/io";
import ModalIngresarComentario from "./ModalIngresarComentario";
import { useState } from "react";

type propsType = {
    data: precioProveedorType[] | undefined
    proveedores: proveedoresType[] | undefined
    obtenerPrecios: () => void
}

const headers = [
    "Fecha Ingreso",
    "Año",
    "Semana",
    "Exp. 1",
    "Exp. 1.5",
    "Exp. Industrial",
    "Descarte",
    "Fruta Na.",
    "Fruta",
    "Predios",
    "Observaciones",
    ""
]

export default function TablaRegistroPreciosProveedores(props: propsType): JSX.Element {
    const [registroSeleccionado, setRegistroSeleccionado] = useState<precioProveedorType>();
    const openModal = (item): void => {
        const dialogSetting = document.getElementById("modal_comercial_precios_comentarios") as HTMLDialogElement;
        if (dialogSetting) {
            dialogSetting.showModal()
            setRegistroSeleccionado(item)
        }
    }

    if (props.data === undefined || props.proveedores === undefined) {
        return <div>Cargando...</div>
    }
    return (
        <div className="table-container">
            <table className="table-main">
                <thead>
                    <tr>
                        {headers.map(item => <th key={item}>{item}</th>)}
                    </tr>
                </thead>
                <tbody>
                    {props.data.map((item, index) => (
                        <tr key={item._id} className={`${index % 2 === 0 ? 'fondo-par' : 'fondo-impar'}`}>
                            <td>{formatearFecha(item.fecha)}</td>
                            <td>{item.year ?? ''}</td>
                            <td>{item.week ?? ''}</td>
                            <td>{new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(item[1])}</td>
                            <td>{new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(item[15])}</td>
                            <td>{new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(item[2])}</td>
                            <td>{new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(item.descarte)}</td>
                            <td>{new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(item.frutaNacional)}</td>
                            <td>{item.tipoFruta}</td>
                            <td>
                                {item.predios.length < 10 &&
                                    item.predios.map(predio =>
                                        <div key={predio}>{
                                            props.proveedores?.find(proveedor =>
                                                proveedor._id === predio)?.PREDIO
                                        }</div>
                                    )}
                            </td>
                            <td>{item.comentario ?? ''}</td>
                            <td><button onClick={():void => openModal(item)}><IoMdText color="blue" /></button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <ModalIngresarComentario obtenerPrecios={props.obtenerPrecios} data={registroSeleccionado}/>
        </div>
    )
}
