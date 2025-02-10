/* eslint-disable prettier/prettier */

import useAppContext from "@renderer/hooks/useAppContext"
import { contenedoresType } from "@renderer/types/contenedoresType";
import { useEffect, useState } from "react";
import TablaRegistorsInspeccionMulaContenedores from "./components/TablaRegistorsInspeccionMulaContenedores";
import InfoInspeccionMula from "./components/InfoInspeccionMula";
import "./styles.css"


export default function TransporteRegistroInspeccionMulas(): JSX.Element {
    const { messageModal } = useAppContext();

    const [data, setData] = useState<contenedoresType[]>()
    const [itemSeleccionado, setItemSeleccionado] = useState<contenedoresType>()
    const [showInfo, setShowInfo] = useState<boolean>(false)
    //page navigator
    const [page, setPage] = useState<number>(1);
    const [numeroElementos, setNumeroElementos] = useState<number>()



    const obtenerNumeroElementos = async (): Promise<void> => {
        try {
            const query = {
                action: "get_transporte_registros_inspeccionMula_numeroElementos"
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
            const request = {
                action: "get_transporte_registro_formularios_inspeccion",
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
        }
    }

    useEffect(() => {
        obtenerNumeroElementos()
    }, [])
    useEffect(() => {
        obtenerData()
    }, [page])

    const show_info = (cont): void => {
        setItemSeleccionado(cont);
        setShowInfo(true)
    }

    const show_table = (): void => {
        setItemSeleccionado(undefined)
        setShowInfo(false)
    }

    if (!data) {
        return (
            <div className="componentContainer">
                <div className="navBar"></div>
                <h2>Cargando...</h2>
            </div>
        )
    }
    return (
        <div className="componentContainer">
            <div className="navBar"></div>
            <h2>Registro inspección tractomula</h2>
            <hr />
            {showInfo ?
                <InfoInspeccionMula 
                    setItemSeleccionado={setItemSeleccionado}
                    obtenerData={obtenerData}
                    show_table={show_table} 
                    data={itemSeleccionado} />
                :
                <TablaRegistorsInspeccionMulaContenedores
                    data={data}
                    setPage={setPage}
                    show_info={show_info}
                    numeroElementos={numeroElementos}
                    page={page} />
            }

        </div>
    )
}