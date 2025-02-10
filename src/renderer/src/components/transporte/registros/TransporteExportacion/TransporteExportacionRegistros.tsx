/* eslint-disable prettier/prettier */

import BotonesPasarPaginas from "@renderer/components/UI/BotonesPasarPaginas";
import { formatearFecha } from "@renderer/functions/fechas";
import useAppContext from "@renderer/hooks/useAppContext"
import { contenedoresType } from "@renderer/types/contenedoresType";
import { useEffect, useState } from "react";
import { IoSaveSharp } from "react-icons/io5";
import { GiCancel } from "react-icons/gi";
import { PiNotePencilDuotone } from "react-icons/pi";

const headers = [
    "Contenedor",
    "Cliente",
    "Agencia",
    "Naviera",
    "Puerto",
    "Expt",
    "Fecha",
    ""
]

type formStateType = {
    puerto?: string
    naviera?: string
    agencia?: string
    expt?: string
}

export default function TransporteExportacionRegistros(): JSX.Element {
    const { messageModal } = useAppContext();

    const [data, setData] = useState<contenedoresType[]>()
    const [itemSeleccionado, setItemSeleccionado] = useState<contenedoresType>()
    const [formState, setFormState] = useState<formStateType>()
    //page navigator
    const [page, setPage] = useState<number>(1);
    const [numeroElementos, setNumeroElementos] = useState<number>()
    const [modificando, setModificando] = useState<boolean>(false)

    const obtenerNumeroElementos = async (): Promise<void> => {
        try {
            const query = {
                action: "get_transporte_registros_exportacion_numeroElementos"
            }
            const response = await window.api.server2(query);
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
            const request = {
                action: "get_transporte_registro_exportacion",
                page: page
            }
            const response = await window.api.server2(request);
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
    }, [])
    useEffect(() => {
        obtenerData()
    }, [page])

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
    const modificarData = async (): Promise<void> => {
        try {
            const query = {}
            if (formState) {
                Object.entries(formState).forEach(([key, value]) => {
                    query[`infoExportacion.${key}`] = value
                })
            }
            const request = {
                action: "post_transporte_programacion_exportacion_modificar",
                _id: itemSeleccionado?._id,
                data: query
            }
            const response = await window.api.server2(request);
            if (response.status !== 200)
                throw new Error(`Code ${response.status}: ${response.message}`)
            messageModal("success", "Dato guardado con exito!")
            setFormState(undefined)
            obtenerData()
            setModificando(false)
        } catch (err) {
            if (err instanceof Error) {
                messageModal("error", err.message)
            }
        }
    }

    if (!data) {
        return (
            <div className="componentContainer">
                <div className="navBar"></div>
                <h2>Cargando...</h2>
            </div>
        )
    }
    return (
        <div className="componentContainer">
            <div className="navBar"></div>
            <h2>Registros transporte exportación</h2>
            <hr />
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
                    {data.map((cont, index) => (
                        <tr key={cont._id} className={`${index % 2 === 0 ? 'fondo-par' : 'fondo-impar'}`}>
                            <td>{cont.numeroContenedor}</td>
                            <td>{typeof cont.infoContenedor.clienteInfo === 'object' &&
                                cont.infoContenedor.clienteInfo.CLIENTE
                            }</td>

                            {itemSeleccionado && (itemSeleccionado._id === cont._id) && modificando ?
                                <td>
                                    <input
                                        name="agencia"
                                        type="text"
                                        value={(formState && formState.agencia) ?
                                            formState?.agencia : cont.infoExportacion?.agencia}
                                        onChange={handleChange} />
                                </td>
                                :
                                <td>{cont.infoExportacion?.agencia || 'N/A'}</td>
                            }

                            {itemSeleccionado && (itemSeleccionado._id === cont._id) && modificando ?
                                <td>
                                    <input
                                        name="naviera"
                                        type="text"
                                        value={(formState && formState.naviera) ?
                                            formState?.naviera : cont.infoExportacion?.naviera}
                                        onChange={handleChange} />
                                </td>
                                :
                                <td>{cont.infoExportacion?.naviera || 'N/A'}</td>
                            }


                            {itemSeleccionado && (itemSeleccionado._id === cont._id) && modificando ?
                                <td>
                                    <input
                                        name="puerto"
                                        type="text"
                                        value={(formState && formState.puerto) ?
                                            formState?.puerto : cont.infoExportacion?.puerto}
                                        onChange={handleChange} />
                                </td>
                                :
                                <td>{cont.infoExportacion?.puerto || 'N/A'}</td>
                            }

                            {itemSeleccionado && (itemSeleccionado._id === cont._id) && modificando ?
                                <td>
                                    <input
                                        name="expt"
                                        type="text"
                                        value={(formState && formState.expt) ?
                                            formState?.expt : cont.infoExportacion?.expt}
                                        onChange={handleChange} />
                                </td>
                                :
                                <td>{cont.infoExportacion?.expt || 'N/A'}</td>
                            }
                            <td>{cont.infoExportacion?.fecha && formatearFecha(cont.infoExportacion?.fecha)}</td>
                            <td>
                                {((itemSeleccionado ? itemSeleccionado._id : '') !== cont._id) &&
                                    <button
                                        style={{ color: "blue" }}
                                        onClick={(): void => handleModificar(cont)}
                                    >
                                        <PiNotePencilDuotone />
                                    </button>}

                                {((itemSeleccionado ? itemSeleccionado._id : '') === cont._id) && modificando &&
                                    <button style={{ color: 'green' }} onClick={modificarData} >
                                        <IoSaveSharp />
                                    </button>}
                                {((itemSeleccionado ? itemSeleccionado._id : '') === cont._id) && modificando &&
                                    <button style={{ color: 'red' }} onClick={(): void => {
                                        setItemSeleccionado(undefined)
                                        setModificando(false)

                                    }}>
                                        <GiCancel />
                                    </button>}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            </div>

            <BotonesPasarPaginas
                division={50}
                page={page}
                numeroElementos={numeroElementos}
                setPage={setPage} />
        </div>
    )
}