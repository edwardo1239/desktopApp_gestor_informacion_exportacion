/* eslint-disable prettier/prettier */

import useAppContext from "@renderer/hooks/useAppContext"
import { contenedoresType } from "@renderer/types/contenedoresType"
import { useContext, useState } from "react"
import { palletSeleccionadoContext } from "../ProcesoListaEmpaque"

type propsType = {
    contenedor: contenedoresType
}

export default function ConfigurarPallet(props: propsType): JSX.Element {
    const pallet = useContext(palletSeleccionadoContext)
    const { messageModal } = useAppContext();
    const [calidad, setCalidad] = useState<string>();
    const [calibre, setCalibre] = useState<string>();
    const [tipoCaja, setTipoCaja] = useState<string>();
  

    const closeModal = (): void => {
        setCalibre(undefined)
        setCalidad(undefined)
        setTipoCaja(undefined)
        const dialogSetting = document.getElementById("settingsPallet") as HTMLDialogElement;
        if (dialogSetting) {
            dialogSetting.close();
        }
    }

    const configurarPallet = async (): Promise<void> => {
        try{
            const request = {  
                action: 'add_settings_pallet', 
                _id: props.contenedor._id, 
                pallet: pallet,
                settings: {
                    calidad: calidad,
                    calibre: calibre,
                    tipoCaja: tipoCaja
                }, 
            };
            const response = await window.api.server2(request);
            if(response.status !== 200)
                throw new Error(`Code ${response.status}: ${response.message}`);
            messageModal("success", "Datos guardados con exito")
            closeModal()
        } catch(err){
            if(err instanceof Error){
                messageModal("error", err.message)
            }
        }
    }
    if (props.contenedor === undefined) {
        return (
            <dialog id="settingsPallet">
                <div>No se ha seleccionado contenedor...</div>

            </dialog>
        )
    }
    return (
        <dialog id="settingsPallet" className="dialog-modal">
            <div>
                <h3>Pallet: {pallet + 1}</h3>
                <h4>Calidad:</h4>
                <hr />
                <div className="dialog-modal-seccion">
                    {props.contenedor.infoContenedor.calidad.map((item, index) => (
                        <label key={index}>
                            <p>{item}</p>
                            <input type="radio" name="calidad" onChange={
                                ():void => setCalidad(item)
                                }/>
                        </label>
                    ))}
                </div>
                <h4>Calibres:</h4>
                <hr />
                <div className="dialog-modal-seccion">
                    {props.contenedor.infoContenedor.calibres.map((item, index) => (
                        <label key={index}>
                            <p>{item}</p>
                            <input type="radio" name="calibre" onChange={():void => {
                                setCalibre(item)
                            }} />
                        </label>
                    ))}
                </div>
                <h4>Tipo caja:</h4>
                <hr />
                <div className="dialog-modal-seccion">
                    {props.contenedor.infoContenedor.tipoCaja.map((item, index) => (
                        <label key={index}>
                            <p>{item}</p>
                            <input type="radio" name="tipoCaja" onChange={():void => {
                                setTipoCaja(item)
                            }} />
                        </label>
                    ))}
                </div>
                <div className="dialog-modal-botones-div">
                    <button className="defaulButtonAgree" onClick={configurarPallet}>Guardar</button>
                    <button className="defaulButtonError" onClick={closeModal}>Cerrar</button>
                </div>
            </div>
        </dialog>
    )
}
