/* eslint-disable prettier/prettier */

import { formatearFecha } from "@renderer/functions/fechas";
import { contenedoresType } from "@renderer/types/contenedoresType"
import { IoDocumentTextSharp } from "react-icons/io5";

type propsType = {
    data: contenedoresType[] | undefined
    handleAccederDocumento: (data: contenedoresType) => void
}

const headers = ["# Contenedor", "Cliente", "Creación", ""]

export default function TablaHistorialListaEmpaque(props: propsType): JSX.Element {

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
                    {props.data.map((cont, index) => (
                        <tr className={`${index % 2 === 0 ? 'fondo-par' : 'fondo-impar'}`} key={cont._id}>
                            <td>{cont.numeroContenedor}</td>
                            <td>{cont.numeroContenedor + " - " +
                                (typeof cont.infoContenedor.clienteInfo === "object" ?
                                    cont.infoContenedor.clienteInfo.CLIENTE : "")}</td>
                            <td>{formatearFecha(cont.infoContenedor.fechaCreacion)}</td>
                            <td>
                                <button onClick={(): void => props.handleAccederDocumento(cont)}>
                                    <IoDocumentTextSharp color="green" fontSize={25} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
