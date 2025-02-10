/* eslint-disable prettier/prettier */

import { contenedoresType } from "@renderer/types/contenedoresType"
import { useContext } from "react";
import { palletSeleccionadoContext } from "../ProcesoListaEmpaque";
import { FiEdit } from "react-icons/fi";

type propsType = {
    contenedor: contenedoresType
}
export default function InfoPallet(props: propsType): JSX.Element {
    const pallet = useContext(palletSeleccionadoContext);
    if (pallet === undefined || props.contenedor === undefined) {
        return <div></div>
    }


    const closeModal = (): void => {
        const dialogSetting = document.getElementById("infoPallet") as HTMLDialogElement;
        if (dialogSetting) {
            dialogSetting.close();
        }
    }
    return (
        <dialog id="infoPallet" className="dialog-modal">
            <div>
                <h2>Info. pallet {pallet + 1}</h2>
                <hr />
                <div className="proceso-listaempaque-edit-button">
                    <button ><FiEdit color="blue" /></button>
                </div>
                <div className="proceso-listaempaque-info-pallet">
                    {props.contenedor && props.contenedor.pallets && props.contenedor.pallets[pallet] &&
                        props.contenedor.pallets[pallet].EF1.map((item, index) => (
                            <div key={index} className="proceso-listaempaque-info-pallet-item">
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

                            </div>
                        ))}
                </div>
                <div className="dialog-modal-botones-div">
                    <button className="defaulButtonError" onClick={closeModal} >Cerrar</button>
                </div>
            </div>
        </dialog>
    )
}
