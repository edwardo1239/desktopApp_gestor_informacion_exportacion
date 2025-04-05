/* eslint-disable prettier/prettier */

import BotonesPasarPaginas from "@renderer/components/UI/BotonesPasarPaginas";
import { formatearFecha } from "@renderer/functions/fechas";
import useAppContext from "@renderer/hooks/useAppContext"
import { contenedoresType } from "@renderer/types/contenedoresType";
import { useEffect, useState } from "react";
import { IoDocumentTextSharp } from "react-icons/io5";

const headers = [
    "Contenedor",
    "Cliente",
    "Fecha",
    ""
]

export default function TransporteDocumentacionProgramacionMula(): JSX.Element {
    const { messageModal, setLoading } = useAppContext();
    const [data, setData] = useState<contenedoresType[]>()

    //page navigator
    const [page, setPage] = useState<number>(1);
    const [numeroElementos, setNumeroElementos] = useState<number>()

    const obtenerNumeroElementos = async (): Promise<void> => {
        try {
            const query = {
                action: "get_transporte_documentos_programacionMulas_numeroElementos"
            }
            const response = await window.api.server2(query);
            if (response.status !== 200)
                throw new Error(`Code ${response.status}: ${response.message}`)
            setNumeroElementos(response.data)
        } catch (err) {
            if (err instanceof Error) {
                messageModal("error", err.message)
            }
        }
    }
    const obtenerData = async (): Promise<void> => {
        try {
            setLoading(true)
            const request = {
                action: "get_transporte_documentos_programacionMula_contenedores",
                page: page
            }
            const response = await window.api.server2(request);
            if (response.status !== 200)
                throw new Error(`Code ${response.status}: ${response.message}`)
            setData(response.data)
        } catch (err) {
            if (err instanceof Error) {
                messageModal("error", err.message)
            }
        } finally {
            setLoading(false)
        }
    }

    const generar_informe = async (contenedor): Promise<void> => {
        try {
            if (!contenedor) throw new Error("No hay contenedor seleccionado")

            const data = {
                action: "crear_documentos_programacon_mula",
                data: {
                    contenedor: contenedor
                }
            }
            window.api.crearDocumento(data)

        } catch (err) {
            console.error('Error al generar PDF:', err);
            messageModal("error", "Error al generar los documentos");
        }
    };
    useEffect(() => {
        obtenerNumeroElementos()
    }, [])
    useEffect(() => {
        obtenerData()
    }, [page])

    if (!data) {
        return (
            <div className="componentContainer">
                <div className="navBar"></div>
                <h2>Documentación programación tractomula</h2>
                <hr />
                <h2>Cargando datos...</h2>
            </div>
        )
    }
    return (
        <div className="componentContainer">
            <div className="navBar"></div>
            <h2>Documentación programación tractomula</h2>
            <hr />
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
                        {data.map((cont, index) => (
                            <tr key={cont._id} className={`${index % 2 === 0 ? 'fondo-par' : 'fondo-impar'}`}>
                                <td>{cont.numeroContenedor}</td>
                                <td>{typeof cont.infoContenedor.clienteInfo === 'object' &&
                                    cont.infoContenedor.clienteInfo.CLIENTE
                                }</td>
                                <td>{cont.infoContenedor.fechaCreacion && formatearFecha(cont.infoContenedor.fechaCreacion)}</td>
                                <td>
                                    <button onClick={(): Promise<void> => generar_informe(cont)}>
                                        <IoDocumentTextSharp color="green" fontSize={25} />
                                    </button>
                                </td>

                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <BotonesPasarPaginas
                division={50}
                page={page}
                numeroElementos={numeroElementos}
                setPage={setPage} />
        </div>
    )
}