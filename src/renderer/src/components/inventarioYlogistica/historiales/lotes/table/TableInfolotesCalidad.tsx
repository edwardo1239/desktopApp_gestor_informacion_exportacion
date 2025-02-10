/* eslint-disable prettier/prettier */

import { filtroColumnasCalidadType } from "../type/types"
import { KEY_FILTRO_COL_CALIDAD } from "../functions/constantes"
import { lotesType } from "@renderer/types/lotesType"
import { formatearFecha } from "@renderer/functions/fechas";

type propsType = {
    data: lotesType[]
    columnVisibility: filtroColumnasCalidadType
}
export default function TableInfolotesCalidad(props: propsType): JSX.Element {
    return (
        <div className="table-container">
            <table className="table-main">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre del predio</th>
                        <th>Fecha ingreso</th>
                        <th>Fecha calidad interna</th>
                        <th>Fecha clasificación descarte</th>
                        <th>Tipo de fruta</th>
                        {Object.keys(props.columnVisibility).map(item => {
                            if (props.columnVisibility[item]) {
                                return (
                                    <th key={item}>
                                        {KEY_FILTRO_COL_CALIDAD[item]}
                                    </th>
                                )
                            } else {
                                return null
                            }
                        })}
                    </tr>
                </thead>
                <tbody>
                    {Array.isArray(props.data) && props.data.map((lote, index) => {
                        if (Object.prototype.hasOwnProperty.call(lote, 'calidad') && Object.prototype.hasOwnProperty.call(lote.calidad, 'calidadInterna')) {
                            return (
                                <tr className={`${index % 2 === 0 ? 'fondo-par' : 'fondo-impar'}`} key={index}>
                                    <td>{lote.enf}</td>
                                    <td>{lote.predio?.PREDIO}</td>
                                    <td>{formatearFecha(lote.fechaIngreso)}</td>

                                    <td>
                                        {lote.calidad && lote.calidad.calidadInterna &&
                                            formatearFecha(lote.calidad.calidadInterna ? lote.calidad.calidadInterna.fecha : '')
                                        }
                                    </td>
                                    <td>
                                        {lote.calidad && lote.calidad.clasificacionCalidad &&
                                            formatearFecha(
                                                lote.calidad.clasificacionCalidad && lote.calidad.clasificacionCalidad.fecha ? 
                                                lote.calidad.clasificacionCalidad.fecha : ''
                                            )
                                        }
                                    </td>
                                    <td>{lote.tipoFruta}</td>
                                    {Object.keys(props.columnVisibility).map((item, index) => {
                                        if (props.columnVisibility[item]) {
                                            if (['acidez', 'brix', 'ratio'].includes(item)) {
                                                return (
                                                    <td key={index + item}>
                                                        {lote.calidad &&
                                                            lote.calidad.calidadInterna &&
                                                            lote.calidad.calidadInterna[item] !== null ?
                                                            lote.calidad.calidadInterna[item].toFixed(2) : 0} %
                                                    </td>
                                                )
                                            } else {
                                                return (
                                                    <td key={index + item}>
                                                        {lote.calidad &&
                                                            lote.calidad.calidadInterna &&
                                                            lote.calidad.calidadInterna[item] !== null ?
                                                            lote.calidad.calidadInterna[item].toFixed(2) : 0} gr
                                                    </td>
                                                )
                                            }
                                        } else {
                                            return null
                                        }
                                    })}
                                </tr>
                            )
                        } else {
                            return null
                        }

                    })}
                </tbody>
            </table>
        </div>
    )
}
