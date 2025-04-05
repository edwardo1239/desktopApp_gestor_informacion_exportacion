/* eslint-disable prettier/prettier */
import useAppContext from "@renderer/hooks/useAppContext";
import { useEffect, useState } from "react"
import InfoFormularioControlPlagas from "./components/InfoFormularioControlPlagas";
import TablaControlPlagas from "./components/TablaControlPlagas.";
import { ControlPlagasFormularioType } from "@renderer/types/control_plagas";
import BotonesPasarPaginas from "@renderer/components/UI/BotonesPasarPaginas";
import './styles.css'

export default function ControlPlagas(): JSX.Element {
    const { messageModal } = useAppContext();
    const [data, setData] = useState<ControlPlagasFormularioType[]>();
    const [numeroElementos, setNumeroElementos] = useState<number>(1)
    const [page, setPage] = useState<number>(1)
    const [showInfo, setShowInfo] = useState<boolean>(false)
    const [formulario, setFormulario] = useState<ControlPlagasFormularioType>()

    useEffect(() => {
        obtenerData()
        obtener_cantidad_elementos()
    }, [page]);

    const obtenerData = async (): Promise<void> => {
        try {
            const request = {
                action: "get_calidad_formulario_controlPlagas",
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
            const request = { action: "get_calidad_formulario_controlPlagas_numeroElementos" }
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
    const show_info = (item:ControlPlagasFormularioType): void =>{
        setShowInfo(true)
        setFormulario(item)
    }
    const close_info = ():void => {
        setShowInfo(false)
    }
    return (
        <div className="componentContainer">
            <div className="navBar"></div>
            <h2>Control de plagas</h2>
            <hr />

            {showInfo ?

                <InfoFormularioControlPlagas close_info={close_info} data={formulario} />
                :
                <>
                    <TablaControlPlagas show_info={show_info} data={data} />
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
