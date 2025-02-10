/* eslint-disable prettier/prettier */
import { useEffect, useState } from "react"
import "../../../css/components.css"
import "./css/funcionesSistema.css"
import { contenedoresType } from "@renderer/types/contenedoresType"
import { requestContenedores, request_cerrar_contenedor } from "./functions/request"
import useAppContext from "@renderer/hooks/useAppContext"
import IngresarPallet from "./components/IngresarPallet"
export default function ActivarFunciones(): JSX.Element {
    const { messageModal } = useAppContext();
    const [contenedores, setContenedores] = useState<contenedoresType[]>([])
    const [contenedorSeleccionado, setContenedorSeleccionado] = useState<contenedoresType>()
    const [cerrarContenedor, setCerrarContenedor] = useState<boolean>(false);

    useEffect((): void => {
        obtenerDatos();
    }, [])

    const obtenerDatos = async (): Promise<void> => {
        try {
            const response = await window.api.server2(requestContenedores)
            if (response.status !== 200) {
                throw new Error(response.message);
            }
            setContenedores(response.data)
        } catch (e) {
            if (e instanceof Error) {
                messageModal("error", e.message)
            }
        }
    }
    const handle_cerrar_contenedor = async (): Promise<void> => {
        try {
            const req = request_cerrar_contenedor(contenedorSeleccionado?._id, cerrarContenedor)
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
        <div className="componentContainer">
            <div className='navBar'></div>
            <h2>Funciones</h2>
            <div className='funciones-div-tipoProceso'>
                <h3>Cerrar contenedor</h3>
                <select
                    className='defaultSelect'
                    onChange={(e): void => setContenedorSeleccionado(contenedores.find(item => item._id === e.target.value))}>
                    <option value="">Contenedores</option>
                    {contenedores.map(item => (
                        <option key={item._id} value={item._id}>
                            {`${item.numeroContenedor} -- ${typeof item.infoContenedor?.clienteInfo === 'object' ? item.infoContenedor.clienteInfo.CLIENTE : ''}`}
                        </option>
                    ))}
                </select>
                <div className="funciones-div-tipoProceso-div-action">
                    <select
                        className='defaultSelect'
                        onChange={(e): void => setCerrarContenedor(Boolean(e.target.value))}>
                        <option value={"false"}>Abrir</option>
                        <option value={"true"}>Cerrar</option>
                    </select>
                    <button className='defaulButtonAgree' onClick={handle_cerrar_contenedor}>
                        Aceptar
                    </button>
                </div>
            </div>
            <IngresarPallet constenedores={contenedores} />
        </div>
    )
}
