/* eslint-disable prettier/prettier */
import { useEffect, useState } from "react";
import "./css/styles.css"
import useAppContext from "@renderer/hooks/useAppContext";
import ConfirmacionModal from "@renderer/messages/ConfirmacionModal";

const request_EF1 = {
    collection: 'variablesDesktop',
    action: 'obtenerEF1',
    query: 'variablesDelProceso'
}


export default function ModificarSeriales(): JSX.Element {
    const { messageModal } = useAppContext();
    const [enf, setEnf] = useState(0)
    const [showConfirmacion, setShowConfirmacion] = useState<boolean>(false)
    const [confirm, setConfirm] = useState<boolean>(false)
    const [message, setMessage] = useState<string>('')

    const handleEliminar = (): void => {
        setShowConfirmacion(true)
        setMessage("¿Desea modificar el serial?")
    }
    const obtenerEF1 = async (): Promise<void> => {
        const enf = await window.api.server2(request_EF1);
        setEnf(enf.enf);
    }
    const modificarSerialEF1 = async (): Promise<void> => {
        try {
            const request = {
                data: enf,
                collection: 'variablesDesktop',
                action: 'modificar_sistema',
                query: 'modificar_serial_ef1',
            }
            const response = await window.api.server2(request)
            if(response.status !== 200)
                throw new Error(response.message)
            console.log(response)
            messageModal("success","Serial modificado con exito")

        } catch (e) {
            if (e instanceof Error) {
                messageModal("error", `${e.message}`)
            }
        }
    }
    useEffect(() => {
        obtenerEF1()
    }, [])
    useEffect(() => {
        if (confirm) {
            modificarSerialEF1()
            setConfirm(false)
        }
    }, [confirm]);
    return (
        <div className="componentContainer">
            <div className="navBar"></div>
            <h2>Modificar seriales</h2>
            <div className='habilitar-predios-proceso-div-tipoProceso'>
                <h3>EF1 Serial</h3>
                <input className="defaultSelect" type="number" value={enf} onChange={(e):void => setEnf(Number(e.target.value))}/>

                <div>
                    <button className='defaulButtonAgree' onClick={handleEliminar} >
                        Modificar
                    </button>
                </div>
            </div>
            {showConfirmacion &&
                <ConfirmacionModal
                    message={message}
                    setConfirmation={setConfirm}
                    setShowConfirmationModal={setShowConfirmacion} />}
        </div>
    )
}