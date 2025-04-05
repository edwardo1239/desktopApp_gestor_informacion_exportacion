/* eslint-disable prettier/prettier */
import useAppContext from '@renderer/hooks/useAppContext'
import './css/styles.css'
import RelogProceso from './components/RelogProceso';
import { useEffect, useState } from 'react';

export default function PanelControlProceso(): JSX.Element {
    const { messageModal, statusProceso } = useAppContext();
    const [horaInicio, setHorainicio] = useState<string>('');
    const [cronometro, setCronometro] = useState<number>(0)
    const [cronometroTrabajo, setCronometroTrabajo] = useState<number>(0)
    const [cronometroPausa, setCronometroPausa] = useState<number>(0)

    useEffect(() => {
        obtenerHoraInicio()
        const timer = setInterval(() => {
            setCronometro(prev => prev + 1);
            if (statusProceso !== 'pause') {
                setCronometroTrabajo(prev => prev + 1);
            } else if (statusProceso === 'pause') {
                setCronometroPausa(prev => prev + 1);
            }
        }, 1000);
        return () => {
            clearInterval(timer);
        }
    }, [statusProceso]);
    const obtenerHoraInicio = async (): Promise<void> => {
        try {
            const request = { action: 'get_sistema_proceso_inicioHoraProceso' }
            const response = await window.api.server2(request);
            if (response.status !== 200)
                throw new Error(`Code ${response.status}: ${response.message}`)

            const fechaInicio = new Date(response.data.fechaInicio)
            const diferencia = Math.floor((new Date().getTime() - fechaInicio.getTime()) / 1000);

            const tiempotrabajado = Number(response.data.tiempoTrabajado)
            const diferenciaT = tiempotrabajado;

            const tiempopausado = Number(response.data.tiempoPausaHoy)
            const diferenciaP = tiempopausado

            setHorainicio(new Date(response.data.fechaInicio).toLocaleDateString('es-Co', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                second: 'numeric',
                hour12: true // Para formato de 12 horas con AM/PM
            }))
            setCronometroTrabajo(diferenciaT)
            setCronometro(diferencia)
            setCronometroPausa(diferenciaP)

        } catch (err) {
            if (err instanceof Error) {
                messageModal("error", err.message)
            }
        }
    }
    const iniciarProceso = async (): Promise<void> => {
        try {
            const request = { action: "put_sistema_proceso_inicioHoraProceso" };
            const response = await window.api.server2(request)
            if (response.status !== 200)
                throw new Error(`Code ${response.status}: ${response.message}`);

            messageModal("success", "Se inició el proceso")
            await obtenerHoraInicio()

        } catch (err) {
            if (err instanceof Error) {
                messageModal("error", err.message);
            }
        }
    }
    const finalizarProceso = async (): Promise<void> => {
        try {
            const request = { action: "put_sistema_proceso_finalizarProceso" };
            const response = await window.api.server2(request)
            if (response.status !== 200)
                throw new Error(`Code ${response.status}: ${response.message}`);
            messageModal("success", "Se finalizó el proceso")
            await obtenerHoraInicio()
        } catch (err) {
            if (err instanceof Error) {
                messageModal("error", err.message);
            }
        }
    }
    const pausarProceso = async (): Promise<void> => {
        try {
            const request = { action: "put_sistema_proceso_pausaProceso" };
            const response = await window.api.server2(request)
            if (response.status !== 200)
                throw new Error(`Code ${response.status}: ${response.message}`);
            messageModal("success", "Se pausó el proceso")
        } catch (err) {
            if (err instanceof Error) {
                messageModal("error", err.message);
            }
        }
    }
    const reanudarProceso = async (): Promise<void> => {
        try {
            const request = { action: "put_sistema_proceso_reanudarProceso" };
            const response = await window.api.server2(request)
            if (response.status !== 200)
                throw new Error(`Code ${response.status}: ${response.message}`);
        } catch (err) {
            if (err instanceof Error) {
                messageModal("error", err.message);
            }
        }
    }

    return (
        <div className="componentContainer">
            <div className="navBar"></div>
            <h2>Panel de control proceso</h2>
            <hr />
            <div className='acciones-proceso-div'>
                <h3>Proceso:</h3>
                <button></button>
                <div className='acciones-proceso-div2'>
                    {statusProceso === "off" && <button className='defaulButtonAgree' onClick={iniciarProceso} >
                        Iniciar
                    </button>}
                    {statusProceso === 'pause' ?
                        <button className='defaulButtonWarning' onClick={reanudarProceso} >
                            Reanudar
                        </button>
                        :
                        <button className='defaulButtonWarning' onClick={pausarProceso} >
                            Pausar
                        </button>
                    }
                    <button className='defaulButtonError' onClick={finalizarProceso} >
                        Fin del turno
                    </button>
                </div>
            </div>
            <div>
                <RelogProceso
                    cronometroPausa={cronometroPausa}
                    cronometroTrabajo={cronometroTrabajo}
                    horaInicio={horaInicio}
                    cronometro={cronometro} />
            </div>

        </div>
    )
}
