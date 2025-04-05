/* eslint-disable prettier/prettier */
import { dataCalidadInterna } from "@renderer/constants/calidadDefectos"
import useAppContext from "@renderer/hooks/useAppContext"
import { lotesType } from "@renderer/types/lotesType"
import { useEffect, useState } from "react"
import '../css/informeObservaciones.css'
type propsType = {
    loteSeleccionado: lotesType
}
export default function ViewInformeObservaciones(props: propsType): JSX.Element {
    if(props.loteSeleccionado.calidad?.clasificacionCalidad === undefined){
        return(
            <div>Lote sin clasificación descarte...</div>
        )
    }
    const { messageModal } = useAppContext();
    const [dataObservaciones, setDataObservaciones] = useState();
    const [observaciones, setObservaciones] = useState<string[]>([]);
    useEffect(() => {
        obtenerObservacionesCalidad()
        seleccionarObservaciones()
    }, [])
    const obtenerObservacionesCalidad = async (): Promise<void> => {
        try {
            const request = { action: "get_calidad_informes_observacionesCalidad" }
            const response = await window.api.server2(request)
            if (response.status !== 200) throw new Error(`Code ${response.status}: ${response.message}`);
            setDataObservaciones(response.data)
        } catch (err) {
            if (err instanceof Error) {
                messageModal("error", `${err.message}`)
            }
        }
    }
    const seleccionarObservaciones = (): void => {
        const descarte = { ...props.loteSeleccionado.descarteEncerado };

        if (props.loteSeleccionado.descarteLavado) {
            Object.entries(props.loteSeleccionado.descarteLavado).forEach(([key, value]) => {
                if (Object.prototype.hasOwnProperty.call(descarte, key)) {
                    descarte[key] += value;
                } else {
                    descarte[key] = value;
                }
            });
        }
        if (props.loteSeleccionado.calidad && props.loteSeleccionado.calidad?.clasificacionCalidad) {
            Object.entries(props.loteSeleccionado.calidad.clasificacionCalidad).forEach(([key, value]) => {
                const descarteGeneral = descarte.descarteGeneral ?? 0;
                if (typeof value === 'number') {
                    descarte[key] = value * descarteGeneral;
                } else {
                    console.warn(`descarte.descarteGeneral is undefined or not a number. Skipping calculation for key ${key}.`);
                }
            })
        }
        delete descarte.descarteGeneral
        // Convertir el objeto a una matriz de entradas
        const entries = Object.entries(descarte);

        // Ordenar las entradas por el valor en orden descendente
        const sortedEntries = entries.sort((a, b) => b[1] - a[1]);

        // Obtener las claves de los 4 valores más grandes
        const top4Keys = sortedEntries.slice(0, 4).map(entry => entry[0]);
        setObservaciones(top4Keys)
    }
    return (
        <div>
            <div className="informe-calida-lote-div-calidad-interna">
                {props.loteSeleccionado && props.loteSeleccionado.calidad && props.loteSeleccionado.calidad?.calidadInterna &&
                    Object.entries(dataCalidadInterna).map(([key, value]) => {
                        if(key === 'zumo'){
                            if(props.loteSeleccionado.calidad?.calidadInterna !== undefined){
                                return(
                                    <div key={key}>
                                    <h4>{value}:</h4>
                                    <p>{
                                    props.loteSeleccionado.calidad?.calidadInterna?.peso !== 0 ?
                                    (
                                        (props.loteSeleccionado.calidad?.calidadInterna.zumo 
                                        / 
                                        props.loteSeleccionado.calidad?.calidadInterna?.peso) * 100).toFixed(2) + '%'
                                            :
                                            "NaN"
                                    }</p>
                                </div>
                                )
                            } else {
                                return null
                            }
                        } else if(
                            props.loteSeleccionado && props.loteSeleccionado.calidad?.calidadInterna &&
                            Object.prototype.hasOwnProperty.call(
                            props.loteSeleccionado.calidad?.calidadInterna, key
                        )){
                            return (
                                <div key={key}>
                                    <h4>{value}:</h4>
                                    <p>{props.loteSeleccionado.calidad?.calidadInterna?.[key].toFixed(2)}</p>
                                </div>
                            )
                        } else {
                            return(
                                <div key={value}>
                                    <h4>{value}</h4>
                                    <p>{key}</p>
                                </div>
                            )
                        }
                    })}
            </div>
            <div className="informe-calida-lote-div-observaciones">
                {dataObservaciones && observaciones.map(item => (
                    <p key={item}>{dataObservaciones[item]}</p>
                ))}
            </div>
        </div>
    )
}