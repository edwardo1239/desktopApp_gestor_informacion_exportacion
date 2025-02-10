/* eslint-disable prettier/prettier */

import useAppContext from "@renderer/hooks/useAppContext"
import ConfirmacionModal from "@renderer/messages/ConfirmacionModal"
import { lotesType } from "@renderer/types/lotesType"
import { useEffect, useState } from "react"

type propsType = {
    loteSeleccionado: lotesType | undefined
    clickLote: (e) => void
}

type formType = {
    clasificacionCalidad?: string
    observaciones?: string
}

export default function ModalFrutaSinProcesarDerogacion(props: propsType): JSX.Element {
    const { messageModal } = useAppContext();
    const [showForm, setShowForm] = useState<boolean>(false)
    const [formState, setFormState] = useState<formType>()

    //modal para confirmar
    const [confirm, setConfirm] = useState<boolean>(false)
    const [showConfirmation, setShowConfirmation] = useState<boolean>(false)
    const [message,] = useState<string>('¿Seguro desea devolver el predio?')
    const closeModal = (): void => {
        const dialogSetting = document.getElementById("derogar_predio_modal") as HTMLDialogElement;
        if (dialogSetting) {
            dialogSetting.close();
        }
    }

    useEffect(() => {
        if (confirm) {
            devolver_predio();
            setConfirm(false)
        }
    }, [confirm]);

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
    const derogar_predio = async (e): Promise<void> => {
        e.preventDefault()
        try {
            const request = {
                action: 'lotes_derogar_lote',
                _id: props.loteSeleccionado?._id,
                observaciones: props.loteSeleccionado?.observaciones + " | " +
                    formState?.observaciones ? formState?.observaciones : '',
                clasificacionCalidad: formState?.clasificacionCalidad
            }
            const response = await window.api.server2(request);
            if (response.status !== 200)
                throw new Error(`Code ${response.status}: ${response.message}`)
            messageModal("success", "Predio derogado con exito")
            setShowForm(false)
            setFormState(undefined)
            closeModal()
        } catch (err) {
            if (err instanceof Error) {
                messageModal("error", err.message)
            }
        }
    }
    const devolver_predio = async (): Promise<void> => {
        try {
            const request = {
                action: "lotes_devolver_lote",
                _id: props.loteSeleccionado?._id,
                canastillas: props.loteSeleccionado?.inventario,
                observaciones: props.loteSeleccionado?.observaciones
            }
            const response = await window.api.server2(request)
            if (response.status !== 200)
                throw new Error(`Code ${response.status}: ${response.message}`)
            messageModal("success", "Lote devuelto con exito")
        } catch (err) {
            if (err instanceof Error) {
                messageModal("error", err.message)
            }
        }
    }
    if (!props.loteSeleccionado) {
        return (
            <dialog id="derogar_predio_modal" className="dialog-modal">
                <div>
                    <h2>Error seleccionando predio</h2>
                </div>
                <div className="dialog-modal-botones-div">
                    <button className="defaulButtonError" onClick={closeModal}>Cerrar</button>
                </div>
            </dialog>
        )
    }
    return (
        <>

            <dialog id="derogar_predio_modal" className="dialog-modal">
                <div>
                    <h2>Modificar estado de la fruta</h2>
                    <h3>Predio: {props.loteSeleccionado.predio.PREDIO}</h3>
                </div>
                <hr />
                <div className="change-state-camino-container-options">
                    <button onClick={(): void => setShowForm(!showForm)}>Derogar como 1.5</button>
                    {showForm &&
                        <form className="form-container">
                            <div >
                                <label>Derogar:</label>
                                <input
                                    type="text"
                                    name="clasificacionCalidad"
                                    value={formState?.clasificacionCalidad ? formState.clasificacionCalidad : ''}
                                    onChange={handleChange}
                                    required />
                            </div>
                            <div >
                                <label>Observaciones:</label>
                                <textarea
                                    value={formState?.observaciones ? formState.observaciones : ''}
                                    onChange={handleChange}
                                    name="observaciones"
                                />
                            </div>
                            <div className='defaultSelect-button-div'>
                                <button onClick={derogar_predio} type='submit' className="defaulButtonAgree" >Guardar</button>
                            </div>
                        </form>
                    }
                    <button onClick={(): void => {
                        setShowConfirmation(true)
                        closeModal()
                    }}>Devolver </button>
                </div>
                <hr />
                <div className="dialog-modal-botones-div">
                    <button className="defaulButtonError" onClick={closeModal}>Cerrar</button>
                </div>


            </dialog>
            {showConfirmation && <ConfirmacionModal message={message} setConfirmation={setConfirm} setShowConfirmationModal={setShowConfirmation} />}

        </>
    )
}