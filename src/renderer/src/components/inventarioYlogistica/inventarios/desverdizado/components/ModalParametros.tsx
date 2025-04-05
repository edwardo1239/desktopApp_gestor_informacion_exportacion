/* eslint-disable prettier/prettier */

import useAppContext from "@renderer/hooks/useAppContext";
import { lotesType } from "@renderer/types/lotesType";
import { useState } from "react";

type propsType = {
    select: lotesType | undefined
}

export default function ModalParametros(props: propsType): JSX.Element {
    const { messageModal } = useAppContext();
    const [temperatura, setTemperatura] = useState<string>('')
    const [etileno, setEtileno] = useState<string>('')
    const [dioxido, setDioxido] = useState<string>('')
    const [humedad, setHumedad] = useState<string>('')

    const closeModal = (): void => {
        const dialogSetting = document.getElementById("modal_post_parametros_desverdizado") as HTMLDialogElement;
        if (dialogSetting) {
            dialogSetting.close();
        }
    }
    const guardar = async (): Promise<void> => {

        try {
            if (props.select === undefined) throw new Error("No se ha seleccionado lote")

            const parametros = {
                temperatura: temperatura,
                etileno: etileno,
                carbono: dioxido,
                humedad: humedad,
                fecha: new Date().toUTCString()

            }
            const request = {
                __v: props.select.__v,
                _id: props.select._id,
                data: parametros,
                action: 'put_inventarios_frutaDesverdizando_parametros',

            }
            const response = await window.api.server2(request)
            if (response.status !== 200)
                throw new Error(`Code ${response.status}: ${response.message}`);
            messageModal("success", "Guardado con exito!")
            setTemperatura('')
            setEtileno('')
            setDioxido('')
            setHumedad('')
        } catch (err) {
            if (err instanceof Error) {
                messageModal("error", err.message)
            }
        } finally {
            closeModal()
        }
    }
    return (
        <dialog id='modal_post_parametros_desverdizado' className='"dialog-container"'>
            <div className="dialog-header">
                <h3>Ingresar Parametros</h3>
                <button className="close-button" aria-label="Cerrar" onClick={closeModal}>×</button>
            </div>
            <div className="dialog-body">
                <div className="form-field">
                    <label>Temperatura C°</label>
                    <input
                        type="text"
                        onChange={(e): void => setTemperatura(e.target.value)}
                    />
                </div>
                <div className="form-field">
                    <label>Etileno (ppm)</label>
                    <input
                        type="text"
                        onChange={(e): void => setEtileno(e.target.value)}

                    />
                </div>
                <div className="form-field">
                    <label>Dioxido de carbono (ppm)</label>
                    <input
                        type="text"
                        onChange={(e): void => setDioxido(e.target.value)}

                    />
                </div>
                <div className="form-field">
                    <label>Humedad %</label>
                    <input
                        type="text"
                        onChange={(e): void => setHumedad(e.target.value)}

                    />
                </div>
                <div className="dialog-footer">
                    <button className="default-button-agree" onClick={guardar}>Guardar</button>
                    <button className="default-button-error" onClick={closeModal}>Cerrar</button>
                </div>
            </div>
        </dialog>
    )
}
