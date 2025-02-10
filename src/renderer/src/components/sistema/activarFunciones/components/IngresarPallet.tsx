/* eslint-disable prettier/prettier */

import { contenedoresType } from "@renderer/types/contenedoresType"
import { request_add_pallet_to_contenedor } from "../functions/request"
import { useState } from "react"
import useAppContext from "@renderer/hooks/useAppContext"

type propsType = {
    constenedores: contenedoresType[]
}
export default function IngresarPallet(props: propsType): JSX.Element {
    const { messageModal } = useAppContext();
    const [contenedorSeleccionado, setContenedorSeleccionado] = useState<contenedoresType>()

    const handle_add_pallet = async (): Promise<void> => {
        try {
            const req = request_add_pallet_to_contenedor(contenedorSeleccionado?._id)
            const response = await window.api.server2(req);
            if (response.status !== 200)
                messageModal("error", response.message)
            messageModal("success", "Contenedor cerrado con exito")
        } catch (e) {
            if (e instanceof Error) {
                messageModal("error", e.message)
            }
        }
    }
    return (
        <div className='funciones-div-tipoProceso'>
            <h3>Agregar pallet</h3>
            <select className='defaultSelect'
                onChange={(e): void => setContenedorSeleccionado(props.constenedores.find(item => item._id === e.target.value))}
            >
                <option value="">Contenedores</option>
                {props.constenedores.map(item => (
                    <option key={item._id} value={item._id}>
                        {`${item.numeroContenedor} -- ${typeof item.infoContenedor?.clienteInfo === 'object' ? item.infoContenedor.clienteInfo.CLIENTE : ''
                            }`}
                    </option>
                ))}
            </select>
            <div className="funciones-div-tipoProceso-div-action">
                <button className='defaulButtonAgree' onClick={handle_add_pallet}>
                    Agregar
                </button>
            </div>
        </div>
    )
}