/* eslint-disable prettier/prettier */
import useAppContext from '@renderer/hooks/useAppContext'
import { useEffect, useState } from 'react'
import { requestHabilitarDescarte, requestHabilitarListaEmpaque, requestLotesVaciados } from './functions/request';
import { historialLotesType } from '@renderer/types/lotesType';
import "./css/habilitarPrediosProceso.css"

export default function HabilitarPrediosProceso(): JSX.Element {
    const { messageModal, statusProceso } = useAppContext();
    const [loteDescarte, setLoteDescarte] = useState<historialLotesType>();
    const [loteListaEmpaque, setLoteListaEmpaque] = useState<historialLotesType>();
    const [lotes, setLotes] = useState<historialLotesType[]>([])
    useEffect(() => {
        obtenerLotesVaciados()
        console.log("habilitarPredios", statusProceso)
    }, [])
    const obtenerLotesVaciados = async (): Promise<void> => {
        try {
            const response = await window.api.server2(requestLotesVaciados)
            if (response.status !== 200) {
                throw new Error(response.message);
            }
            console.log(response)
            const ids = response.data.map(item => item.documento._id);
            const idsSet = new Set(ids)
            const idsArr = [...idsSet]
            const data = idsArr.map(id => response.data.find(lote => lote.documento._id === id))
            setLotes(data)

        } catch (e) {
            if (e instanceof Error) {
                messageModal("error", e.message)
            }
        }
    }
    const handleHabilitarPredioDescarte = async (): Promise<void> => {
        try {
            const request = requestHabilitarDescarte(loteDescarte)
            const response = await window.api.server2(request);
            if (response.status !== 200) {
                throw new Error(response.message)
            }
            messageModal("success", "datos modificados con exito")
        } catch (e) {
            if (e instanceof Error) {
                messageModal("error", e.message);
            }
        }
    }
    const handleHabilitarPrediolistaEmpaque = async (): Promise<void> => {
        try {
            const request = requestHabilitarListaEmpaque(loteListaEmpaque)
            const response = await window.api.server2(request);
            if (response.status !== 200) {
                throw new Error(response.message)
            }
            messageModal("success", "datos modificados con exito")
        } catch (e) {
            if (e instanceof Error) {
                messageModal("error", e.message);
            }
        }
    }
    return (
        <div className='componentContainer'>
            <div className='navBar'></div>
            <h2>Habilitar predios</h2>
            <div className='habilitar-predios-proceso-div-tipoProceso'>
                <h3>Proceso Descarte</h3>
                <select
                    className='defaultSelect'
                    onChange={(e): void => setLoteDescarte(lotes.find(item => item.documento._id === e.target.value))}>
                    <option value="">Lotes</option>
                    {lotes.map(item => (
                        <option key={item.documento._id} value={item.documento._id}>
                            {item.documento.enf + "--" + item.documento.predio?.PREDIO}
                        </option>
                    ))}
                </select>
                <div>
                    <button className='defaulButtonAgree' onClick={handleHabilitarPredioDescarte}>
                        Habilitar Predio
                    </button>
                </div>
            </div>
            <div className='habilitar-predios-proceso-div-tipoProceso'>
                <h3>Proceso Lista de empaque</h3>
                <select
                    className='defaultSelect'
                    onChange={(e): void => setLoteListaEmpaque(lotes.find(item => item.documento._id === e.target.value))}>
                    <option value="">Lotes</option>
                    {lotes.map(item => (
                        <option key={item.documento._id} value={item.documento._id}>
                            {item.documento.enf + "--" + item.documento.predio?.PREDIO}
                        </option>
                    ))}
                </select>
                <div>
                    <button className='defaulButtonAgree' onClick={handleHabilitarPrediolistaEmpaque}>
                        Habilitar Predio
                    </button>
                </div>
            </div>
        </div>
    )
}
