/* eslint-disable prettier/prettier */

import { formatearFecha } from "@renderer/functions/fechas"
import { convertir_fecha_a_mes, convertir_fecha_a_semana, outTypeLoteIndicadores, porcentage_ciclo_predio, promedio } from "../function"
import GraficoTiempoCicloLotePredio from "../graficos/GraficoTiempoCicloLotePredio"

type propsType = {
    data: outTypeLoteIndicadores[]
    agrupado: string
}

const headers = [
    "Fecha Inicio",
    "Fecha Fin",
    "Horas",
    "Total"
]

export default function TiempoCicloPredios(props: propsType): JSX.Element {
    return (
        <div className="indicadores-opearciones-eficiencia_operativa-comntainer">
            <div className="item1">
                <div className="table-container">
                    <table className="table-main">
                        <thead>
                            <tr>
                                {headers.map(item => <th key={item}>{item}</th>)}
                            </tr>
                        </thead>
                        <tbody>
                            {props.data.map((item, index) => (
                                <tr key={index} className={`${index % 2 === 0 ? 'fondo-par' : 'fondo-impar'}`}>
                                    {props.agrupado === '' || props.agrupado === 'dia' && <td>{formatearFecha(item.fecha_ingreso)}</td>}
                                    {props.agrupado === 'semana' && <td>{convertir_fecha_a_semana(item.fecha_ingreso)}</td>}
                                    {props.agrupado === 'mes' && <td>{convertir_fecha_a_mes(item.fecha_ingreso)}</td>}

                                    {props.agrupado === '' || props.agrupado === 'dia' && <td>{formatearFecha(item.fecha_fin)}</td>}
                                    {props.agrupado === 'semana' && <td>{convertir_fecha_a_semana(item.fecha_fin)}</td>}
                                    {props.agrupado === 'mes' && <td>{convertir_fecha_a_mes(item.fecha_fin)}</td>}

                                    <td>{item.total_dias.toFixed(2)}</td>
                                    <td>
                                        {((): string | number => {
                                            const porcentaje = porcentage_ciclo_predio(item);
                                            return typeof porcentaje === "number" ? porcentaje.toFixed(2) + "%" : porcentaje;
                                        })()}
                                    </td>

                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="item2">

                <div>
                    <h3>Promedio Horas</h3>
                    <h3>{promedio(props.data, "total_dias").toFixed(2)}</h3>
                </div>
                <div>
                    <h3>Porcentaje Horas</h3>
                    <h3>
                        {(((24 / promedio(props.data, "total_dias")|| 0.000000000000000000001)) 
                            * 100).toFixed(2)}%</h3>
                </div>

            </div>
            <div className="item3">
                <GraficoTiempoCicloLotePredio data={props.data} agrupacion={props.agrupado} />
            </div>
        </div>
    )
}