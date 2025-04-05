/* eslint-disable prettier/prettier */
import { formatearFecha } from "@renderer/functions/fechas";
import { contenedoresType } from "@renderer/types/contenedoresType";
import { IoDocumentTextSharp } from "react-icons/io5";
import BotonesPasarPaginas from "@renderer/components/UI/BotonesPasarPaginas";

const headers = [
    "Contenedor",
    "Cliente",
    "Fecha",
    ""
]

type propsType = {
    show_info: (e) => void
    data: contenedoresType[] | undefined
    page: number
    numeroElementos: number | undefined
    setPage: (e) => void
}

export default function TablaRegistorsInspeccionMulaContenedores(props: propsType): JSX.Element {
    if (!props.data) {
        return (
            <div>Cargando datos...</div>
        )
    }
    return (
        <>
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
                            <tr key={cont._id} className={`${index % 2 === 0 ? 'fondo-par' : 'fondo-impar'}`}>
                                <td>{cont.numeroContenedor}</td>
                                <td>{typeof cont.infoContenedor.clienteInfo === 'object' &&
                                    cont.infoContenedor.clienteInfo.CLIENTE
                                }</td>
                                <td>{cont.inspeccion_mula.fecha && formatearFecha(cont.inspeccion_mula.fecha)}</td>
                                <td>
                                    <div onClick={(): void => props.show_info(cont)}>
                                        <IoDocumentTextSharp color="green" fontSize={25} />
                                    </div>
                                </td>

                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <BotonesPasarPaginas
                division={50}
                page={props.page}
                numeroElementos={props.numeroElementos}
                setPage={props.setPage} />
        </>
    )
}