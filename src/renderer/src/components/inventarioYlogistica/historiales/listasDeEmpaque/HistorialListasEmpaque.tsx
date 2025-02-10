/* eslint-disable prettier/prettier */

import useAppContext from "@renderer/hooks/useAppContext"
import { contenedoresType } from "@renderer/types/contenedoresType"
import { useEffect, useState } from "react"
import TablaHistorialListaEmpaque from "./components/TablaHistorialListaEmpaque";
import InfoListaEmpaque from "./components/InfoListaEmpaque";
import './styles/styles.css'
import { proveedoresType } from "@renderer/types/proveedoresType";
import BotonesPasarPaginas from "@renderer/components/UI/BotonesPasarPaginas";

export default function HistorialListaEmpaque(): JSX.Element {
    const { messageModal } = useAppContext();
    const [data, setData] = useState<contenedoresType[]>()
    const [page, setPage] = useState<number>(1)
    const [numeroDoc, setNumeroDoc] = useState<number>();

    const [showTable, setShowTable] = useState<boolean>(true)
    const [contenedor, setContenedor] = useState<contenedoresType>()
    const [proveedores, setProveedores] = useState<proveedoresType[]>()

    useEffect(() => {
        obtenerData()
        obtenerProveedores()
        obtener_numero_elementos()
    }, [page])

    useEffect(() => {
        const _id = localStorage.getItem("proceso-historial-listaempaque-id-contenedor")
        if (_id && data !== undefined) {
            const contenedorSeleccionado = data?.find(item => item._id === _id);

            if (contenedorSeleccionado) {
                setContenedor(contenedorSeleccionado)
                setShowTable(false)
                localStorage.removeItem("proceso-historial-listaempaque-id-contenedor")
            }
        }
    }, [data])

    const obtenerData = async (): Promise<void> => {
        try {
            const request = {
                action: "obtener_contenedores_historial_listas_empaque",
                page: page
            }
            const response = await window.api.server2(request)
            if (response.status !== 200)
                throw new Error(`Code ${response.status}: ${response.message}`);
            setData(response.data)
        } catch (err) {
            if (err instanceof Error) {
                messageModal("error", err.message)
            }
        }
    }
    const obtener_numero_elementos = async (): Promise<void> => {
        try {
            const request = { action: "obtener_cantidad_contenedores" }
            const response = await window.api.server2(request)
            if (response.status !== 200)
                throw new Error(`Code ${response.status}: ${response.message}`)
            setNumeroDoc(response.data)
        } catch (err) {
            if (err instanceof Error) {
                messageModal("error", "Error obteniendo el numero de elementos")
            }
        }
    }
    const obtenerProveedores = async (): Promise<void> => {
        try {
            const request = {
                action: 'get_sys_proveedores',
                data: "all"
            };
            const response = await window.api.server2(request);
            if (response.status !== 200)
                throw new Error(response.message)
            console.log("cantidad de datos", response.data.length)
            setProveedores(response.data)
        } catch (e) {
            if (e instanceof Error)
                messageModal("error", e.message)
        }
    }
    const handleAccederDocumento = (cont: contenedoresType): void => {
        setShowTable(false)
        setContenedor(cont)
    }
    const handleVolverTabla = (): void => {
        setShowTable(true)
    }
    return (
        <div>
            <div className="navBar"></div>
            <h2>Historial listas empaque</h2>
            <hr />

            {showTable ?
                <TablaHistorialListaEmpaque handleAccederDocumento={handleAccederDocumento} data={data} />
                :
                <InfoListaEmpaque
                    proveedores={proveedores}
                    handleVolverTabla={handleVolverTabla}
                    contenedor={contenedor} />
            }
            {showTable &&

                <BotonesPasarPaginas
                    division={50}
                    page={page}
                    numeroElementos={numeroDoc}
                    setPage={setPage}
                />
            }
        </div>
    )
}
