/* eslint-disable prettier/prettier */

import { useEffect, useState } from "react"
import { higienePersonalType } from "./types/higienePersonal"
import useAppContext from "@renderer/hooks/useAppContext"
import "./css/styles.css"
import { format } from "date-fns";
import { FcOk } from 'react-icons/fc'
import { FcCancel } from 'react-icons/fc'
import { KEYS_ELEMENTOS } from "./functions/filtroHigienePersonal";

import FiltrosHigienePersonal from "./components/FiltrosHigienePersonal";
import { es } from 'date-fns/locale';


export default function HigienePersonal(): JSX.Element {
    const { messageModal } = useAppContext();
    const headers = ["Responsable", "Operario", "Elementos", "Fecha"]
    const [data, setData] = useState<higienePersonalType[]>([])
    const [dataOriginal, setDataOriginal] = useState<higienePersonalType[]>([])
    const [filtroResponsable, setFiltroResponsable] = useState<string>('')
    const [fechaInicio, setFechaInicio] = useState<string>('')
    const [fechaFin, setFechaFin] = useState<string>('')
    useEffect(() => {
        obtenerData()
    }, [])
    useEffect(() => {
        if (filtroResponsable === '')
            setData(dataOriginal)
        else {
            const filterData: higienePersonalType[] = dataOriginal.filter(item => item.responsable.nombre.toLowerCase().startsWith(filtroResponsable.toLowerCase()))
            setData(filterData)
        }
    }, [filtroResponsable])
    const obtenerData = async (): Promise<void> => {
        try {
            const request = {
                action: 'get_calidad_formulario_higienePersonal',
                fechaInicio: fechaInicio,
                fechaFin: fechaFin,
            }
            const response = await window.api.server2(request)
            if (response.status !== 200)
                throw new Error(response.message)
            setData(response.data)
            setDataOriginal(response.data)
        } catch (e) {
            if (e instanceof Error)
                messageModal("error", e.message)
        }
    }
    const buscar = (): void => {
        obtenerData();
    }
    return (
        <div className='componentContainer'>
            <div className="navBar"></div>
            <h2>Higiene personal</h2>
            <FiltrosHigienePersonal
                buscar={buscar}
                setFechaInicio={setFechaInicio}
                setFechaFin={setFechaFin}
                setFiltroResponsable={setFiltroResponsable} />
            <div className="table-container">
                <table className="table-main">
                    <thead>
                        <tr>
                            {headers.map(item => (
                                <th key={item}>{item}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item, index) => (
                            <tr key={item._id} className={`${index % 2 === 0 ? 'fondo-par' : 'fondo-impar'}`}>
                                <td>{item.responsable.nombre}</td>
                                <td>{item.operario.nombre + " " + item.operario.apellido}</td>
                                <td colSpan={2} className="higiene-personal-elementos-container">
                                    {Object.keys(item).map(elemento => {
                                        if (elemento !== '_id' &&
                                            elemento !== 'responsable' &&
                                            elemento !== 'nombre' &&
                                            elemento !== 'operario' &&
                                            elemento !== '__v' &&
                                            elemento !== 'fecha' &&
                                            elemento !== 'apellido') {
                                            return (
                                                <div className="higiene-personal-elementos-div" key={item._id + elemento}>
                                                    {KEYS_ELEMENTOS[elemento]}
                                                    {item[elemento] ? <FcOk /> : <FcCancel />}
                                                </div>
                                            )
                                        } else {
                                            return null
                                        }
                                    })}
                                </td>
                                <td>
                                    {format(new Date(item.fecha), 'dd/MM/yyyy HH:mm', { locale: es })}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

        </div>
    )
}
