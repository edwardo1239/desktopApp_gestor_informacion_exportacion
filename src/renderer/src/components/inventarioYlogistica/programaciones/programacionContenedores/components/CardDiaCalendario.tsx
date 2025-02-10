/* eslint-disable prettier/prettier */

import { contenedoresType } from "@renderer/types/contenedoresType"
import { useState } from "react"
import ModalInfoContenedor from "./ModalInfoContenedor"
import { clienteType } from "@renderer/types/clientesType"

type propsType = {
    dia: string
    contenedor: contenedoresType[]
    obtenerData: () => void
    clientes: clienteType[] | undefined
}
export default function CardDiaCalendario(props: propsType): JSX.Element {
    const [showModal, setShowModal] = useState<boolean>(false);
    const [contenedorSeleccionado, setContenedorSeleccionado] = useState<contenedoresType>()
    const openModal = (cont: contenedoresType): void => {
        setShowModal(true)
        setContenedorSeleccionado(cont)
    }
    const closeModal = (): void => {
        setShowModal(false)
        setContenedorSeleccionado(undefined)
        props.obtenerData();
    }

    if (props.contenedor?.length === 0) {
        return (
            <div className="calendario-tarjeta-dias-container">
                <p>{props.dia}</p>
                <div></div>
            </div>
        )
    }
    return (
        <div className="calendario-tarjeta-dias-container">
            <p>{props.dia}</p>
            <div className="calendario-tarjeta-dias-contenedores-container">
                {props.contenedor.map(item => {
                    let estilo = "green"
                    const sinEmpezar = Object.prototype.hasOwnProperty.call(item.infoContenedor, "fechaInicioReal")
                    const enProceso = item.infoContenedor.fechaFinalizado !== null;
                    const salida = item.infoContenedor.fechaSalida !== null;
                    if (!sinEmpezar) {
                        estilo = "red"
                    } else if (sinEmpezar && !enProceso) {
                        estilo = "orange"
                    } else if (sinEmpezar && enProceso && !salida) {
                        estilo = "blue"
                    } else {
                        estilo = "#7d9f3a"
                    }
                    return (
                        <div
                            style={{ backgroundColor: estilo }}
                            key={item._id}
                            onClick={(): void => openModal(item)}
                        >
                            <p>
                                {item.numeroContenedor + " - " +
                                    (typeof item.infoContenedor.clienteInfo === "object" ?
                                        item.infoContenedor.clienteInfo.CLIENTE : "")}
                            </p>
                        </div>
                    )
                })}
            </div>

            {showModal &&
                <ModalInfoContenedor
                    clientes={props.clientes}
                    closeModal={closeModal}
                    contenedor={contenedorSeleccionado} />
            }
        </div>
    )
}
