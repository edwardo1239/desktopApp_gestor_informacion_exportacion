/* eslint-disable prettier/prettier */

import { contenedoresType } from "@renderer/types/contenedoresType"
import { IoArrowUndoSharp } from "react-icons/io5";
import { formularios } from "../constantes";
import { FcCancel } from "react-icons/fc";
import { FcOk } from "react-icons/fc";
import { IoSaveSharp } from "react-icons/io5";
import { GiCancel } from "react-icons/gi";
import { PiNotePencilDuotone } from "react-icons/pi";
import { useEffect, useState } from "react";
import useAppContext from "@renderer/hooks/useAppContext";

type propsType = {
    data: contenedoresType | undefined
    show_table: () => void
    obtenerData: () => void
    setItemSeleccionado: (e) => void
}

const headers = [
    "Area",
    "Estado",
    "Observaciones",
    ""
]

type formStateType = {
    cumple?: string;
    observaciones?: string;
}

export default function InfoInspeccionMula(props: propsType): JSX.Element {
    const { messageModal } = useAppContext();
    const [itemSeleccionado, setItemSeleccionado] = useState<string>('')
    const [formState, setFormState] = useState<formStateType>()
    const [modificando, setModificando] = useState<boolean>(false)

    useEffect(() => { 
        console.log("dsadsadsa", props.data) 
        console.log("form", formState) 
    }, [props.data])
    const handleModificar = (key): void => {
        setItemSeleccionado(key)
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
    const modificarData = async (item): Promise<void> => {
        try {
            const query = {}
            if (formState) {
                Object.entries(formState).forEach(([key, value]) => {
                    if (key === 'cumple') {
                        query[`inspeccion_mula.${item}.${key}`] = value === 'true' ? true : false
                    } else {
                        query[`inspeccion_mula.${item}.${key}`] = value
                    }
                })
            }
            const request = {
                action: "post_transporte_registros_inspeccionMula_modificar",
                _id: props.data?._id,
                data: query
            }
            const response = await window.api.server2(request);
            if (response.status !== 200)
                throw new Error(`Code ${response.status}: ${response.message}`)
            messageModal("success", "Dato guardado con exito!")
            setFormState(undefined)
            setModificando(false)
            setItemSeleccionado("")
            props.obtenerData()
            props.setItemSeleccionado((prev) => {
                const updatedState = {
                    ...prev,
                    inspeccion_mula: {
                        ...prev.inspeccion_mula,
                        [item]: {
                            ...prev.inspeccion_mula[item],
                            ...formState,
                        },
                    },
                };
                return updatedState;
            });



        } catch (err) {
            if (err instanceof Error) {
                messageModal("error", err.message)
            }
        }
    }

    if (!props.data) {
        return (
            <div>No se ha seleccionado contenedor...</div>
        )
    }
    return (
        <div>
            <div className="transporte-registros-inspeccionmula-info-action-container">
                <div>
                    <h3>Contenedor {props.data.numeroContenedor} -- {
                        typeof props.data.infoContenedor.clienteInfo === 'object' &&
                        props.data.infoContenedor.clienteInfo.CLIENTE}</h3>
                </div>

                <button onClick={props.show_table} className="defaulButtonAgree">Regresar <IoArrowUndoSharp /></button>

            </div>
            <table className="table-main">
                <thead>
                    <tr>
                        {headers.map(item => (
                            <th key={item}>{item}</th>
                        ))}
                    </tr>
                </thead>

                <tbody>
                    {Object.entries(props.data.inspeccion_mula).map(([key, value], index) => {
                        if (key !== 'fecha' && key !== 'ususario' && typeof value === "object" && value !== null) {
                            return <tr key={key} className={`${index % 2 === 0 ? 'fondo-par' : 'fondo-impar'}`}>

                                <td>{formularios[key]}</td>


                                {itemSeleccionado && (itemSeleccionado === key) && modificando ?
                                    <td>
                                        <select name="cumple"
                                            onChange={handleChange}
                                            value={(formState && formState.cumple) ?
                                                formState?.cumple : (value.cumple ? 'true' : 'false')}
                                        >
                                            <option value=""></option>
                                            <option value="true">Cumple</option>
                                            <option value="false">No Cumple</option>
                                        </select>
                                    </td>
                                    :
                                    <td>{String(value.cumple) === 'true' ?
                                        <div><FcOk /> </div> :
                                        <div><FcCancel /></div>
                                    }</td>
                                }

                                {itemSeleccionado && (itemSeleccionado === key) && modificando ?
                                    <td>
                                        <input
                                            name="observaciones"
                                            type="text"
                                            value={(formState && formState.observaciones) ?
                                                formState?.observaciones : value.observaciones}
                                            onChange={handleChange} />
                                    </td>
                                    :
                                    <td>{value.observaciones}</td>
                                }



                                {/* boton para modificar los datoss */}
                                <td>
                                    {itemSeleccionado !== key &&
                                        <button
                                            style={{ color: "blue" }}
                                            onClick={(): void => handleModificar(key)}
                                        >
                                            <PiNotePencilDuotone />
                                        </button>}

                                    {((itemSeleccionado) === key) && modificando &&
                                        <button style={{ color: 'green' }} onClick={(): Promise<void> => modificarData(key)} >
                                            <IoSaveSharp />
                                        </button>}
                                    {((itemSeleccionado) === key) && modificando &&
                                        <button style={{ color: 'red' }} onClick={(): void => {
                                            setItemSeleccionado('')
                                            setModificando(false)

                                        }}>
                                            <GiCancel />
                                        </button>}
                                </td>
                            </tr>
                        } else {
                            return null
                        }
                    })}
                </tbody>

            </table>
        </div>
    )
}