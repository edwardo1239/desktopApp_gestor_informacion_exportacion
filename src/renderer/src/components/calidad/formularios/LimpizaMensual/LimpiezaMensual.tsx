/* eslint-disable prettier/prettier */
import useAppContext from "@renderer/hooks/useAppContext";
import { useEffect, useState } from "react"
import TablaLimpiezaDiaria from "./components/TablaLimpiezaMensual";
import InfoFormularioLimpiezaMensual from "./components/InfoFormularioLimpiezaMensual";
import { LimpiezaMensualType } from "@renderer/types/limpieza_mensual";
import BotonesPasarPaginas from "@renderer/components/UI/BotonesPasarPaginas";
import './styles.css'

export default function LimpiezaMensual(): JSX.Element {
    const { messageModal } = useAppContext();
    const [data, setData] = useState<LimpiezaMensualType[]>();
    const [numeroElementos, setNumeroElementos] = useState<number>(1)
    const [page, setPage] = useState<number>(1)
    const [showInfo, setShowInfo] = useState<boolean>(false)
    const [formulario, setFormulario] = useState<LimpiezaMensualType>()

    useEffect(() => {
        obtenerData()
        obtener_cantidad_elementos()
    }, [page]);

    const obtenerData = async (): Promise<void> => {
        try {
            const request = {
                action: "get_view_formularios_limpieza_mensual",
                page: page
            }
            const response = await window.api.server2(request)
            if (response.status !== 200)
                throw new Error(`Code ${response.status}: ${response.message}`)
            setData(response.data)
        } catch (err) {
            if (err instanceof Error) {
                messageModal("error", err.message)
            }
        }
    }
    const obtener_cantidad_elementos = async (): Promise<void> => {
        try {
            const request = { action: "get_calidad_formularios_limpiezaMensual_numeroElementos" }
            const response = await window.api.server2(request)
            if (response.status !== 200)
                throw new Error(`Code ${response.status}: ${response.message}`)
            setNumeroElementos(response.data)
        } catch (err) {
            if (err instanceof Error) {
                messageModal("error", err.message)
            }
        }
    }
    const show_info = (item:LimpiezaMensualType): void =>{
        setShowInfo(true)
        setFormulario(item)
    }
    const close_info = ():void => {
        setShowInfo(false)
    }
    return (
        <div className="componentContainer">
            <div className="navBar"></div>
            <h2>Limpieza Mensual</h2>
            <hr />

            {showInfo ?

                <InfoFormularioLimpiezaMensual close_info={close_info} data={formulario} />
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
