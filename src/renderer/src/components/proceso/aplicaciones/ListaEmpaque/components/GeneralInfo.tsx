/* eslint-disable prettier/prettier */

import { contenedoresType } from "@renderer/types/contenedoresType"
import { historialLotesType } from "@renderer/types/lotesType"



type propsType = {
    contenedores: contenedoresType[] | undefined
    lotes: historialLotesType[] | undefined
    setLoteSeleccionado: (e:historialLotesType) => void
    setContenedorSeleccionado: (e: string) => void
    handleShowResumen: () => void
    handleShowPredios: () => void
    showResumen: boolean
    showPredios: boolean
    handleCerrarContenedor: () => void
    contenedorSeleccionado: string | undefined
}


export default function GeneralInfo(props: propsType): JSX.Element {
    const handleContenedor = (e): void => {
        props.setContenedorSeleccionado(e.target.value)
    }
    const handleLote = (e): void => {
        if(props.lotes === undefined) return
        const id = e.target.value
        const lote = props.lotes.find(item => item._id === id)
        if(!lote) return
        props.setLoteSeleccionado(lote)
    }
    return (
        <div className="proces-listaempaque-opciones">
            <div className="filtroContainer">
                <label>
                    <p>Contenedores</p>
                    <select onChange={handleContenedor} value={props.contenedorSeleccionado} >
                        <option value={undefined}>{ }</option>
                        {props.contenedores && props.contenedores.map(contenedor => (
                            <option key={contenedor._id} value={contenedor._id}>
                                {contenedor.numeroContenedor +
                                    (typeof contenedor.infoContenedor.clienteInfo !== 'string' && contenedor.infoContenedor.clienteInfo.CLIENTE
                                        ? ' ' + contenedor.infoContenedor.clienteInfo.CLIENTE
                                        : ''
                                    )}
                            </option>
                        ))}
                    </select>
                </label>
                {
                    <label>
                        <p>Lotes</p>
                        <select onChange={handleLote} >
                            <option value={undefined}>{ }</option>
                            {props.lotes && props.lotes.map(lote => (
                                <option key={lote._id} value={lote._id}>
                                    {lote.documento.enf + " - " + lote.documento.predio.PREDIO}
                                </option>
                            ))}
                        </select>
                    </label>
                }
            </div>
            <div className="proces-listaempaque-opciones-botones">
                <button className="defaulButtonError" onClick={props.handleCerrarContenedor} >
                    Cerrar Contenedor
                </button>
                <button className="defaulButtonAgree" onClick={props.handleShowResumen}>
                    {props.showResumen ? "Lista de empaque" : "Resumen"}
                </button>
                <button className="defaulButtonAgree" onClick={props.handleShowPredios}>
                    {props.showPredios ? "Lista de empaque" : "Predios"}
                </button>
            </div>
        </div>
    )
}
