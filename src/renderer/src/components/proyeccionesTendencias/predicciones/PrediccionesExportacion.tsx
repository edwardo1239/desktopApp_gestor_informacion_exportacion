/* eslint-disable prettier/prettier */

import { obtener_clientes, obtener_proveedores } from "@renderer/functions/SystemRequest";
import useAppContext from "@renderer/hooks/useAppContext"
import { proveedoresType } from "@renderer/types/proveedoresType"
import { useEffect, useState } from "react"
import ListaProveedores from "./components/ListaProveedores";
import "./styles.css"
import { clienteType } from "@renderer/types/clientesType";
import ListaClientes from "./components/ListaClientes";

export type listaProveedortype = {
    _id: string
    predio: string
    codigo: string
    kilos: string
    tipoFruta: string
    client: string[]
}

export default function PrediccionesExportacion(): JSX.Element {
    const { messageModal, setLoading } = useAppContext();
    const [proveedores, setProveedores] = useState<proveedoresType[]>();
    const [clientes, setClientes] = useState<clienteType[]>();
    const [selectedClientes, setSelectedClientes] = useState<string[]>([]);
    const [proveedoresLista, setProveedoresLista] = useState<listaProveedortype[]>([])
    const [exportacionTotal, setExportacionTotal] = useState<number>()
    const [descarteTotal, setDescarteTotal] = useState<number>()

    useEffect(() => {

        const requestFunction = async (): Promise<void> => {
            try {
                setLoading(true)
                await obtenerPredios()
                await obtenerClientes()
            } catch (err) {
                if (err instanceof Error) {
                    messageModal("error", err.message)
                }
            } finally {
                setLoading(false)
            }
        }
        requestFunction()

    }, [])
    const obtenerPredios = async (): Promise<void> => {
        const response = await obtener_proveedores("activos")
        if (response instanceof Error) {
            throw response
        }
        setProveedores(response)
    }
    const obtenerClientes = async (): Promise<void> => {
        const response = await obtener_clientes()
        if (response instanceof Error) {
            throw response
        }
        setClientes(response)
    }
    const handleGenerar = async (): Promise<void> => {
        try {
            setLoading(true)

            const newData = proveedoresLista.map(prov => {
                return { ...prov, client: selectedClientes }
            })
            const request = {
                action: "get_python_data_porcentageExportacion",
                data: newData
            }

            const response = await window.api.server2(request)
            if (response.status !== 200)
                throw new Error(`Code ${response.status}: ${response.message}`)
            setDescarteTotal(response.data.descarte_total)
            setExportacionTotal(response.data.exportacion_total)
        } catch (err) {
            if (err instanceof Error)
                messageModal("error", err.message)
        } finally {
            setLoading(false)
        }
    }
    return (
        <div>
            <div className="navBar"></div>
            <h2>Predicciones</h2>
            <hr />
            <div>
                <div>
                    <div className='filtroContainer'>
                        <div className='div-filter-actions'>
                            <button onClick={handleGenerar}>
                                Generar
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" ><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12 3c7.2 0 9 1.8 9 9s-1.8 9 -9 9s-9 -1.8 -9 -9s1.8 -9 9 -9z" /><path d="M15 12h-6" /><path d="M12 9v6" /></svg>
                            </button>

                            <h3>
                                exportacion Total {exportacionTotal?.toFixed(2)}
                            </h3>
                            <h3>
                                Descarte Total {descarteTotal?.toFixed(2)}
                            </h3>
                        </div>
                    </div>
                </div>
                <div className="predicciones-container">
                    <div className="predicciones-contenedor-proveedores">

                        <ListaClientes
                            setSelectedClientes={setSelectedClientes}
                            selectedClientes={selectedClientes}
                            clientes={clientes}
                        />
                    </div>
                    <div className="predicciones-contenedor-proveedores">
                        <ListaProveedores
                            proveedores={proveedores}
                            setProveedoresLista={setProveedoresLista}
                            proveedoresLista={proveedoresLista}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
