/* eslint-disable prettier/prettier */

import { contenedoresType } from "@renderer/types/contenedoresType"

type predioType = {
    _id: string,
    enf: string,
    nombrePredio: string,
    predio: string,
    tipoFruta: string | undefined
};

type propsType = {
    contenedores: contenedoresType[] | undefined
    loteProcesando: predioType | undefined
    setContenedorSeleccionado: (e: string) => void
    setPalletSeleccionado: (e: number) => void
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
        props.setPalletSeleccionado(0)
    }
    return (
        <div className="proces-listaempaque-opciones">
            <div className="filtroContainer">
                <label>
                    <p>Contenedores</p>
                    <select onChange={handleContenedor} value={props.contenedorSeleccionado} >
                        <option value={undefined}>{}</option>
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
                {props.loteProcesando !== undefined &&
                    <div className="proceso-lista-empaque-info-predio-actual">
                        <h3>Predio Procesando:</h3>
                        <div>
                            <h5>{props.loteProcesando.enf}</h5>
                            <h5>{props.loteProcesando.nombrePredio}</h5>
                            <h5>{props.loteProcesando.tipoFruta}</h5>
                        </div>
                    </div>
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
