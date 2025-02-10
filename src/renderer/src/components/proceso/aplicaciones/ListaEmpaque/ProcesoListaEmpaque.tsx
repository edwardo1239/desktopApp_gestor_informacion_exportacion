/* eslint-disable prettier/prettier */
import { createContext, useEffect, useState } from "react";
import GeneralInfo from "./components/GeneralInfo";
import { contenedoresType } from "@renderer/types/contenedoresType";
import useAppContext from "@renderer/hooks/useAppContext";
import './css/styles.css'
import { predioType } from "./types";
import Pallets from "./components/Pallets";
import Resumen from "./components/Resumen";
import ConfirmacionModal from "@renderer/messages/ConfirmacionModal";
import ListaEmpaquePredios from "./components/ListaEmpaquePredios";


export const contenedoresContext = createContext<contenedoresType[] | undefined>(undefined)
export const contenedorSeleccionadoContext = createContext<string | undefined>(undefined)
export const palletSeleccionadoContext = createContext<number>(-1)
export const loteProcesandoContext = createContext<predioType | undefined>(undefined)

export default function ProcesoListaEmpaque(): JSX.Element {
    const { messageModal } = useAppContext();
    const [contenedores, setContenedores] = useState<contenedoresType[]>();
    const [loteProcesando, setLoteProcesando] = useState<predioType>();
    const [contenedorSeleccionado, setContenedorSeleccionado] = useState<string>();
    const [palletSeleccionado, setPalletSeleccionado] = useState<number>(0);
    const [showResumen, setShowResumen] = useState<boolean>(false)
    const [showPredios, setShowPredios] = useState<boolean>(false)
    const [showConfirmacion, setShowConfirmacion] = useState<boolean>(false)
    const [confirm, setConfirm] = useState<boolean>(false)
    const [message, setMessage] = useState<string>('')

    useEffect(() => {
        obtenerDataContenedores()
        obtenerPredioProcesando()
        window.api.reload(() => {
            obtenerDataContenedores()
            obtenerPredioProcesando()
        });
        return () => {
            window.api.removeReload()
        }
    }, []);

    useEffect(() => {
        const _id = localStorage.getItem("proceso-listaempaque-id-contenedor")
        if (_id && contenedores !== undefined) {
            const contenedorSeleccionado = contenedores?.find(item => item._id === _id);

            if (contenedorSeleccionado) {
                setContenedorSeleccionado(contenedorSeleccionado._id)
                localStorage.removeItem("proceso-listaempaque-id-contenedor")
            }
        }
    }, [contenedores])

    useEffect(() => {
        if (confirm) {
            cerrarContenedor()
            setConfirm(false)
        }
    }, [confirm]);
    const obtenerDataContenedores = async (): Promise<void> => {
        try {
            const request = { action: 'obtener_contenedores_listaDeEmpaque' }
            const response = await window.api.server2(request)
            if (response.status !== 200)
                throw new Error(`Code ${response.status}: ${response.message}`)
            setContenedores(response.data)
        } catch (err) {
            if (err instanceof Error) {
                messageModal("error", err.message)
            }
        }
    }
    const obtenerPredioProcesando = async (): Promise<void> => {
        try {
            const request = { action: 'obtener_predio_listaDeEmpaque' }
            const response = await window.api.server2(request)
            if (response.status !== 200)
                throw new Error(`Code ${response.status}: ${response.message}`)
            setLoteProcesando(response.data)
        } catch (err) {
            if (err instanceof Error) {
                messageModal("error", err.message)
            }
        }
    }

    const handleShowResumen = (): void => {
        setShowResumen(!showResumen)
    }
    const handleShowPredios = (): void => {
        setShowPredios(!showPredios)
    }
    const handleCerrarContenedor = (): void => {
        setShowConfirmacion(true)
        setMessage("¿Desea cerrar el contenedor?")
    }

    const cerrarContenedor = async (): Promise<void> => {
        try {
            if (contenedorSeleccionado === undefined || contenedorSeleccionado === '')
                throw new Error("Error: contenedor no seleccionado")
            const request = {
                action: 'cerrar_contenedor',
                _id: contenedorSeleccionado
            }
            const response = await window.api.server2(request);
            if (response.status !== 200)
                throw new Error(`Code ${response.status}: ${response.message}`)
            messageModal("success", "Contenedor cerrado")
        } catch (err) {
            if (err instanceof Error) {
                messageModal("error", err.message)
            }
        }
    }



    return (
        <div className="componentContainer">
            <div className="navBar"></div>
            <h2>Lista de empaque</h2>
            <hr />
            <contenedoresContext.Provider value={contenedores}>
                <contenedorSeleccionadoContext.Provider value={contenedorSeleccionado}>
                    <palletSeleccionadoContext.Provider value={palletSeleccionado}>
                        <loteProcesandoContext.Provider value={loteProcesando}>
                            <GeneralInfo
                                showPredios={showPredios}
                                handleShowPredios={handleShowPredios}
                                contenedorSeleccionado={contenedorSeleccionado}
                                handleCerrarContenedor={handleCerrarContenedor}
                                showResumen={showResumen}
                                handleShowResumen={handleShowResumen}
                                setPalletSeleccionado={setPalletSeleccionado}
                                setContenedorSeleccionado={setContenedorSeleccionado}
                                loteProcesando={loteProcesando}
                                contenedores={contenedores}
                            />
                            {showResumen && <Resumen />}
                            {showPredios && <ListaEmpaquePredios />}

                            {!showResumen && !showPredios && <Pallets
                                obtenerDataContenedores={obtenerDataContenedores}
                                setPalletSeleccionado={setPalletSeleccionado} />
                            }
                            {showConfirmacion &&
                                <ConfirmacionModal
                                    message={message}
                                    setConfirmation={setConfirm}
                                    setShowConfirmationModal={setShowConfirmacion} />}
                        </loteProcesandoContext.Provider>
                    </palletSeleccionadoContext.Provider>
                </contenedorSeleccionadoContext.Provider>
            </contenedoresContext.Provider>
        </div>
    )
}
