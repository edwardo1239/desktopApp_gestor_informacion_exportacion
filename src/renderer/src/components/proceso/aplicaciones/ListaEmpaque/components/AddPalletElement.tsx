/* eslint-disable prettier/prettier */

import useAppContext from "@renderer/hooks/useAppContext";
import ConfirmacionModal from "@renderer/messages/ConfirmacionModal";
import { contenedoresType } from "@renderer/types/contenedoresType"
import { useEffect, useState } from "react";
import { IoMdAddCircleOutline } from "react-icons/io";

type propsType = {
    contenedor: contenedoresType
    obtenerDataContenedores: () => void
}

export default function AddPalletElement(props: propsType): JSX.Element {
    const { messageModal } = useAppContext();
    const [showConfirmacion, setShowConfirmacion] = useState<boolean>(false)
    const [confirm, setConfirm] = useState<boolean>(false)
    const [message, setMessage] = useState<string>('')

    useEffect(() => {
        if (confirm) {
            handleAddPallet()
            setConfirm(false)
        }
    }, [confirm]);
    const handleClick = (): void => {
        setShowConfirmacion(true)
        setMessage("¿Desea crear un pallet nuevo?")
    }

    const handleAddPallet = async (): Promise<void> => {
        try {
            const request = {
                action: "add_pallet_listaempaque",
                _id: props.contenedor._id
            }
            const response = await window.api.server2(request)
            if (response.status !== 200)
                throw new Error(`Code ${response.status}: ${response.message}`)
            messageModal("success", "Pallet agregado con exito!")

            props.obtenerDataContenedores()
            setShowConfirmacion(false)

        } catch (err) {
            if (err instanceof Error) {
                messageModal("error", err.message)
            }
        }
    }
    return (
        <>
            <div title="Agregar nuevo pallet" onClick={handleClick} className="proceso-listaempaque-add-pallet-container">
                <div className="proceso-listaempaque-add-pallet-div">
                    <IoMdAddCircleOutline />
                </div>
            </div>
            {showConfirmacion &&
                <ConfirmacionModal
                    message={message}
                    setConfirmation={setConfirm}
                    setShowConfirmationModal={setShowConfirmacion} />}
        </>
    )
}
