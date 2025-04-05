/* eslint-disable prettier/prettier */
import useAppContext from "@renderer/hooks/useAppContext";
import { LimpiezaDiariaType } from "@renderer/types/limpieza_diaria"
import { useEffect, useState } from "react"
import TablaLimpiezaDiaria from "./components/TablaLimpiezaDiaria";
import InfoFormularioLimpiezaDiaria from "./components/InfoFormularioLimpiezaDiaria";
import BotonesPasarPaginas from "@renderer/components/UI/BotonesPasarPaginas";
import './styles.css'

export default function LimpiezaDiaria(): JSX.Element {
    const { messageModal } = useAppContext();
    const [data, setData] = useState<LimpiezaDiariaType[]>();
    const [numeroElementos, setNumeroElementos] = useState<number>(1)
    const [page, setPage] = useState<number>(1)
    const [showInfo, setShowInfo] = useState<boolean>(false)
    const [formulario, setFormulario] = useState<LimpiezaDiariaType>()

    useEffect(() => {
        obtenerData()
        obtener_cantidad_elementos()
    }, [page]);

    const obtenerData = async (): Promise<void> => {
        try {
            const request = {
                action: "get_calidad_formulario_limpiezaDiaria",
                page: page
            }
            const response = await window.api.server2(request)
            if (response.status !== 200)
                throw new Error(`Code ${response.status}: ${response.message}`)
            setData(response.data)
            console.log(response)
        } catch (err) {
            if (err instanceof Error) {
                messageModal("error", err.message)
            }
        }
    }
    const obtener_cantidad_elementos = async (): Promise<void> => {
        try {
            const request = { action: "get_calidad_formulario_limpiezaDiaria_numeroElementos" }
            const response = await window.api.server2(request)
            if (response.status !== 200)
                throw new Error(`Code ${response.status}: ${response.message}`)
            setNumeroElementos(response.data)
            console.log(response)
        } catch (err) {
            if (err instanceof Error) {
                messageModal("error", err.message)
            }
        }

    }
    const show_info = (item: LimpiezaDiariaType): void => {
        setShowInfo(true)
        setFormulario(item)
    }
    const close_info = (): void => {
        setShowInfo(false)
    }
    return (
        <div className="componentContainer">
            <div className="navBar"></div>
            <h2>Limpieza Diaría</h2>
            <hr />

            {showInfo ?

                <InfoFormularioLimpiezaDiaria close_info={close_info} data={formulario} />
                :
                <>
                    <TablaLimpiezaDiaria show_info={show_info} data={data} />
                    <BotonesPasarPaginas
                        division={50}
                        page={page}
                        numeroElementos={numeroElementos}
                        setPage={setPage}
                    />
                </>
            }

        </div>
    )
}
