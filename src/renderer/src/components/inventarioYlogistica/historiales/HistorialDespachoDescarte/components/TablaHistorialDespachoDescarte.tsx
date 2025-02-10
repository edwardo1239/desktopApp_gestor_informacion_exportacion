/* eslint-disable prettier/prettier */

import { despachoDescartesType } from "@renderer/types/despachoDescartesType"
import { lotesType } from "@renderer/types/lotesType";
import { useState } from "react";
import { TbListDetails } from "react-icons/tb";
import ModalInfoDescartes from "./ModalInfoDescarte";
import { formatearFecha } from "@renderer/functions/fechas";

type propsType = {
    data: despachoDescartesType[] | undefined
}

export default function TablaHistorialDespachoDescarte(props: propsType): JSX.Element {
    const [showDetalles, setShowDetalles] = useState<boolean>(false)
    const [seleccionado, setSeleccionado] = useState<lotesType[]>()
    const headers = ['Fecha', 'Placa', 'Conductor', 'Telefono', 'Cedula', 'Remisión', 'Tipo fruta', 'usuario', 'Detalles']

    const openModal = (item): void => {
        setShowDetalles(true)
        setSeleccionado(item)
    }
    const closeModal = (): void => {
        setShowDetalles(false)
    }

    if (props.data === undefined) {
        return (
            <div>Cargando datos...</div>
        )
    }
    return (
        <div className="table-container">
            <table className="table-main">
                <thead>
                    <tr>
                        {headers.map(item => (
                            <th key={item}>{item}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {props.data.map((item, index) => (
                        <tr className={`${index % 2 === 0 ? 'fondo-par' : 'fondo-impar'}`} key={item._id} >

                            <td>{formatearFecha(item.fecha, true)}</td>
                            <td>{item.placa}</td>
                            <td>{item.nombreConductor}</td>
                            <td>{item.telefono}</td>
                            <td>{item.cedula}</td>
                            <td>{item.remision}</td>
                            <td>{item.tipoFruta}</td>
                            <td>{item.user}</td>
                            <td onClick={(): void => openModal(item.lotesDespachados)}>
                                <div style={{ color: 'blue' }}><TbListDetails /></div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {showDetalles &&
                <ModalInfoDescartes data={seleccionado} handleModal={closeModal} />
            }
        </ div>
    )
}
