/* eslint-disable prettier/prettier */
import useAppContext from "@renderer/hooks/useAppContext"
import { lotesType } from "@renderer/types/lotesType"
import { useState } from "react"

type propsType = {
    loteSeleccionado: lotesType | undefined
    ef1: string | undefined
    setNewCanastillas: (e) => void
}
type formType = {
    kilos?: string
    canastillas?: string
    numeroPrecintos?: string
    numeroRemision?: string
    observaciones?: string
}


export default function ModalFrutaSinProcesarToInventario(props: propsType): JSX.Element {
    const { messageModal } = useAppContext();
    const [formState, setFormState] = useState<formType>()
    const closeModal = (): void => {
        const dialogSetting = document.getElementById("change_state_to_inventario") as HTMLDialogElement;
        if (dialogSetting) {
            dialogSetting.close();
        }
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
    const send_to_inventario = async (): Promise<void> => {
        try {
            const promedio = (Number(formState?.kilos) / Number(formState?.canastillas)).toFixed(4)
            const request = {
                action: "put_inventarios_frutaSinProcesar_loteInventario",
                _id: props.loteSeleccionado?._id,
                data: {
                    ...formState,
                    observaciones: props.loteSeleccionado?.observaciones + " | " + formState?.observaciones,
                    promedio: promedio
                }
            }
            const response = await window.api.server2(request);
            if (response.status !== 200)
                throw new Error(`Code ${response.status}: ${response.messaage}`)
            messageModal("success", "Inventario modificado con exito")
            props.setNewCanastillas(formState?.canastillas)
            closeModal()
            const dialogSetting = document.getElementById("modal_cantidad_fruta_inspeccion") as HTMLDialogElement;
            if (dialogSetting) {
                dialogSetting.showModal();
            }
        } catch (err) {
            if (err instanceof Error) {
                messageModal("error", err.message)
            }
        }
    }
    if (!props.loteSeleccionado) {
        return (
            <dialog id="change_state_to_inventario" className="dialog-modal">
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
        <dialog id="change_state_to_inventario" className="dialog-modal">
            <div>
                <h2>Ingreso fruta -- {props.ef1}</h2>
                <h3>Predio: {props.loteSeleccionado.predio.PREDIO}</h3>
            </div>
            <hr />
            <form className="form-container">
                <div >
                    <label>Canastillas</label>
                    <input
                        type="text"
                        onChange={handleChange}
                        name="canastillas"
                        value={formState?.canastillas ? formState.canastillas : ''} required />
                </div>
                <div >
                    <label>Kilos</label>
                    <input
                        type="text"
                        onChange={handleChange}
                        name="kilos"
                        value={formState?.kilos ? formState.kilos : ''} required />
                </div>
                <div >
                    <label>N°. Precintos</label>
                    <input
                        type="text"
                        onChange={handleChange}
                        name="numeroPrecintos"
                        value={formState?.numeroPrecintos ? formState.numeroPrecintos : ''} required />
                </div>
                <div >
                    <label>Observaciones</label>
                    <textarea
                        onChange={handleChange}
                        name="observaciones"
                        value={formState?.observaciones ? formState.observaciones : ''} required />
                </div>
            </form>

            <hr />
            <div className="dialog-modal-botones-div">
                <button className="defaulButtonAgree" onClick={send_to_inventario}>Guardar</button>
                <button className="defaulButtonError" onClick={closeModal}>Cerrar</button>
            </div>
        </dialog>
    )
}