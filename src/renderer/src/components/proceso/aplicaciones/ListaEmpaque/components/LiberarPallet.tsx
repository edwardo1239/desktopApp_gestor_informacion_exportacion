/* eslint-disable prettier/prettier */

import { contenedoresType } from "@renderer/types/contenedoresType"
import { useContext, useEffect, useState } from "react"
import { palletSeleccionadoContext } from "../ProcesoListaEmpaque"
import useAppContext from "@renderer/hooks/useAppContext"
import { liberarPalletLabels } from "../function/labels"


type propsType = {
    contenedor: contenedoresType
}

export default function LiberarPallet(props: propsType): JSX.Element {
    const pallet = useContext(palletSeleccionadoContext)
    const { messageModal } = useAppContext();
    const [formState, setFormState] = useState({})

    useEffect(()=>{
        setFormState({
            ...formState,
            ...props.contenedor.pallets[pallet].listaLiberarPallet
        })
    },[pallet])

    const closeModal = (): void => {
        const dialogSetting = document.getElementById("liberarPallet") as HTMLDialogElement;
        if (dialogSetting) {
            dialogSetting.close();
        }
    }
    const handleCheckItem = (e): void => {
        const { name, checked } = e.target
        console.log(name)
        setFormState({
            ...formState,
            [name]: checked
        })
    }
    const handleGuardar = async ():Promise<void> => {
        try {
            const request = {
                action: 'liberar_pallets_lista_empaque',
                item: formState,
                _id: props.contenedor._id,
                pallet: pallet,
            }
            const response = await window.api.server2(request);
            if(response.status !== 200)
                throw new Error(`Code ${response.status}: ${response.message}`);
            messageModal("success","Guardado con exito!")
        } catch(err){
            if(err instanceof Error){
                messageModal("error", err.message)
            }
        }
    }
    return (
        <dialog id="liberarPallet" className="dialog-modal">
            <div>
                <h3>Liberar pallet: {pallet + 1}</h3>
                <hr />
                <div className="dialog-modal-seccion-liberar">
                    {Object.keys(props.contenedor.pallets[pallet].listaLiberarPallet).map(
                        (item, index) => (
                            <label key={index}>
                                <p>{liberarPalletLabels[item]}</p>
                                <input 
                                    type="checkbox" 
                                    name={item} 
                                    onChange={handleCheckItem} 
                                    checked={formState[item]}
                                />
                            </label>
                        ))}
                </div>
                <hr />
                <div className="dialog-modal-botones-div">
                    <button className="defaulButtonAgree" onClick={handleGuardar} >Guardar</button>
                    <button className="defaulButtonError" onClick={closeModal}>Cerrar</button>
                </div>
            </div>
        </dialog>
    )
}
