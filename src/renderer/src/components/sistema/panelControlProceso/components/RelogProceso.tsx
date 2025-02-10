/* eslint-disable prettier/prettier */
import '../css/styles_horas.css'
import useAppContext from "@renderer/hooks/useAppContext";
import { formatTime } from "../utils/timeFunctions";
import { useEffect, useState } from 'react';
import { datosPredioType } from '@renderer/types/lotesType';

type propsType = {
    horaInicio: string
    cronometro: number
    cronometroTrabajo: number
    cronometroPausa: number
}
export default function RelogProceso(props: propsType): JSX.Element {
    const { statusProceso, messageModal } = useAppContext();
    const [kilosProcesadosLimon, setKilosProcesadosLimon] = useState<string>('')
    const [kilosProcesadosNaranja, setKilosProcesadosNaranja] = useState<string>('')
    const [kilosExportadosLimon, setKilosExportadosLimon] = useState<string>('')
    const [kilosExportadosNaranja, setKilosExportadosNaranja] = useState<string>('')
    const [predio, setPredio] = useState<datosPredioType>()
    

    useEffect(() => {
        console.log(statusProceso)
        obtenerDataProceso();
    }, [])
    const obtenerDataProceso = async (): Promise<void> => {
        try {
            const request = { action: "get_data_proceso" };
            const response = await window.api.server2(request)
            if (response.status !== 200)
                throw new Error(`Code ${response.status}: ${response.message}`);
            console.log(response)
            setKilosProcesadosLimon(response.data.kilosProcesadosHoy.kilosProcesadosLimon)
            setKilosProcesadosNaranja(response.data.kilosProcesadosHoy.kilosProcesadosNaranja)
            setKilosExportadosLimon(response.data.kilosExportacionHoy.kilosExportacionLimon)
            setKilosExportadosNaranja(response.data.kilosExportacionHoy.kilosExportacionNaranja)
            setPredio(response.data.predio)
        } catch (err) {
            if (err instanceof Error) {
                messageModal("error", err.message);
            }
        }
    }
    return (
        <div className="panelcontrol-relog-proceso-horas-container">
            <div className="panelcontrol-relog-proceso-horas-section">
                <h3>{predio?.nombrePredio}</h3>
                <p>{predio?.enf}</p>
            </div>
            <div className="panelcontrol-relog-proceso-horas-section">
                <h3>Hora Inicio</h3>
                <p>{statusProceso !== 'off' ?
                    props.horaInicio : '--/--/--'}</p>
            </div>
            <div className="panelcontrol-relog-proceso-horas-section">
                <h3>Tiempo transcurrido</h3>
                <p>{statusProceso !== 'off' ? formatTime(props.cronometro) : '--/--/--'}</p>
            </div>
            <div className="panelcontrol-relog-proceso-horas-section">
                <h3>Tiempo trabajado</h3>
                <p>{statusProceso !== 'off' ? formatTime(props.cronometroTrabajo) : '--/--/--'}</p>
            </div>
            <div className="panelcontrol-relog-proceso-horas-section">
                <h3>Tiempo pausa</h3>
                <p>{statusProceso !== 'off' ? formatTime(props.cronometroPausa) : '--/--/--'}</p>
            </div>
            <div className="panelcontrol-relog-proceso-horas-section">
                <h3>Kilos procesados limon</h3>
                <p>{kilosProcesadosLimon} Kg</p>
            </div>
            <div className="panelcontrol-relog-proceso-horas-section">
                <h3>Kilos proceso naranja</h3>
                <p>{kilosProcesadosNaranja} Kg</p>
            </div>
            <div className="panelcontrol-relog-proceso-horas-section">
                <h3>Kilos exportación limon</h3>
                <p>{kilosExportadosLimon} Kg</p>
            </div>
            <div className="panelcontrol-relog-proceso-horas-section">
                <h3>Kilos exportación naranja</h3>
                <p>{kilosExportadosNaranja} Kg</p>
            </div>
        </div>
    )
}