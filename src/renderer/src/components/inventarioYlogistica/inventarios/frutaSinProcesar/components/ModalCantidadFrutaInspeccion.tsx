/* eslint-disable prettier/prettier */

import { lotesType } from "@renderer/types/lotesType"
import { useEffect, useState } from "react"

type propsType = {
    loteSeleccionado: lotesType | undefined
    canastillas: string | undefined

}

export default function ModalCantidadFrutaInspeccion(props: propsType): JSX.Element {
    const [canastillasInspeccionar, setCanastillasInspeccionar] = useState<number>()
    useEffect(() => {
        if (!props.canastillas) return
        console.log(props.canastillas)
        if (Number(props.canastillas) <= 20) {
            setCanastillasInspeccionar(5)
        } else if (Number(props.canastillas) <= 100) {
            setCanastillasInspeccionar(10)
        } else if (Number(props.canastillas) <= 200) {
            const mapped = 10 + ((Number(props.canastillas) - 100) * (20 - 10)) / (200 - 100);
            setCanastillasInspeccionar(mapped)
        } else {
            setCanastillasInspeccionar(20)

        }
    }, [props.canastillas])

    const closeModal = (): void => {
        const dialogSetting = document.getElementById("modal_cantidad_fruta_inspeccion") as HTMLDialogElement;
        if (dialogSetting) {
            dialogSetting.close();
        }
    }

    if (!props.loteSeleccionado) {
        return (
            <dialog id="modal_cantidad_fruta_inspeccion" className="dialog-modal">
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
        <dialog id="modal_cantidad_fruta_inspeccion" className="dialog-modal">
            <div>
                <h2>Fruta para inspeccionar</h2>
                <h3>Predio: {props.loteSeleccionado.predio.PREDIO}</h3>
            </div>
            <hr />
                <h3>Porfavor separe {canastillasInspeccionar} canastillas para la inspeccion de calidad</h3>
            <hr />
            <div className="dialog-modal-botones-div">
                <button className="defaulButtonError" onClick={closeModal}>Cerrar</button>
            </div>
        </dialog>
    )
}