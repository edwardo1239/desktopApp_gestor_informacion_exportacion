/* eslint-disable prettier/prettier */

import { PiNotePencilDuotone } from "react-icons/pi";
import { clienteType } from "@renderer/types/clientesType";
import ConfirmacionModal from "@renderer/messages/ConfirmacionModal";
import { useEffect, useState } from "react";
import useAppContext from "@renderer/hooks/useAppContext";

type propsType = {
    clientes: clienteType[]
    handleModificar: (cliente) => void
    obtenerClientes: () => void
}

export default function TableListaClientes(props: propsType): JSX.Element {
    const { messageModal } = useAppContext()
    const headers = ["Codigo", "Cliente", "Correo", "DIrección", "Pais destino", "Telefono", "ID", "estado", "Acciones"]
    const [showConfirmacion, setShowConfirmacion] = useState<boolean>(false)
    const [confirm, setConfirm] = useState<boolean>(false)
    const [message, setMessage] = useState<string>('')
    const [clienteDataSeleccionado, setClienteDataSeleccionado] = useState<clienteType>()

    if (!props.clientes) {
        return <div>Cargando...</div>; // O cualquier otro indicador de carga que prefieras
    }
    useEffect(() => {
        if (confirm) {
            eliminar()
            setConfirm(false)
        }
    }, [confirm]);
    const handleEliminar = (cliente): void => {
        setShowConfirmacion(true)
        setMessage("¿Desea cambiar el estado del cliente?")
        setClienteDataSeleccionado(cliente)
    }
    const eliminar = async (): Promise<void> => {
        try {
            const request = {
                action: 'modificar_estado_cliente',
                _id: clienteDataSeleccionado?._id
            }
            const response = await window.api.server2(request);
            if (response.status !== 200)
                throw new Error(response.message)
            messageModal("success", "Cliente modificado con exito")
            props.obtenerClientes()

        } catch (e) {
            if (e instanceof Error)
                messageModal("error", e.message)
        }
    }
    return (
        <div className="table-container">
            <table className="table-main">
                <thead>
                    <tr>
                        {headers.map(item => (
                            <th key={item + "cliente"}>{item}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {props.clientes.map((cliente, index) => (
                        <tr className={`${index % 2 === 0 ? 'fondo-par' : 'fondo-impar'}`} key={cliente.ID + "cliente"}>
                            <td>{cliente.CODIGO}</td>
                            <td>{cliente.CLIENTE}</td>
                            <td>{cliente.CORREO}</td>
                            <td>{cliente.DIRECCIÓN}</td>
                            <td>{cliente.PAIS_DESTINO}</td>
                            <td>{cliente.TELEFONO}</td>
                            <td>{cliente.ID}</td>
                            <td>
                                <button style={{ color: "red" }} onClick={(): void => handleEliminar(cliente)}>
                                    {cliente.activo ?
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="green" ><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M7 3.34a10 10 0 1 1 -4.995 8.984l-.005 -.324l.005 -.324a10 10 0 0 1 4.995 -8.336z" /></svg>
                                        :
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="red" ><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M7 3.34a10 10 0 1 1 -4.995 8.984l-.005 -.324l.005 -.324a10 10 0 0 1 4.995 -8.336z" /></svg>
                                    }
                                </button>

                            </td>
                            <td>
                                <button style={{ color: "blue" }} onClick={(): void => props.handleModificar(cliente)}><PiNotePencilDuotone /></button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {showConfirmacion &&
                <ConfirmacionModal
                    message={message}
                    setConfirmation={setConfirm}
                    setShowConfirmationModal={setShowConfirmacion} />}

        </div>
    )
}
