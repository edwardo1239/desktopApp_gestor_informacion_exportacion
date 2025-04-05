/* eslint-disable prettier/prettier */
import { createContext, useEffect, useState } from "react";
import GeneralInfo from "./components/GeneralInfo";
import { contenedoresType } from "@renderer/types/contenedoresType";
import useAppContext from "@renderer/hooks/useAppContext";
import './css/styles.css'
    ;
import Resumen from "./components/Resumen";
import ConfirmacionModal from "@renderer/messages/ConfirmacionModal";
import ListaEmpaquePredios from "./components/ListaEmpaquePredios";
import { obtenerDataContenedores, obtenerPredioProcesando } from "./services/request";
import { historialLotesType } from "@renderer/types/lotesType";
import Pallets from "./components/Pallets";


export const contenedoresContext = createContext<contenedoresType[] | undefined>(undefined)
export const contenedorSeleccionadoContext = createContext<string | undefined>(undefined)
export const loteselectedContext = createContext<historialLotesType | undefined>(undefined)

export default function ProcesoListaEmpaque(): JSX.Element {
    const { messageModal, eventoServidor, triggerServer } = useAppContext();
    const [contenedores, setContenedores] = useState<contenedoresType[]>();
    const [lotes, setLotes] = useState<historialLotesType[]>();
    const [loteSeleccionado, setLoteSeleccionado] = useState<historialLotesType>()
    const [contenedorSeleccionado, setContenedorSeleccionado] = useState<string>();
    const [showResumen, setShowResumen] = useState<boolean>(false)
    const [showPredios, setShowPredios] = useState<boolean>(false)
    const [showConfirmacion, setShowConfirmacion] = useState<boolean>(false)
    const [confirm, setConfirm] = useState<boolean>(false)
    const [message, setMessage] = useState<string>('')

    useEffect(() => {
        if (
            eventoServidor === 'lista_empaque_update'
        ) {
            obtenerDataContenedores(setContenedores)
        }
    }, [triggerServer])

    useEffect(() => {
        const fetchData = async (): Promise<void> => {
            try {
                await obtenerDataContenedores(setContenedores)
                await obtenerPredioProcesando(setLotes)

            } catch (err) {
                if (err instanceof Error) {
                    messageModal("error", err.message)
                }
            }
        }
        fetchData()

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
                    <loteselectedContext.Provider value={loteSeleccionado}>
                        <GeneralInfo
                            lotes={lotes}
                            setLoteSeleccionado={setLoteSeleccionado}
                            showPredios={showPredios}
                            handleShowPredios={handleShowPredios}
                            contenedorSeleccionado={contenedorSeleccionado}
                            handleCerrarContenedor={handleCerrarContenedor}
                            showResumen={showResumen}
                            handleShowResumen={handleShowResumen}
                            setContenedorSeleccionado={setContenedorSeleccionado}
                            contenedores={contenedores}
                        />
                        {showResumen && <Resumen />}
                        {showPredios && <ListaEmpaquePredios />}

                        {!showResumen && !showPredios && <Pallets />
                        }
                        {showConfirmacion &&
                            <ConfirmacionModal
                                message={message}
                                setConfirmation={setConfirm}
                                setShowConfirmationModal={setShowConfirmacion} />}
                    </loteselectedContext.Provider>
                </contenedorSeleccionadoContext.Provider>
            </contenedoresContext.Provider>
        </div>
    )
}
