/* eslint-disable prettier/prettier */

import BotonesPasarPaginas from "@renderer/components/UI/BotonesPasarPaginas";
import { formatearFecha } from "@renderer/functions/fechas";
import useAppContext from "@renderer/hooks/useAppContext"
import { contenedoresType } from "@renderer/types/contenedoresType"
import { useEffect, useState } from "react"
import { IoDocumentTextSharp } from "react-icons/io5";
import ModalInfoReclamacion from "./components/ModalInfoReclamacion";

const header = [
    "Contenedor",
    "Cliente",
    "Fecha",
    ""
]

export default function ReclamacionesCalidad(): JSX.Element {
    const { messageModal, setLoading } = useAppContext();
    const [data, setData] = useState<contenedoresType[]>();
    const [dataSelected, setDataSelected] = useState<contenedoresType>()
    const [numeroDatos, setNumeroDatos] = useState<number>()
    const [page, setPage] = useState<number>(1);
    useEffect(() => {
        const fetchData = async (): Promise<void> => {
            try {
                await obtenerCantidadDatos()
            } catch (err) {
                if (err instanceof Error)
                    messageModal("error", err.message)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])
    useEffect(() => {
        const fetchData = async (): Promise<void> => {
            try {
                setLoading(true)
                await obtenerCantidadDatos()

                await obtenerData()
            } catch (err) {
                if (err instanceof Error)
                    messageModal("error", err.message)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [page])
    const obtenerData = async (): Promise<void> => {
        const request = {
            action: "get_comercial_formularios_reclamacionesCalidad_contenedores",
            page: page
        }
        const response = await window.api.server2(request)
        if (response.status !== 200)
            throw new Error(`Code ${response.status}: ${response.message}`)
        setData(response.data)
    }
    const obtenerCantidadDatos = async (): Promise<void> => {
        const request = {
            action: "get_comercial_formularios_reclamacionesCalidad_numeroElementos"
        }
        const response = await window.api.server2(request)
        if (response.status !== 200)
            throw new Error(`Code ${response.status}: ${response.message}`)
        setNumeroDatos(response.data)
    }
    const handleAccederDocumento = (cont): void => {
        setDataSelected(cont)
        const dialogINfo = document.getElementById("comercial_fomrularios_reclamacionCalidad") as HTMLDialogElement;
        if (dialogINfo) {
            dialogINfo.showModal();
        }
    }
    return (
        <div>
            <div className="navBar"></div>
            <h2>Reclamaciones calidad</h2>
            <hr />
            <div className="table-container">
                <table className="table-main">
                    <thead>
                        <tr>{header.map(item =>
                            <th key={item + "comercial fomularios reclamaciones calidad"}>{item}</th>
                        )}</tr>
                    </thead>
                    <tbody>
                        {
                            data && data.map((cont, index) => (
                                <tr key={cont._id} className={`${index % 2 === 0 ? 'fondo-par' : 'fondo-impar'}`}>
                                    <td>{cont.numeroContenedor}</td>
                                    <td>
                                        {typeof cont.infoContenedor.clienteInfo === 'object'
                                            ? cont.infoContenedor.clienteInfo.CLIENTE
                                            : cont.infoContenedor.clienteInfo}
                                    </td>
                                    <td>{formatearFecha(cont.reclamacionCalidad.fecha)}</td>
                                    <td>
                                        <button onClick={(): void => handleAccederDocumento(cont)}>
                                            <IoDocumentTextSharp color="green" fontSize={25} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
            <BotonesPasarPaginas
                division={25}
                page={page}
                numeroElementos={numeroDatos}
                setPage={setPage} />
            
            { dataSelected && <ModalInfoReclamacion data={dataSelected} />}
        </div>
    )
}
