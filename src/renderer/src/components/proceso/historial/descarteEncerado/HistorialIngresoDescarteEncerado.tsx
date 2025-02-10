/* eslint-disable prettier/prettier */

import useAppContext from "@renderer/hooks/useAppContext"
import { recordLotesType } from "@renderer/types/recorLotesType"
import { useEffect, useState } from "react"
import Tabla from "./components/TablaEnceradoHistorial";

export default function HistorialIngresoDescarteEncerado(): JSX.Element {
    const { messageModal } = useAppContext();
    const [data, setData] = useState<recordLotesType[]>([])


    useEffect(() => {
        obtenerData()
    }, [])
    const obtenerData = async (): Promise<void> => {
        try {
            const request = {
                action: "obtener_historial_decarte_encerado_proceso",
            }
            const response = await window.api.server2(request);
            if (response.status !== 200)
                throw new Error(`Code ${response.status}: ${response.message}`);
            setData(response.data);
            console.log(response)
        } catch (err) {
            if (err instanceof Error) {
                messageModal("error", err.message)
            }
        }
    }
    return (
        <div className="componentContainer">
            <div className="navBar"></div>
            <h2>Historial ingreso descarte encerado</h2>
            <hr />
            <Tabla data={data} />

        </div>
    )
}
