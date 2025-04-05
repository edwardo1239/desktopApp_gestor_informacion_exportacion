/* eslint-disable prettier/prettier */
import { cargoType } from "@renderer/types/cargos"
import { format } from "date-fns";
import { PiNotePencilDuotone } from "react-icons/pi";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { es } from 'date-fns/locale';
import useAppContext from "@renderer/hooks/useAppContext";
import ConfirmacionModal from "@renderer/messages/ConfirmacionModal";
import { useEffect, useState } from "react";

type propsType = {
    data: cargoType[] | undefined
    getCargos: () => void
    handleChange: (tipo: string) => void
    setCargoSeleccionado: (cargo: cargoType) => void
    cargoSeleccionado: cargoType | undefined
}
export default function TablaCargos(props: propsType): JSX.Element {
    const headers = ["Cargo", "Fecha creación", "Acciones"];
    const { messageModal, setLoading } = useAppContext();
    const [showConfirmacion, setShowConfirmacion] = useState<boolean>(false)
    const [confirm, setConfirm] = useState<boolean>(false)
    const [message, setMessage] = useState<string>('')
    useEffect(() => {
        if (confirm) {
            eliminar()
        }
    }, [confirm])
    const handleEliminar = (cargo): void => {
        setShowConfirmacion(true)
        setMessage("¿Desea eliminar el cargo seleccionado?")
        props.setCargoSeleccionado(cargo)
    }
    const eliminar = async (): Promise<void> => {
        try {
            setLoading(true)
            const request = {
                action: "delete_gestionCuentas_cargos",
                _id: props.cargoSeleccionado?._id
            }
            const response = await window.api.server2(request)
            if (response.status !== 200) throw new Error(`Code ${response.status}: ${response.message}`);
            messageModal("success", "Se elimino el cargo con exito");
            props.getCargos();
        } catch (err) {
            if (err instanceof Error) {
                messageModal("error", err.message)
            }
        } finally {
            setLoading(false)
        }
    }
    const handleModificar = (cargo): void => {
        props.handleChange("modificar")
        props.setCargoSeleccionado(cargo)
    }
    if (props.data === undefined) {
        return (
            <div>
                Cargando Datos
            </div>
        )
    }
    return (
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
                    {props.data.map((cargo, indexs) => (
                        <tr key={cargo._id} className={`${indexs % 2 === 0 ? 'fondo-par' : 'fondo-impar'}`}>
                            <td>{cargo.Cargo}</td>
                            <td>{format(new Date(cargo.createdAt), 'dd/MM/yyyy HH:mm', { locale: es })}</td>
                            <td>
                                <button style={{ color: "blue" }} onClick={(): void => handleModificar(cargo)}><PiNotePencilDuotone /></button>
                                <button
                                    style={{ color: "red" }}
                                    onClick={async (): Promise<void> => await handleEliminar(cargo)}>
                                    <RiDeleteBin5Fill />
                                </button>
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
        </ div>
    )
}
