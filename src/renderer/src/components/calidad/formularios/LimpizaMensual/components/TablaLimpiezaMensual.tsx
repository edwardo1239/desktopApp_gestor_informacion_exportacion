/* eslint-disable prettier/prettier */

import { LimpiezaMensualType } from "@renderer/types/limpieza_mensual";
import { format } from "date-fns"
import { es } from 'date-fns/locale';
import { IoDocumentTextSharp } from "react-icons/io5";


type propsType = {
    data: LimpiezaMensualType[] | undefined
    show_info: (_id: LimpiezaMensualType) => void
}
const headers = ["ID", "fecha", ""]
export default function TablaLimpiezaMensual(props: propsType): JSX.Element {
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
                            <td>{format(new Date(item.fechaInicio), 'dd/MM/yyyy', { locale: es })}</td>
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