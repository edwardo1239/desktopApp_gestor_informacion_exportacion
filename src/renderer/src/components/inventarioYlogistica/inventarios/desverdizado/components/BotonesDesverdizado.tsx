/* eslint-disable prettier/prettier */

import useAppContext from "@renderer/hooks/useAppContext"
import ConfirmacionModal from "@renderer/messages/ConfirmacionModal"
import { lotesType } from "@renderer/types/lotesType"
import { useEffect, useState } from "react"

type propsType = {
    select: lotesType | undefined
    setFiltro: (e) => void
    filtro: string
}

export default function BotonesDesverdizado(props: propsType): JSX.Element {
    const { messageModal } = useAppContext();
    //modal de confimacion
    const [confirm, setConfirm] = useState<boolean>(false)
    const [message,] = useState<string>('¿Desea finalizar el desverdizado?')
    const [showConfirmation, setShowConfirmation] = useState<boolean>(false)

    useEffect(() => {
        if (confirm) {
            finalizar();
            setConfirm(false)
        }
    }, [confirm]);
    const handleClickParametros = (): void => {
        if (!props.select) return
        const dialogSetting = document.getElementById("modal_post_parametros_desverdizado") as HTMLDialogElement;
        if (dialogSetting) {
            dialogSetting.show();
        }
    }
    const finalizar = async (): Promise<void> => {
        try {
            if (!props.select) throw new Error("Seleccione un lote")
            const request = {
                _id: props.select._id,
                __v: props.select.__v,
                action: "put_inventarios_frutaDesverdizado_finalizar"
            }
            const response = await window.api.server2(request)
            if (response.status !== 200)
                throw new Error(`Code ${response.status}: ${response.message}`)
            messageModal("success", "Finzalizado con exito")
        } catch (err) {
            if (err instanceof Error) {
                messageModal("error", err.message)
            }
        }
    }
    return (
        <>
            <div className="filtro_proveedores-div">
                <div>
                    <label className="search-label">

                    </label>
                    <div className="search-container">
                        <input
                            onChange={(e): void => props.setFiltro(e.target.value)}
                            type="text"
                            name="buscar"
                            className="search-input"
                            placeholder="Buscar..."
                            value={props.filtro ?? ''}
                        />
                    </div>
                </div>
                <div>
                    <h2></h2>
                    {props.select &&
                        <h2>{props.select.enf
                            + " -- " +
                            props.select.predio.PREDIO}</h2>
                    }

                </div>
                <button
                    onClick={handleClickParametros}
                    className="add-record"
                >
                    Parametros
                </button>
                <button
                    onClick={():void => {
                        if(props.select === undefined) 
                            return messageModal("error", "Seleccione predio")
                        setShowConfirmation(true)
                    }}
                    className="add-record"
                >
                    Finalizar
                </button>
            </div>
            {showConfirmation && 
                <ConfirmacionModal 
                    message={message} 
                    setConfirmation={setConfirm} 
                    setShowConfirmationModal={setShowConfirmation} />}

        </>
    )
}
