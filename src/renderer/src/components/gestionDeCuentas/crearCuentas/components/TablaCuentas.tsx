/* eslint-disable prettier/prettier */
import { userType } from "@renderer/types/cuentas"
import { Fragment, useEffect, useState } from "react";
import { PiNotePencilDuotone } from "react-icons/pi";
import { FaArrowCircleDown } from "react-icons/fa";
import { FaArrowCircleUp } from "react-icons/fa";
import TableInfoUsuario from "./TableInfoUsuario";
import ConfirmacionModal from "@renderer/messages/ConfirmacionModal";
import { cargoType } from "@renderer/types/cargos";

type propsType = {
    handleModificar: (usuario, tipo) => void
    setOpciones: (e: string) => void
    cargos: cargoType[] | undefined
    data: userType[] | undefined
    desactivar: (e:userType) => void
}
export default function TablaCuentas(props: propsType): JSX.Element {

    const [opcion, setOpcion] = useState<string>("")
    const [usuarioSeleccionado, setUsuarioSeleccionado] = useState<string>("");
    const [usuarioDataSeleccionado, setUsuarioDataSeleccionado] = useState<userType>()
    const headers = ["Usuario", "Nombre", "Apellido", "Info Usuario", "Cargo", "Estado", "Modificar"]
    const [showConfirmacion, setShowConfirmacion] = useState<boolean>(false)
    const [confirm, setConfirm] = useState<boolean>(false)
    const [message, setMessage] = useState<string>('')

    useEffect(() => {
        if (confirm && usuarioDataSeleccionado) {
            props.desactivar(usuarioDataSeleccionado)
            setConfirm(false)
        }
    }, [confirm]);


    const handleClick = (e, id): void => {
        if (opcion !== "") {
            setOpcion("")
            setUsuarioSeleccionado("")
        }
        else {
            setOpcion(e)
            setUsuarioSeleccionado(id)
        }
    }
    const handleEliminar = (usuario): void => {
        setShowConfirmacion(true)
        if (usuario.estado) {
            setMessage("¿Desea desactivar el Usuario seleccionado?")
        } else {
            setMessage("¿Desea activar el Usuario seleccionado?")
        }
        setUsuarioDataSeleccionado(usuario)
    }


    return (
        <>
            <div className="table-container">

                <table className="table-main">
                    <thead>
                        <tr>
                            {headers.map((item) => (
                                <th key={item}>{item}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {props.data && props.data.map((usuario, index) => (
                            <Fragment key={usuario._id}>
                                <tr className={`${index % 2 === 0 ? 'fondo-par' : 'fondo-impar'}`} >
                                    <td>{usuario.usuario}</td>
                                    <td>{usuario.nombre}</td>
                                    <td>{usuario.apellido}</td>
                                    <td>
                                        <div onClick={(): void => handleClick("info-usuario", usuario._id)}>
                                            <p>Info Usuario</p>
                                            {opcion === "info-usuario" && usuarioSeleccionado === usuario._id ?
                                                <FaArrowCircleUp /> :
                                                <FaArrowCircleDown />
                                            }
                                        </div>
                                    </td>
                                    <td>{usuario.cargo.Cargo}</td>
                                    <td>
                                        <button style={{ color: "red" }} onClick={(): void => handleEliminar(usuario)}>
                                            {usuario.estado ?
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="green" ><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M7 3.34a10 10 0 1 1 -4.995 8.984l-.005 -.324l.005 -.324a10 10 0 0 1 4.995 -8.336z" /></svg>
                                                :
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="red" ><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M7 3.34a10 10 0 1 1 -4.995 8.984l-.005 -.324l.005 -.324a10 10 0 0 1 4.995 -8.336z" /></svg>
                                            }
                                        </button>

                                    </td>
                                    <td>
                                        <button onClick={(): void => props.handleModificar(usuario, 'modificar')} style={{ color: "blue" }}><PiNotePencilDuotone /></button>
                                    </td>
                                </tr>
                                {opcion !== '' && usuarioSeleccionado === usuario._id &&
                                    <tr>
                                        <td colSpan={7}>
                                            {opcion === "info-usuario" && <TableInfoUsuario usuario={usuario} />}
                                        </td>
                                    </tr>
                                }
                            </Fragment>
                        ))}
                    </tbody>
                </table>
            </div>
            {showConfirmacion &&
                <ConfirmacionModal
                    message={message}
                    setConfirmation={setConfirm}
                    setShowConfirmationModal={setShowConfirmacion} />}</>
    )
}