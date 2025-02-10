/* eslint-disable prettier/prettier */

import BotonesPasarPaginas from "@renderer/components/UI/BotonesPasarPaginas";
import { formatearFecha } from "@renderer/functions/fechas";
import useAppContext from "@renderer/hooks/useAppContext";
import { contenedoresType } from "@renderer/types/contenedoresType";
import { useEffect, useState } from "react";
import { IoSaveSharp } from "react-icons/io5";
import { GiCancel } from "react-icons/gi";
import { PiNotePencilDuotone } from "react-icons/pi";

type formStateType = {
    transportadora?: string
    nit?: string,
    placa?: string,
    trailer?: string,
    conductor?: string,
    cedula?: string,
    celular?: string,
    temperatura?: string,
    precinto?: string,
    marca?: string,
    datalogger_id?: string,
    flete?: string,
    fecha?: string,
}

const headers = [
    "Contenedor",
    "Cliente",
    "Conductor",
    "Cedula",
    "Celular",
    "Flete",
    "Marca",
    "Datalogger ID",
    "Fecha",
    "Placa",
    "Precinto",
    "Temperatura",
    "Trailer",
    "Transportadora",
    "NIT",
    ""
];

export default function TransporteProgramacionMulaRegistros(): JSX.Element {
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
                action: "get_transporte_registros_programacion_mula_numeroElementos"
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
                action: "get_transporte_registro_programacion_mula",
                page: page
            }
            const response = await window.api.server2(request);
            if (response.status !== 200)
                throw new Error(`Code ${response.status}: ${response.message}`)
            setData(response.data)
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
                    query[`infoTractoMula.${key}`] = value
                })
            }
            const request = {
                action: "post_transporte_programacion_mula_modificar",
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
            <h2>Registros programación tracto mula</h2>
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
                                        name="conductor"
                                        type="text"
                                        value={formState?.conductor ?? cont.infoTractoMula?.conductor}
                                        onChange={handleChange} />
                                </td>
                                :
                                <td>{cont.infoTractoMula?.conductor || 'N/A'}</td>
                            }

                            {itemSeleccionado && (itemSeleccionado._id === cont._id) && modificando ?
                                <td>
                                    <input
                                        name="cedula"
                                        type="text"
                                        value={formState?.cedula ?? cont.infoTractoMula?.cedula}
                                        onChange={handleChange} />
                                </td>
                                :
                                <td>{cont.infoTractoMula?.cedula || 'N/A'}</td>
                            }

                            {itemSeleccionado && (itemSeleccionado._id === cont._id) && modificando ?
                                <td>
                                    <input
                                        name="celular"
                                        type="text"
                                        value={formState?.celular ?? cont.infoTractoMula?.celular}
                                        onChange={handleChange} />
                                </td>
                                :
                                <td>{cont.infoTractoMula?.celular || 'N/A'}</td>
                            }

                            {itemSeleccionado && (itemSeleccionado._id === cont._id) && modificando ? (
                                <td>
                                    <input
                                        name="flete"
                                        type="text"
                                        value={formState?.flete ?? cont.infoTractoMula?.flete}
                                        onChange={handleChange}
                                    />
                                </td>
                            ) : (
                                <td>
                                    {cont.infoTractoMula?.flete && !isNaN(cont.infoTractoMula.flete) ? (
                                        new Intl.NumberFormat('es-CO', {
                                            style: 'currency',
                                            currency: 'COP',
                                        }).format(cont.infoTractoMula.flete)
                                    ) : (
                                        'N/A'
                                    )}
                                </td>
                            )}

                            {itemSeleccionado && (itemSeleccionado._id === cont._id) && modificando ?
                                <td>
                                    <input
                                        name="marca"
                                        type="text"
                                        value={formState?.marca ?? cont.infoTractoMula?.marca}
                                        onChange={handleChange} />
                                </td>
                                :
                                <td>{cont.infoTractoMula?.marca || 'N/A'}</td>
                            }

                            {itemSeleccionado && (itemSeleccionado._id === cont._id) && modificando ?
                                <td>
                                    <input
                                        name="datalogger_id"
                                        type="text"
                                        value={formState?.datalogger_id ?? cont.infoTractoMula?.datalogger_id}
                                        onChange={handleChange} />
                                </td>
                                :
                                <td>{cont.infoTractoMula?.datalogger_id || 'N/A'}</td>
                            }

                            <td>{cont.infoTractoMula?.fecha && formatearFecha(cont.infoTractoMula?.fecha)}</td>


                            {itemSeleccionado && (itemSeleccionado._id === cont._id) && modificando ?
                                <td>
                                    <input
                                        name="placa"
                                        type="text"
                                        value={formState?.placa ?? cont.infoTractoMula?.placa}
                                        onChange={handleChange} />
                                </td>
                                :
                                <td>{cont.infoTractoMula?.placa || 'N/A'}</td>
                            }

                            {itemSeleccionado && (itemSeleccionado._id === cont._id) && modificando ?
                                <td>
                                    <input
                                        name="precinto"
                                        type="text"
                                        value={formState?.precinto ?? cont.infoTractoMula?.precinto}
                                        onChange={handleChange} />
                                </td>
                                :
                                <td>{cont.infoTractoMula?.precinto || 'N/A'}</td>
                            }

                            {itemSeleccionado && (itemSeleccionado._id === cont._id) && modificando ?
                                <td>
                                    <input
                                        name="temperatura"
                                        type="text"
                                        value={formState?.temperatura ?? cont.infoTractoMula?.temperatura}
                                        onChange={handleChange} />
                                </td>
                                :
                                <td>{cont.infoTractoMula?.temperatura || 'N/A'}</td>
                            }

                            {itemSeleccionado && (itemSeleccionado._id === cont._id) && modificando ?
                                <td>
                                    <input
                                        name="trailer"
                                        type="text"
                                        value={formState?.trailer ?? cont.infoTractoMula?.trailer}
                                        onChange={handleChange} />
                                </td>
                                :
                                <td>{cont.infoTractoMula?.trailer || 'N/A'}</td>
                            }

                            {itemSeleccionado && (itemSeleccionado._id === cont._id) && modificando ?
                                <td>
                                    <input
                                        name="transportadora"
                                        type="text"
                                        value={formState?.transportadora ?? cont.infoTractoMula?.transportadora}
                                        onChange={handleChange} />
                                </td>
                                :
                                <td>{cont.infoTractoMula?.transportadora || 'N/A'}</td>
                            }

                            {itemSeleccionado && (itemSeleccionado._id === cont._id) && modificando ?
                                <td>
                                    <input
                                        name="nit"
                                        type="text"
                                        value={formState?.nit ?? cont.infoTractoMula?.nit}
                                        onChange={handleChange} />
                                </td>
                                :
                                <td>{cont.infoTractoMula?.nit || 'N/A'}</td>
                            }

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