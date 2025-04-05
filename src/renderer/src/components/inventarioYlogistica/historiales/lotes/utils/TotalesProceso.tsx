/* eslint-disable prettier/prettier */
import { lotesType } from "@renderer/types/lotesType"
import { filtroColumnasType } from "../type/types"
import { total_porcentaje_exportacion_calidad } from "../functions/functions"
import { KEYS_FILTROS_COL } from "../functions/constantes"
import { total_data, total_descarte, total_exportacion } from "@renderer/functions/resumenlotes"

type propsType = {
    columnVisibility: filtroColumnasType
    data: lotesType[]
}
export default function TotalesProceso(props: propsType): JSX.Element {
    return (
        <div className="componentContainer">
            <div className="lotes-proceso-promedios-div">
                <h3>Total</h3>
                <div className="lotes-proceso-promedios-div2">
                    {Object.keys(props.columnVisibility).map((item, index) => {
                        if (!props.columnVisibility[item]) {
                            return null
                        }
                        if (['deshidratacion', 'calibreExportacion', 'placa', 'observaciones', 'rendimiento', 'contenedores', 'promedio'].includes(item)) {
                            return null
                        }
                        if (['descarteLavado', 'descarteEncerado'].includes(item)) {
                            return (<p key={index}>{KEYS_FILTROS_COL[item]}: {total_descarte(props.data, item).toLocaleString()}</p>)
                        } else if (item === 'exportacion') {
                            return (<p key={index}>{KEYS_FILTROS_COL[item]}: {total_exportacion(props.data).toLocaleString()}</p>)
                        } else if(item === 'exportacionCalidad'){
                            return (<p key={index}>{KEYS_FILTROS_COL[item]}: {total_porcentaje_exportacion_calidad(props.data)} </p>)
                        } else {
                            return (<p key={index}>{KEYS_FILTROS_COL[item]}: {total_data(props.data, item).toLocaleString()}</p>)
                        }
                    })}
                </div>
            </div>
        </div>
    )
}