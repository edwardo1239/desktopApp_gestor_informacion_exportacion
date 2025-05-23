/* eslint-disable prettier/prettier */
import { LimpiezaDiariaType } from "@renderer/types/limpieza_diaria"
import imagenCelifrut from "../../../../../assets/CELIFRUT.png"
import { limpieza_diaria } from '@renderer/constants/formSchema'
import { useEffect } from "react";
import { FcOk } from 'react-icons/fc'
import { FcCancel } from 'react-icons/fc'
import { ordensarDataImprimir } from "../ordenarData";
import { formatearFecha } from "@renderer/functions/fechas";

type propsType = {
    data: LimpiezaDiariaType | undefined
    close_info: () => void
}
export default function InfoFormularioLimpiezaDiaria(props: propsType): JSX.Element {

    useEffect(() => {

        window.api.Descargar(() => {
            if (props.data === undefined) return
            const dataOrdenada = ordensarDataImprimir(props.data)
            const data = JSON.stringify(dataOrdenada)
            window.api.crearDocumento(data)
        })
        return () => {
            window.api.removeReload()
        }
    }, [])
    if (props.data === undefined) {
        return (
            <div>No se ha seleccionado formulario</div>
        )
    }
    return (
        <div className="info-formulario-calidad-limpieza-diaria-container">
            <button className="defaulButtonAgree" onClick={props.close_info}>Regresar</button>
            <div className="info-formulario-calidad-limpieza-diaria-header">
                <img src={imagenCelifrut} />
                <h2>Limpieza Diaría</h2>
                <p>Codigo:PC-CAL-FOR-10
                    Versión: 03
                    Fecha:29/03/2022
                </p>
            </div>
            <hr />

            <div className="info-formulario-calidad-limpieza-diaria-fecha-id">
                <h3>{props.data.ID}</h3>
                <h3>{formatearFecha(props.data.fechaInicio)}</h3>
            </div>
            <hr />

            <div>
                {Object.entries(limpieza_diaria).map(([key, value]) => (
                    <div key={key} className="info-formulario-calidad-limpieza-area-container">
                        <p>{key}</p>
                        <div className="info-formulario-calidad-limpieza-item-container">
                            {value.map(item => (
                                <div key={item.key}>
                                    <p>{item.label}</p>
                                    <div className="info-formulario-calidad-limpieza-item-data-container">
                                        <div className="info-formulario-calidad-limpieza-item-data-status">
                                            <p>Cumple:</p>
                                            <p>
                                                {(props.data && props.data[key] && props.data[key][item.key])
                                                    ?
                                                    props.data[key][item.key].status ? <FcOk /> : <FcCancel />
                                                    : "N/A"}
                                            </p>
                                        </div>
                                        <div >
                                            <p>Observaciones:</p>
                                            <p className="info-formulario-calidad-limpieza-item-data-observaciones">
                                                {(props.data && props.data[key] && props.data[key][item.key])
                                                    ?
                                                    props.data[key][item.key].observaciones
                                                    : "N/A"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}