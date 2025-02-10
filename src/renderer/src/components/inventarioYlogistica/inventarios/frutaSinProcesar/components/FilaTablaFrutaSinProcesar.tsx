/* eslint-disable prettier/prettier */

import { formatearFecha } from "@renderer/functions/fechas"
import { lotesType } from "@renderer/types/lotesType"
import { FaTruck } from "react-icons/fa6";
import { FaSquareParking } from "react-icons/fa6";
import { MdInventory2 } from "react-icons/md";
import { FcHighPriority } from "react-icons/fc";
import { PiNotePencilDuotone } from "react-icons/pi";
import { useState } from "react";
import { IoSaveSharp } from "react-icons/io5";
import { GiCancel } from "react-icons/gi";
import useAppContext from "@renderer/hooks/useAppContext";

type propsType = {
    index: number
    lote: lotesType
    clickLote: (e) => void
}

export default function FilaTablaFrutaSinProcesar(props: propsType): JSX.Element {
    const { messageModal } = useAppContext();
    const [modificarCanastillas, setModificarCanastillas] = useState<boolean>(false)
    const [canastillas, setCanastillas] = useState<string>()
    const change_de_camino = (id): void => {
        const dialogSetting = document.getElementById("change_state_de_camino") as HTMLDialogElement;
        if (dialogSetting) {
            dialogSetting.showModal();
        }
        props.clickLote(id)
    }
    const cahnge_to_inventario = (id): void => {
        const dialogSetting = document.getElementById("change_state_to_inventario") as HTMLDialogElement;
        if (dialogSetting) {
            dialogSetting.showModal();
        }
        props.clickLote(id)
    }
    const change_derogacion = (id): void => {
        const dialogSetting = document.getElementById("derogar_predio_modal") as HTMLDialogElement;
        if (dialogSetting) {
            dialogSetting.showModal();
        }
        props.clickLote(id)
    }
    const modificar_inventario_fruta_sin_procesar = async (): Promise<void> => {
        try {
            const request = {
                action: "put_inventarioLogistica_frutaSinProcesar_modificar_canastillas",
                _id: props.lote._id,
                canastillas: canastillas
            }
            const response = await window.api.server2(request);
            if (response.status !== 200)
                throw new Error(`Code ${response.status}: ${response.message}`)
            messageModal("success", "Invetario modificado con exitó!")
            setModificarCanastillas(false);
            setCanastillas(undefined)
        } catch (err) {
            if (err instanceof Error) {
                messageModal("error", err.message)
            }
        }
    }
    if (props.lote.not_pass) {
        return (
            <tr className={`${props.index % 2 === 0 ? 'fondo-par' : 'fondo-impar'}`} >
                <td>
                    <button
                        onClick={(): void => change_derogacion(props.lote._id)}
                        className="inventario-fruta-sin-procesar-boton-camion"
                    >
                        <FcHighPriority />
                    </button>
                </td>
                <td>
                    <p>Derogación</p>
                    <p>{props.lote.enf}</p>
                </td>
                <td>
                    {props.lote.predio.PREDIO}
                </td>
                <td>
                    {props.lote.predio.ICA.code}
                </td>
                <td>

                    {props.lote.fecha_ingreso_inventario && formatearFecha(props.lote.fecha_ingreso_inventario, true)}

                </td>
                <td>

                    {props.lote.fecha_creacion && formatearFecha(props.lote.fecha_creacion, true)}

                </td>
                <td>
                    {(props.lote?.inventario && props.lote.promedio) ? (props.lote.inventario * props.lote.promedio).toFixed(2) : 0}
                </td>
                <td>
                    {props.lote?.inventario && props.lote.inventario}
                </td>
                <td>
                    {props.lote.tipoFruta}
                </td>
                <td>
                    {props.lote.clasificacionCalidad}
                </td>
                <td>
                    {props.lote.observaciones}
                </td>
                <td>
                </td>

            </tr>
        )
    }
    if (props.lote.fecha_ingreso_inventario) {
        return (
            <tr className={`${props.index % 2 === 0 ? 'fondo-par' : 'fondo-impar'}`} >
                <td>
                    <button
                        onClick={(): void => props.clickLote(props.lote._id)}
                        className="inventario-fruta-sin-procesar-boton-camion"
                    >
                        <MdInventory2 color="#7d9f3a" fontSize={24} />
                    </button>

                </td>
                <td>
                    {props.lote.enf}
                </td>
                <td>
                    {props.lote.predio && props.lote.predio.PREDIO}
                </td>
                <td>
                    {props.lote.predio && props.lote.predio.ICA.code}
                </td>
                <td>

                    {props.lote.fecha_ingreso_inventario && formatearFecha(props.lote.fecha_ingreso_inventario, true)}

                </td>
                <td>

                    {props.lote.fecha_creacion && formatearFecha(props.lote.fecha_creacion, true)}

                </td>
                <td>
                    {(props.lote?.inventario && props.lote.promedio) ? (props.lote.inventario * props.lote.promedio).toFixed(2) : 0}
                </td>


                {modificarCanastillas ?
                    <td>
                        <input
                            type="text"
                            onChange={(e): void => setCanastillas(e.target.value)} />
                    </td>
                    :
                    <td>{props.lote?.inventario && props.lote.inventario}</td>
                }


                <td>
                    {props.lote.tipoFruta}
                </td>
                <td>
                    {props.lote.clasificacionCalidad}
                </td>
                <td>
                    {props.lote.observaciones}
                </td>
                <td>
                    <td>
                        {!modificarCanastillas &&
                            <button
                                style={{ color: "blue" }}
                                onClick={(): void => setModificarCanastillas(true)}>
                                <PiNotePencilDuotone />
                            </button>}

                        {modificarCanastillas &&
                            <button onClick={modificar_inventario_fruta_sin_procesar} >
                                <IoSaveSharp />
                            </button>}
                        {modificarCanastillas &&
                            <button style={{ color: 'red' }}
                                onClick={(): void => {
                                    setModificarCanastillas(false)
                                }}
                            >
                                <GiCancel />
                            </button>}
                    </td>
                </td>
            </tr>
        )
    }
    if (!props.lote.fecha_ingreso_inventario && !props.lote.fecha_ingreso_patio) {
        return (
            <tr className={`${props.index % 2 === 0 ? 'fondo-par' : 'fondo-impar'}`} >
                <td>
                    <button
                        onClick={(): void => change_de_camino(props.lote._id)}
                        className="inventario-fruta-sin-procesar-boton-camion"
                    >
                        <FaTruck color="red" />
                    </button>
                </td>
                <td>
                    En camino...
                </td>
                <td>
                    {props.lote.predio.PREDIO}
                </td>
                <td>
                    {props.lote.predio.ICA.code}
                </td>
                <td>
                    <div>Fecha Estimada llegada:</div>
                    <div>{formatearFecha(props.lote.fecha_estimada_llegada, true)}</div>
                </td>
                <td>
                    {props.lote.kilos_estimados}
                </td>
                <td>
                    {props.lote.canastillas_estimadas}
                </td>
                <td>
                    {props.lote.tipoFruta}
                </td>
                <td>
                    {props.lote.clasificacionCalidad}
                </td>
                <td>
                    {props.lote.observaciones}
                </td>
                <td>
                </td>
            </tr>
        )
    }
    if (!props.lote.fecha_ingreso_inventario) {
        return (
            <tr className={`${props.index % 2 === 0 ? 'fondo-par' : 'fondo-impar'}`} >
                <td>
                    <button
                        onClick={(): void => cahnge_to_inventario(props.lote._id)}
                        className="inventario-fruta-sin-procesar-boton-camion"
                    >
                        <FaSquareParking color="orange" />
                    </button>
                </td>
                <td>
                    Espera descargue
                </td>
                <td>
                    {props.lote.predio.PREDIO}
                </td>
                <td>
                    {props.lote.predio.ICA.code}
                </td>
                <td>
                    <div>Fecha en espera recepción:</div>
                    <div>{formatearFecha(props.lote.fecha_ingreso_patio, true)}</div>
                </td>
                <td>
                    {props.lote.kilos_estimados}
                </td>
                <td>
                    {props.lote.canastillas_estimadas}
                </td>
                <td>
                    {props.lote.tipoFruta}
                </td>
                <td>
                    {props.lote.clasificacionCalidad}
                </td>
                <td>
                    {props.lote.observaciones}
                </td>
                <td>
                </td>

            </tr>
        )
    }


    return (
        <tr>


        </tr>
    )
}
