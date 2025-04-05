/* eslint-disable prettier/prettier */

import useAppContext from "@renderer/hooks/useAppContext"
import { useEffect, useState } from "react";
import "./styles.css"
import ConfirmacionModal from "@renderer/messages/ConfirmacionModal";

export default function ConfiguracionSeriales(): JSX.Element {
    const { messageModal, setLoading } = useAppContext();
    const [cadenaEf1, setCadenaEf1] = useState<string>()
    const [serialEF1, setSerialEF1] = useState<string>()

    const [cadenaEf8, setCadenaEf8] = useState<string>()
    const [serialEF8, setSerialEF8] = useState<string>()

    const [cadenaCelifrut, setCadenaCelifrut] = useState<string>()
    const [serialCelifrut, setSerialCelifrut] = useState<string>()

    const [showConfirmacion, setShowConfirmacion] = useState<boolean>(false)
    const [confirm, setConfirm] = useState<boolean>(false)
    const [message, setMessage] = useState<string>('')
    const [requestType, setRequestType] = useState<string>('')


    useEffect(() => {
        const fetchData = async (): Promise<void> => {
            try {
                await obtenerEF1()
                await obtenerEF8()
                await obtenerCelifrut()
            } catch (err) {
                if (err instanceof Error)
                    messageModal("error", err.message)
            }
        }
        fetchData()
    }, [])

    useEffect(()=>{
        if (confirm) {
            if (requestType === 'EF1')
                modificarEF1()
            else if (requestType === "EF8")
                modificarEF8()
            else if (requestType === "Celifrut")
                modificarCelifrut()
            setConfirm(false)
        }
    },[confirm])

    const obtenerEF1 = async (): Promise<void> => {
        const request = {
            action: "get_sistema_parametros_configuracionSeriales_EF1"
        }
        const response = await window.api.server2(request)
        if (response.status !== 200)
            throw new Error(`Code ${response.status}: ${response.message}`)

        const cadena = response.data.slice(0, 8)
        const codigo = response.data.slice(8)
        setCadenaEf1(cadena)
        setSerialEF1(codigo)
    }
    const modificarEF1 = async (): Promise<void> => {
        try {
            setLoading(true)
            if (!(typeof serialEF1 === "string" && !isNaN(Number(serialEF1))))
                throw new Error("El serial del EF1 debe ser un numero")
            const request = {
                action: "put_sistema_parametros_configuracionSeriales_EF1",
                serial: Number(serialEF1)
            }
            const response = await window.api.server2(request)
            if (response.status !== 200)
                throw new Error(`Code ${response.status}: ${response.message}`)
            messageModal("success", "Modificado con exito");

        } catch (err) {
            if (err instanceof Error)
                messageModal("error", err.message)
        } finally {
            setLoading(false)
        }
    }
    const obtenerEF8 = async (): Promise<void> => {
        const request = {
            action: "get_sistema_parametros_configuracionSeriales_EF8"
        }
        const response = await window.api.server2(request)
        if (response.status !== 200)
            throw new Error(`Code ${response.status}: ${response.message}`)

        const cadena = response.data.slice(0, 8)
        const codigo = response.data.slice(8)
        setCadenaEf8(cadena)
        setSerialEF8(codigo)
    }
    const modificarEF8 = async (): Promise<void> => {
        try {
            setLoading(true)
            if (!(typeof serialEF1 === "string" && !isNaN(Number(serialEF1))))
                throw new Error("El serial del EF8 debe ser un numero")
            const request = {
                action: "put_sistema_parametros_configuracionSeriales_EF8",
                serial: Number(serialEF8)
            }
            const response = await window.api.server2(request)
            if (response.status !== 200)
                throw new Error(`Code ${response.status}: ${response.message}`)
            messageModal("success", "Modificado con exito");

        } catch (err) {
            if (err instanceof Error)
                messageModal("error", err.message)
        } finally {
            setLoading(false)
        }
    }
    const obtenerCelifrut = async (): Promise<void> => {
        const request = {
            action: "get_sistema_parametros_configuracionSeriales_Celifrut"
        }
        const response = await window.api.server2(request)
        if (response.status !== 200)
            throw new Error(`Code ${response.status}: ${response.message}`)

        const cadena = response.data.slice(0, 9)
        const codigo = response.data.slice(9)
        setCadenaCelifrut(cadena)
        setSerialCelifrut(codigo)
    }
    const modificarCelifrut = async (): Promise<void> => {
        try {
            setLoading(true)
            if (!(typeof serialEF1 === "string" && !isNaN(Number(serialEF1))))
                throw new Error("El serial de Celifrut debe ser un numero")
            const request = {
                action: "put_sistema_parametros_configuracionSeriales_Celifrut",
                serial: Number(serialCelifrut)
            }
            const response = await window.api.server2(request)
            if (response.status !== 200)
                throw new Error(`Code ${response.status}: ${response.message}`)
            messageModal("success", "Modificado con exito");

        } catch (err) {
            if (err instanceof Error)
                messageModal("error", err.message)
        } finally {
            setLoading(false)
        }
    }

    const handleguardar = (data): void => {
        setShowConfirmacion(true)
        setMessage(`¿Desea Modificar el serial ${data}?`)
        setRequestType(data)
    }

    return (
        <div>
            <div className="navBar"></div>
            <h2>Seriales del sistema</h2>
            <hr />

            <div className="cards-container">

                <div className="card">
                    <div className="card-header">
                        Identificador: <span className="info-cadena">{cadenaEf1}</span>
                    </div>
                    <div className="card-body">
                        <label htmlFor="serialEF1">Serial:</label>
                        <input
                            id="serialEF1"
                            type="text"
                            value={serialEF1}
                            onChange={(e): void => setSerialEF1(e.target.value)}
                        />
                    </div>
                    <div className="card-footer">
                        <button onClick={():void => handleguardar("EF1")}>Guardar</button>
                    </div>
                </div>

                <div className="card">
                    <div className="card-header">
                        Identificador: <span className="info-cadena">{cadenaEf8}</span>
                    </div>
                    <div className="card-body">
                        <label htmlFor="serialEF1">Serial:</label>
                        <input
                            id="serialEF9"
                            type="text"
                            value={serialEF8}
                            onChange={(e): void => setSerialEF8(e.target.value)}
                        />
                    </div>
                    <div className="card-footer">
                        <button onClick={():void => handleguardar("EF8")}>Guardar</button>
                    </div>
                </div>

                <div className="card">
                    <div className="card-header">
                        Identificador: <span className="info-cadena">{cadenaCelifrut}</span>
                    </div>
                    <div className="card-body">
                        <label htmlFor="serialEF1">Serial:</label>
                        <input
                            id="serialEF9"
                            type="text"
                            value={serialCelifrut}
                            onChange={(e): void => setSerialCelifrut(e.target.value)}
                        />
                    </div>
                    <div className="card-footer">
                        <button onClick={():void => handleguardar("Celifrut")}>Guardar</button>
                    </div>
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
