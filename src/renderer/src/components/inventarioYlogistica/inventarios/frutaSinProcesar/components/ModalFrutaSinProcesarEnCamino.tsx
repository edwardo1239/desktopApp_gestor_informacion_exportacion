/* eslint-disable prettier/prettier */
import useAppContext from "@renderer/hooks/useAppContext";
import { lotesType } from "@renderer/types/lotesType";
import { FaSquareParking } from "react-icons/fa6";
import { MdInventory2 } from "react-icons/md";

type propsType = {
  loteSeleccionado: lotesType | undefined
  clickLote: (e) => void
}
export default function ModalFrutaSinProcesarEnCamino(props:propsType): JSX.Element {
    const { messageModal } = useAppContext();
    const closeModal = (): void => {
        const dialogSetting = document.getElementById("change_state_de_camino") as HTMLDialogElement;
        if (dialogSetting) {
            dialogSetting.close();
        }
    }

    const toRecepcionPendiente = async (): Promise<void> => {
        try{
            const request = {
                action:"put_inventarios_frutaSinProcesar_recepcionPendiente",
                _id:props.loteSeleccionado?._id
            }
            const response = await window.api.server2(request)
            if(response.status !== 200) 
                throw new Error(`Code ${response.status}: ${response.message}`)
            messageModal("success", "Se movio el lote a recepción pendiente con exito")
            closeModal();
        } catch(err){
            if(err instanceof Error){
                messageModal("error", err.message)
            }
        }
    }

    const toInventario = ():void => {
        const dialogSetting = document.getElementById("change_state_de_camino") as HTMLDialogElement;
        if (dialogSetting) {
            dialogSetting.close();
        }
        const dialogToInventario = document.getElementById("change_state_to_inventario") as HTMLDialogElement;
        if (dialogToInventario) {
            dialogToInventario.showModal();
        }

        props.clickLote(props.loteSeleccionado?._id)

    }

    if(!props.loteSeleccionado){
        return(
            <dialog id="change_state_de_camino" className="dialog-modal">
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
        <dialog id="change_state_de_camino" className="dialog-modal">
            <div>
                <h2>Modificar estado de la fruta</h2>
                <h3>Predio: {props.loteSeleccionado.predio.PREDIO}</h3>
            </div>
            <hr />
            <div className="change-state-camino-container-options">
                <button onClick={toRecepcionPendiente}>Recepción pendiente <FaSquareParking color="orange" fontSize={24} /></button>
                <button onClick={toInventario} >Inventario <MdInventory2 color="#7d9f3a" fontSize={24}/></button>
            </div>
            <hr />
            <div className="dialog-modal-botones-div">
                <button className="defaulButtonError" onClick={closeModal}>Cerrar</button>
            </div>
        </dialog>
    )
}
