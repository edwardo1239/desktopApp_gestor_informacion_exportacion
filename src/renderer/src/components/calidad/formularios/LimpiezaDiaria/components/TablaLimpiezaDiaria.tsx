/* eslint-disable prettier/prettier */

import { formatearFecha } from "@renderer/functions/fechas";
import { LimpiezaDiariaType } from "@renderer/types/limpieza_diaria"
import { IoDocumentTextSharp } from "react-icons/io5";

type propsType = {
    data: LimpiezaDiariaType[] | undefined
    show_info: (_id: LimpiezaDiariaType) => void
}
const headers = ["ID", "fecha", ""]
export default function TablaLimpiezaDiaria(props: propsType): JSX.Element {


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
                        <tr className={`${index % 2 === 0 ? 'fondo-par' : 'fondo-impar'}`} key={item._id}>
                            <td>{item.ID}</td>
                            <td>{formatearFecha(item.fechaInicio)}</td>
                            <td>
                                <div onClick={(): void => props.show_info(item)}>
                                    <IoDocumentTextSharp color="green" fontSize={25} />
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}