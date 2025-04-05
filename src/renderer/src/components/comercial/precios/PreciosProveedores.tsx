/* eslint-disable prettier/prettier */

import useAppContext from "@renderer/hooks/useAppContext"
import { proveedoresType } from "@renderer/types/proveedoresType";
import { useEffect, useState } from "react";
import './styles.css'
import ListaProveedores from "./components/ListaProveedores";
import { obtener_tipo_fruta } from "@renderer/functions/SystemRequest";
import PreciosComponent from "./components/PreciosComponent";

export default function PreciosProveedores(): JSX.Element {
    const { messageModal, setLoading } = useAppContext();
    const [proveedores, setProveedores] = useState<proveedoresType[]>();
    const [selectedProveedores, setSelectedProveedores] = useState<proveedoresType[]>();
    const [tipoFruta, setTiposFruta] = useState<string[]>()

    useEffect(() => {
        fetchData()
    }, [])


    const obtenerProveedores = async (): Promise<void> => {
        const request = {
            action: "get_comercial_precios_proveedores_registros"
        }
        const response = await window.api.server2(request)
        if (response.status !== 200) {
            throw new Error(`Code ${response.status}: ${response.message}`)
        }
        setProveedores(response.data)
    }
    const obtenerTipoFruta = async (): Promise<void> => {
        const response = await obtener_tipo_fruta()
        if (response instanceof Error) {
            throw response
        }
        setTiposFruta(response)
    }

    const fetchData = async (): Promise<void> => {
        try {
            setLoading(true)
            await Promise.all([
                obtenerProveedores(),
                obtenerTipoFruta(),
            ]);
        } catch (err) {
            if (err instanceof Error) {
                messageModal("error", err.message)
            }
        } finally {
            setLoading(false)
        }
    };
    return (
        <div>
            <div className="navBar"></div>
            <h2>Precios</h2>
            <hr />
            <div className="comercial-precios-container">
                <div className="comercial-precios-contenedor-proveedores">
                    <ListaProveedores
                        setProveedores={setProveedores}
                        selectedProveedores={selectedProveedores}
                        setSelectedProveedores={setSelectedProveedores}
                        proveedores={proveedores}
                        tipoFruta={tipoFruta} />
                </div>
                <div className="comercial-precios-contenedor-precios">
                    <PreciosComponent
                        setSelectedProveedores={setSelectedProveedores}
                        selectedProveedores={selectedProveedores}
                        tipoFruta={tipoFruta} />
                </div>
            </div>
        </div>
    )
}