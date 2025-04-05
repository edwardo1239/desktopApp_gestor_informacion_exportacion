/* eslint-disable prettier/prettier */

import { lotesType } from "@renderer/types/lotesType";
import { useState } from "react";

type propsType = {
    loteSeleccionado: lotesType
}

export default function ModificarPrecios(props: propsType): JSX.Element {
    const [exportacion1, setExportacion1] = useState<string>();
    const [exportacion15, setExportacion15] = useState<string>();
    const [exportacion2, setExportacion2] = useState<string>();
    const [frutaNacional, setFrutaNacional] = useState<string>();
    const [descarte, setDescarte] = useState<string>();
    const closeModal = (): void => {
        const dialogSetting = document.getElementById("modificarPreciosInformeCalidad") as HTMLDialogElement;
        if (dialogSetting) {
            dialogSetting.close();
        }
    }
    const handleGuardar = (): void => {
        const data = {}
        const tipoFruta = props.loteSeleccionado.tipoFruta;
        data[tipoFruta] = {}
        data[tipoFruta]["1"] = exportacion1 === undefined  ? 0 : exportacion1
        data[tipoFruta]["15"] = exportacion15 === undefined ? 0 : exportacion15
        data[tipoFruta]["2"] = exportacion2 === undefined ? 0 : exportacion2
        data[tipoFruta]["frutaNacional"] = frutaNacional === undefined ? 0 : frutaNacional
        data[tipoFruta]["descarte"] = descarte === undefined ? 0 : descarte

        closeModal()
    }
    return (
        <dialog id="modificarPreciosInformeCalidad" className="dialog-modal">
            <div>
                <h2>Modificar precio</h2>
                <hr />
                <div>
                    <label>
                        Exportación 1:
                        <input
                            type="text"
                            value={exportacion1}
                            onChange={(e): void => setExportacion1(e.target.value)}
                            className="defaultSelect" />
                    </label>
                    <label>
                        Exportación 1.5:
                        <input
                            type="text"
                            value={exportacion15}
                            onChange={(e): void => setExportacion15(e.target.value)}
                            className="defaultSelect" />
                    </label>
                    <label>
                        Exportación 2:
                        <input
                            type="text"
                            value={exportacion2}
                            onChange={(e): void => setExportacion2(e.target.value)}
                            className="defaultSelect" />
                    </label>
                    <label>
                        Fruta nacional:
                        <input
                            type="text"
                            value={frutaNacional}
                            onChange={(e): void => setFrutaNacional(e.target.value)}
                            className="defaultSelect" />
                    </label>
                    <label>
                        Descarte:
                        <input
                            type="text"
                            value={descarte}
                            onChange={(e): void => setDescarte(e.target.value)}
                            className="defaultSelect" />
                    </label>

                </div>


                <div className="dialog-modal-botones-div">
                    <button className="defaulButtonAgree" onClick={handleGuardar}>Guardar</button>
                    <button className="defaulButtonError" onClick={closeModal}>Cerrar</button>
                </div>
            </div>

        </dialog>
    )
}
