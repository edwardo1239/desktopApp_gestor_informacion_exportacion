/* eslint-disable prettier/prettier */

import { formatearFecha } from "@renderer/functions/fechas";
import useAppContext from "@renderer/hooks/useAppContext"
import { lotesType } from "@renderer/types/lotesType";
import { useEffect, useState } from "react";
import { GrLinkNext } from "react-icons/gr";
import { GrLinkPrevious } from "react-icons/gr";
import { IoSaveSharp } from "react-icons/io5";
import { GiCancel } from "react-icons/gi";
import { PiNotePencilDuotone } from "react-icons/pi";

type dataType = {
    documento: lotesType,
    _id: string,
    __v: number
}

type RequestType = {
    action: string;
    _id: string;
    lote: string;
    __v: number;
    query: formStateType | undefined

};

const headers = [
    "EF1",
    "Predio",
    "Tipo de fruta",
    "canastillas",
    "kilos",
    "# precintos",
    "Fecha ingreso",
    "Observaciones",
    ""
]

type formStateType = {
    enf?: string;
    canastillas?: string
    kilos?: string
    numeroPrecintos?: string
    fecha_ingreso_inventario?: string
    observaciones?: string
}

export default function HistorialEnInventarioFrutaSinProcesar(): JSX.Element {
    const { messageModal } = useAppContext();
    const [data, setData] = useState<dataType[]>()
    const [numeroElementos, setNumeroElementos] = useState<number>()
    const [page, setPage] = useState<number>(1)
    const [modificando, setModificando] = useState<boolean>(false)
    const [itemSeleccionado, setItemSeleccionado] = useState<dataType>()

    //datos modificar
    const [formState, setFormState] = useState<formStateType>()

    const obtenerNumeroElementos = async (): Promise<void> => {
        try {
            const request = {
                action: "obtener_cantidad_historial_ingreso_inventario"
            }
            const response = await window.api.server2(request);
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
            const query = {
                action: "get_record_lote_ingreso_inventario",
                page: page
            }
            const response = await window.api.server2(query);
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
    useEffect(() => {
        obtenerNumeroElementos()
        obtenerData()
    }, [])
    const handleModificar = (id): void => {
        setItemSeleccionado(id)
        setModificando(!modificando)
    }
    const handleChange = (event): void => {
        const { name, value } = event.target;
        setFormState((prev) => {
            if (!prev) {
                return { [name]: value }
            } else {
                return { ...prev, [name]: value }
            }
        });
    };
    const handleGuardarCambios = async (): Promise<void> => {
        try {
            if (!itemSeleccionado) throw new Error("No se selecciono ningun registro")
            const request: RequestType = {
                action: "modificar_historial_lote_ingreso_inventario",
                _id: itemSeleccionado._id,
                lote: itemSeleccionado.documento._id,
                __v: itemSeleccionado.__v,
                query: formState
            }


            const response = await window.api.server2(request)
            if (response.status !== 200)
                throw new Error(`Code ${response.status}: ${response.message}`)
            messageModal("success", "Dato modificado con exito")
            setModificando(false)
            setItemSeleccionado(undefined)
            obtenerData()
        } catch (err) {
            if (err instanceof Error) {
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
            <h2>Registros ingreso lotes al inventario</h2>
            <hr />
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

                            {/* //vizualizar modificar enf */}
                            {itemSeleccionado && (itemSeleccionado._id === item._id) && modificando ?
                                <td>
                                    <input
                                        name="enf"
                                        type="text"
                                        value={(formState && formState.enf) ? formState?.enf : item.documento.enf}
                                        onChange={handleChange} />
                                </td>
                                :
                                <td>{item.documento.enf}</td>
                            }
                            <td>{item.documento.predio.PREDIO}</td>
                            <td>{item.documento.tipoFruta}</td>

                            {/* //vizualizar modificar numero canastilla */}
                            {itemSeleccionado && (itemSeleccionado._id === item._id) && modificando ?
                                <td>
                                    <input
                                        name="canastillas"
                                        type="text"
                                        value={(formState && formState.canastillas) ?
                                            formState?.canastillas : item.documento.canastillas}
                                        onChange={handleChange} />
                                </td>
                                :
                                <td>{item.documento.canastillas}</td>
                            }

                            {/* //vizualizar modificar numero kilos */}
                            {itemSeleccionado && (itemSeleccionado._id === item._id) && modificando ?
                                <td>
                                    <input
                                        name="kilos"
                                        type="text"
                                        value={(formState && formState.kilos) ?
                                            formState?.kilos : item.documento.kilos}
                                        onChange={handleChange} />
                                </td>
                                :
                                <td>{item.documento.kilos}</td>
                            }

                            {/* //vizualizar modificar numero numero precintos */}
                            {itemSeleccionado && (itemSeleccionado._id === item._id) && modificando ?
                                <td>
                                    <input
                                        name="numeroPrecintos"
                                        type="text"
                                        value={(formState && formState.numeroPrecintos) ?
                                            formState?.numeroPrecintos : item.documento.numeroPrecintos}
                                        onChange={handleChange} />
                                </td>
                                :
                                <td>{item.documento.numeroPrecintos}</td>
                            }

                            {/* //vizualizar modificar fecha */}
                            {itemSeleccionado && (itemSeleccionado._id === item._id) && modificando ?
                                <td>
                                    {formatearFecha(item.documento.fecha_salida_patio, true) && <input
                                        type="datetime-local"
                                        name="fecha_salida_patio"
                                        onChange={handleChange} />}
                                </td>
                                :
                                <td>{formatearFecha(item.documento.fecha_ingreso_inventario, true)}</td>
                            }
                            
                            {/* //vizualizar modificar numero observaciones */}
                            {itemSeleccionado && (itemSeleccionado._id === item._id) && modificando ?
                                <td>
                                    <input
                                        name="observaciones"
                                        type="text"
                                        value={(formState && formState.observaciones) ?
                                            formState?.observaciones : item.documento.observaciones}
                                        onChange={handleChange} />
                                </td>
                                :
                                <td>{item.documento.observaciones}</td>
                            }
                            <td>
                                {((itemSeleccionado ? itemSeleccionado._id : '') !== item._id) &&
                                    <button
                                        style={{ color: "blue" }}
                                        onClick={(): void => handleModificar(item)} >
                                        <PiNotePencilDuotone />
                                    </button>}

                                {((itemSeleccionado ? itemSeleccionado._id : '') === item._id) && modificando &&
                                    <button style={{ color: 'green' }} onClick={handleGuardarCambios}>
                                        <IoSaveSharp />
                                    </button>}
                                {((itemSeleccionado ? itemSeleccionado._id : '') === item._id) && modificando &&
                                    <button style={{ color: 'red' }} onClick={(): void => {
                                        setModificando(false)
                                        setItemSeleccionado(undefined)
                                        setFormState(undefined)
                                    }}>
                                        <GiCancel />
                                    </button>}
                            </td>
                        </tr>
                    ))}
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