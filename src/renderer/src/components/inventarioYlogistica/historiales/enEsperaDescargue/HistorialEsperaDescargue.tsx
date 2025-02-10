/* eslint-disable prettier/prettier */

import { formatearFecha } from "@renderer/functions/fechas";
import useAppContext from "@renderer/hooks/useAppContext"
import { lotesType } from "@renderer/types/lotesType";
import { useEffect, useState } from "react";
import { PiNotePencilDuotone } from "react-icons/pi";
import { GrLinkNext } from "react-icons/gr";
import { GrLinkPrevious } from "react-icons/gr";
import { IoSaveSharp } from "react-icons/io5";
import { GiCancel } from "react-icons/gi";

type dataType = {
    documento: lotesType,
    _id: string,
    __v:number
}

type RequestType = {
    action: string;
    _id:string;
    lote:string;
    __v:number;
    fecha_ingreso_patio?: string; 
    fecha_salida_patio?: string;  
};

const header = ["Predio", "Placa", "Tipo de fruta", "Descargue pendiente", "Descargue", ""]

export default function HistorialEsperaDescargue(): JSX.Element {
    const { messageModal } = useAppContext();
    const [data, setData] = useState<dataType[]>()
    const [numeroElementos, setNumeroElementos] = useState<number>()
    const [page, setPage] = useState<number>(1)
    const [modificando, setModificando] = useState<boolean>(false)
    const [itemSeleccionado, setItemSeleccionado] = useState<dataType>()
    const [fechaIngreso, setFechaIngreso] = useState<string>()
    const [fechaSalida, setFechaSalida] = useState<string>()

    const obtenerNumeroDatos = async (): Promise<void> => {
        try {
            const request = {
                action: "obtener_cantidad_historial_espera_descargue"
            }
            const response = await window.api.server2(request)
            if (response.status !== 200) {
                throw new Error(`Code ${response.status}: ${response.message}`)
            }
            setNumeroElementos(response.data)
        } catch (err) {
            if (err instanceof Error) {
                messageModal("error", err.message)
            }
        }
    }
    const obtenerData = async (): Promise<void> => {
        try {
            const query = {
                action: "get_record_lote_recepcion_pendiente",
                page: page
            }
            const response = await window.api.server2(query);
            if (response.status !== 200)
                throw new Error(`Code ${response.status}: ${response.message}`)
            setData(response.data)
        } catch (err) {
            if (err instanceof Error) {
                messageModal("error", err.message);
            }
        }
    }
    useEffect(() => {
        obtenerData()
        obtenerNumeroDatos()
    }, [])
    const handleModificar = (id): void => {
        setItemSeleccionado(id)
        setModificando(!modificando)
    }
    const handleGuardarCambios = async ():Promise<void> => {
        try {
            if(!itemSeleccionado) throw new Error("No se selecciono ningun registro")
            const request: RequestType ={
                action:"modificar_historial_fechas_en_patio",
                _id: itemSeleccionado._id,
                lote: itemSeleccionado.documento._id,
                __v: itemSeleccionado.__v
            }
            if(fechaIngreso){
                request.fecha_ingreso_patio = fechaIngreso
            }
            if(fechaSalida){
                request.fecha_salida_patio = fechaSalida
            }
            const response = await window.api.server2(request)
            if(response.status !== 200)
                throw new Error(`Code ${response.status}: ${response.message}`)
            messageModal("success", "Dato modificado con exito")
            setModificando(false)
            setItemSeleccionado(undefined)
            obtenerData()
        } catch(err){
            if(err instanceof Error){
                messageModal("error", err.message)
            }
        }
    }
    if (!data) {
        return (
            <div>Cargando datos...</div>
        )
    }
    return (
        <div className="componentContainer">
            <div className="navBar"></div>
            <h2>Historial Lotes en espera de descargue</h2>
            <hr />
            <table className="table-main">
                <thead>
                    <tr>
                        {header.map(item => (
                            <th key={item}>{item}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {
                        data.map((item, index) => (
                            <tr key={item._id} className={`${index % 2 === 0 ? 'fondo-par' : 'fondo-impar'}`}>
                                <td>{item.documento.predio.PREDIO}</td>
                                <td>{item.documento.placa}</td>
                                <td>{item.documento.tipoFruta}</td>

                                {itemSeleccionado && (itemSeleccionado._id === item._id) && modificando ?
                                    <td>
                                        {formatearFecha(item.documento.fecha_ingreso_patio, true) && <input
                                            type="datetime-local"
                                            onChange={(e): void => setFechaIngreso(e.target.value)} />}
                                    </td>
                                    :
                                    <td>{formatearFecha(item.documento.fecha_ingreso_patio, true)}</td>
                                }
                                {itemSeleccionado && (itemSeleccionado ._id=== item._id) && modificando ?
                                    <td>
                                        {formatearFecha(item.documento.fecha_salida_patio, true) && <input
                                            type="datetime-local"
                                            onChange={(e): void => setFechaSalida(e.target.value)} />}
                                    </td>
                                    :
                                    <td>{formatearFecha(item.documento.fecha_salida_patio, true)}</td>
                                }
                                <td>
                                    {((itemSeleccionado ? itemSeleccionado._id : '') !== item._id) &&
                                        <button
                                            style={{ color: "blue" }}
                                            onClick={(): void => handleModificar(item)} >
                                            <PiNotePencilDuotone />
                                        </button>}

                                    {((itemSeleccionado ? itemSeleccionado._id : '')  === item._id) && modificando &&
                                        <button style={{ color: 'green' }} onClick={handleGuardarCambios}>
                                            <IoSaveSharp />
                                        </button>}
                                    {((itemSeleccionado ? itemSeleccionado._id : '' ) === item._id) && modificando &&
                                        <button style={{ color: 'red' }} onClick={(): void => {
                                            setModificando(false)
                                            setItemSeleccionado(undefined)
                                        }}>
                                            <GiCancel />
                                        </button>}
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
            <div className="informesCalidad-div-button">
                <button onClick={(): void => setPage(page)}>
                    <GrLinkPrevious />
                </button>
                {page}
                {numeroElementos && Math.floor(numeroElementos / (30 * page)) === 0 ?
                    <button >
                        <GrLinkNext />
                    </button>
                    :
                    <button onClick={(): void => setPage(page + 1)}>
                        <GrLinkNext />
                    </button>}
            </div>
        </div>
    )
}
