/* eslint-disable prettier/prettier */
import useAppContext from "@renderer/hooks/useAppContext"
import { insumosType } from "@renderer/types/insumos"
import { useEffect, useState } from "react"
import Tabla from "./components/Tabla";
import IngresarInsumo from "./components/IngresarInsumo";



export default function IngresoTipoInsumo(): JSX.Element {
    const { messageModal } = useAppContext();
    const [insumos, setInsumos] = useState<insumosType[]>()
    const [showNuevo, setShowNuevo] = useState<boolean>(false)

    useEffect(() => {
        obtenerData()
    }, [])
    
    const obtenerData = async (): Promise<void> => {
        try {
            const request = {
                action: "get_inventarios_insumos"
            }
            const response = await window.api.server2(request);
            if (response.status !== 200)
                throw new Error(`Code ${response.status}: ${response.message}`)
            setInsumos(response.data);
        } catch (err) {
            if (err instanceof Error) {
                messageModal("error", err.message)
            }
        }
    }
    const buttonHandle = (): void => {
        setShowNuevo(!showNuevo)
    }
    return (
        <div className="componentContainer">
            <div className="navBar"></div>
            <h2>Tipos de insumo</h2>
            <hr />
            <div className='filtroContainer'>
                <div className='div-filter-actions'>
                    <button onClick={buttonHandle}>
                        {showNuevo ? "volver" : "Ingresar tipo de insumo"}
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" ><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12 3c7.2 0 9 1.8 9 9s-1.8 9 -9 9s-9 -1.8 -9 -9s1.8 -9 9 -9z" /><path d="M15 12h-6" /><path d="M12 9v6" /></svg>
                    </button>
                </div>
            </div>
            {showNuevo ?
                <IngresarInsumo obtenerData={obtenerData} buttonHandle={buttonHandle} />
                :
                <Tabla obtenerData={obtenerData} data={insumos} />

            }
        </div>
    )
}
