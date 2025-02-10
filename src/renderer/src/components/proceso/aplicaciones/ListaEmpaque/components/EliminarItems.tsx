/* eslint-disable prettier/prettier */

import { contenedoresType } from "@renderer/types/contenedoresType"
import { useContext, useState } from "react";
import { loteProcesandoContext, palletSeleccionadoContext } from "../ProcesoListaEmpaque";
import useAppContext from "@renderer/hooks/useAppContext";
import { FaDeleteLeft } from "react-icons/fa6";
import { validarEliminar } from "../function/validations";

type propsType = {
    contenedor: contenedoresType
}
export default function EliminarItems(props: propsType): JSX.Element {
    const pallet = useContext(palletSeleccionadoContext)
    const loteActual = useContext(loteProcesandoContext)
    const { messageModal } = useAppContext();
    const [seleccion, setSeleccion] = useState<number[]>([])

    if (pallet === undefined || props.contenedor === undefined) {
        return <div></div>
    }

    const handleSeleccion = (e: number):void => {
        setSeleccion(prev => [...prev, e])
    }

    const handleGuardar = async (): Promise<void> => {
        try{
            if(loteActual === undefined) throw new Error("No hay lote procesando")
            validarEliminar(loteActual,seleccion)
            const request = {
                action: 'eliminar_item_lista_empaque',
                _id: props.contenedor._id,
                pallet: pallet,
                seleccion: seleccion,
            }
            const response = await window.api.server2(request);
            if(response.status !== 200)
                throw new Error(`Code ${response.status}: ${response.message}`)
            messageModal("success", "Eliminado con exito")
            closeModal();
        } catch (err){
            if(err instanceof Error){
                messageModal("error", err.message)
            }
        }
    }
    const closeModal = (): void => {
        setSeleccion([]);
        const dialogSetting = document.getElementById("borrarItemPallet") as HTMLDialogElement;
        if (dialogSetting) {
            dialogSetting.close();
        }
    }
    return (
        <dialog id="borrarItemPallet" className="dialog-modal">
            <div>
                <h2>Info. pallet {pallet + 1}</h2>
                <hr />
                <div className="proceso-listaempaque-edit-button">
                </div>
                <div className="proceso-listaempaque-info-pallet">
                    {props.contenedor && props.contenedor.pallets && props.contenedor.pallets[pallet] &&
                        props.contenedor.pallets[pallet].EF1.map((item, index) => (
                            <div key={index} className={
                                seleccion.includes(index) ? "proceso-listaempaque-info-pallet-item-select" : "proceso-listaempaque-info-pallet-item"
                            }>
                                <div className="proceso-listaempaque-info-pallet-item-nombre">
                                    <p>{item.lote?.predio}</p>
                                    <p>{item.lote?.enf}</p>
                                </div>
                                <hr />
                                <div>
                                    <p>Tipo caja: {item.tipoCaja}</p>
                                    <p>Cajas: {item.cajas}</p>
                                    <p>Calidad: {item.calidad}</p>
                                    <p>Calibre: {item.calibre}</p>
                                    <p>Fecha: {new Date(item.fecha ? item.fecha : 0).toLocaleDateString('es-ES', {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        second: '2-digit',
                                        hour12: true
                                    })}</p>
                                </div>
                                <div className="proceso-listaempaque-edit-button">
                                    <button onClick={(): void => handleSeleccion(index)}>
                                        <FaDeleteLeft color='red' />
                                    </button>
                                </div>

                            </div>

                        ))}

                </div>
                <div className="dialog-modal-botones-div">
                    <button className="defaulButtonError" onClick={handleGuardar} >Eliminar</button>
                    <button className="defaulButtonCancel" onClick={closeModal} >Cerrar</button>
                </div>
            </div>
        </dialog>
    )
}
