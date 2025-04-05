/* eslint-disable prettier/prettier */

import { obtener_proveedores, obtener_tipo_fruta } from "@renderer/functions/SystemRequest";
import useAppContext from "@renderer/hooks/useAppContext";
import { proveedoresType } from "@renderer/types/proveedoresType";
import { useEffect, useState } from "react";
import FiltroRegistroPreciosProveedores from "./components/FiltroRegistroPreciosProveedores";
import { precioProveedorType } from "@renderer/types/preciosTypes";
import BotonesPasarPaginas from "@renderer/components/UI/BotonesPasarPaginas";
import TablaRegistroPreciosProveedores from "./components/TablaRegistroPreciosProveedores";

export type filtroType = {
    fechaInicio: string
    fechaFin: string
    tipoFruta: string
    proveedor: string
}

export default function RegistrosPreciosProveedores(): JSX.Element {
    const { messageModal, setLoading } = useAppContext();
    const [tipoFruta, setTipoFruta] = useState<string[]>();
    const [proveedores, setProveedores] = useState<proveedoresType[]>();
    const [numeroRegistros, setNumeroRegistros] = useState<number>(0);
    const [precios, setPrecios] = useState<precioProveedorType[]>();
    const [filtro, setFiltro] = useState<filtroType>();
    const [page, setPage] = useState<number>(1);

    useEffect(() => {
        const fetchData = async (): Promise<void> => {
            try {
                setLoading(true)
                await obtenerTipoFruta()
                await obtenerProveedores()
                await obtenerPrecios()
            } catch (err) {
                if (err instanceof Error) {
                    messageModal("error", err.message)
                }
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    useEffect(() => {
        obtenerPrecios()
    }, [page, filtro])

    const obtenerTipoFruta = async (): Promise<void> => {
        const response = await obtener_tipo_fruta()
        if (response instanceof Error) {
            throw response
        }
        setTipoFruta(response)
    }
    const obtenerProveedores = async (): Promise<void> => {
        const response = await obtener_proveedores()
        if (response instanceof Error) {
            throw response
        }
        setProveedores(response)
    }
    const obtenerPrecios = async (): Promise<void> => {
        const request = {
            action: "get_comercial_precios_registros_precios_proveedores",
            filtro: filtro,
            page: page
        }
        const response = await window.api.server2(request)
        if (response.status !== 200) {
            throw new Error(`Code ${response.status}: ${response.message}`)
        }
        setPrecios(response.data.registros)
        setNumeroRegistros(response.data.numeroRegistros)
    }

    return (
        <div>
            <div className="navBar"></div>
            <h2>Registros Precios</h2>
            <hr />
            <FiltroRegistroPreciosProveedores
                filtro={filtro}
                setFiltro={setFiltro}
                obtenerPrecios={obtenerPrecios}
                tipoFruta={tipoFruta}
                proveedores={proveedores} />

            <TablaRegistroPreciosProveedores
                obtenerPrecios={obtenerPrecios}
                proveedores={proveedores}
                data={precios} />
            <BotonesPasarPaginas
                setPage={setPage}
                page={page}
                numeroElementos={numeroRegistros}
                division={50} />
        </div>
    )
}