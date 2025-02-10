/* eslint-disable prettier/prettier */

import { contenedoresType } from "@renderer/types/contenedoresType"
import { useContext, useState } from "react"
import { loteProcesandoContext, palletSeleccionadoContext } from "../ProcesoListaEmpaque"
import useAppContext from "@renderer/hooks/useAppContext"
import { validarActualizarPallet, validarSumarDato } from "../function/validations"

type propsType = {
    contenedor: contenedoresType
}
export default function AddCajasPallet(props: propsType): JSX.Element {
    const { messageModal } = useAppContext();
    const pallet = useContext(palletSeleccionadoContext)
    const loteSeleccionado = useContext(loteProcesandoContext)
    const [tipo, setTipo] = useState<string>('');
    const [cajas, setCajas] = useState<number>(0);

    const handleGuardar = async (): Promise<void> => {
        try {
            if (!props.contenedor) throw new Error("contenedor undefinide");
            if (loteSeleccionado === undefined) throw new Error("No hay predio procesando")
            let cajasActual
            if (tipo === 'actualizar') {
                cajasActual = validarActualizarPallet(
                    cajas,
                    loteSeleccionado,
                    pallet,
                    props.contenedor
                )

            } else if (tipo === 'sumar') {
                cajasActual = cajas
                validarSumarDato(
                    cajas,
                    loteSeleccionado,
                    pallet,
                    props.contenedor
                )
            }

            const item = {
                lote: loteSeleccionado._id,
                cajas: cajasActual,
                tipoCaja: props.contenedor?.pallets[pallet].settings.tipoCaja,
                calibre: String(props.contenedor?.pallets[pallet].settings.calibre),
                calidad: String(props.contenedor?.pallets[pallet].settings.calidad),
                tipoFruta: loteSeleccionado.tipoFruta,
                fecha: new Date(),
            };

            const request = {
                action: 'actualizar_pallet_contenedor',
                _id: props.contenedor._id,
                pallet: pallet,
                item: item,
            }

            const response = await window.api.server2(request);
            if (response.status !== 200)
                throw new Error(`Code ${response.status}: ${response.message}`)
            messageModal("success", "guardado con exito");
            closeModal();
        } catch (err) {
            if (err instanceof Error) {
                messageModal("error", err.message)
            }
        }
    }
    const closeModal = (): void => {
        setCajas(0)
        const dialogSetting = document.getElementById("addPallet") as HTMLDialogElement;
        if (dialogSetting) {
            dialogSetting.close();
        }
    }
    return (
        <dialog id="addPallet" className="dialog-modal">
            <div>
                <h2>Sumar cajas al pallet {pallet + 1}</h2>
                <hr />
                <div>
                    <div>
                        <p>Tipo de suma</p>
                        <select value={tipo} className="defaultSelect" onChange={(e): void => setTipo(e.target.value)}>
                            <option value=""></option>
                            <option value="sumar">Sumar</option>
                            <option value="actualizar">Actualizar</option>
                        </select>
                    </div>
                    <label>
                        Numero de cajas:
                        <input
                            type="number"
                            value={cajas}
                            step={1}
                            min={1}
                            onChange={(e): void => setCajas(Number(e.target.value))}
                            className="defaultSelect" />
                    </label>
                </div>
                <div className="dialog-modal-botones-div">
                    <button className="defaulButtonAgree" onClick={handleGuardar} >Guardar</button>
                    <button className="defaulButtonError" onClick={closeModal} >Cerrar</button>
                </div>
            </div>
        </dialog>
    )
}
