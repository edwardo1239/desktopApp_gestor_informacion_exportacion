/* eslint-disable prettier/prettier */

import { formatearFecha } from "@renderer/functions/fechas"
import { indicadoresType } from "@renderer/types/indicadoresType"
import { convertir_fecha_a_mes, convertir_fecha_a_semana, eficiencia_operativa, promedio, total_eficiencia_operativa } from "../function"
import GraficoBarrasEficienciaOperativa from "../graficos/GraficoBarrasEficienciaOperativa"

type propsType = {
    data: indicadoresType[]
    agrupado: string
}

const headers = [
    "Fecha",
    "Tipo Fruta",
    "Horas hombre",
    "Kilos Procesados",
    "Meta Kilos Procesar",
    "Total"
]

export default function EficienciaOperativaComponent(props:propsType): JSX.Element {
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
                                    {props.agrupado === '' || props.agrupado === 'dia' && <td>{formatearFecha(item.fecha_creacion)}</td>}
                                    {props.agrupado === 'semana' && <td>{convertir_fecha_a_semana(item.fecha_creacion)}</td>}
                                    {props.agrupado === 'mes' && <td>{convertir_fecha_a_mes(item.fecha_creacion)}</td>}
                                    <td>{item.tipo_fruta.reduce((acu, item) => acu += item + ' ', '')}</td>
                                    <td>{item.total_horas_hombre?.toFixed(2) ?? ''}</td>
                                    <td>{item.kilos_procesador?.toFixed(2) ?? ''}</td>
                                    <td>{item.meta_kilos_procesados?.toFixed(2) ?? ''}</td>
                                    <td>{eficiencia_operativa(
                                        item.kilos_procesador,
                                        item.meta_kilos_procesados,
                                        item.total_horas_hombre
                                    ).toFixed(2)}%</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="item2">
                <div>
                    <h3>Sumatoria Kilos procesados:</h3>
                    <h3>{props.data.reduce((acu, item) => acu += item.kilos_procesador, 0).toFixed(2)}</h3>
                </div>
                <div>
                    <h3>Promedio kilos procesados</h3>
                    <h3>{promedio(props.data, "kilos_procesador").toFixed(2)}</h3>
                </div>
                <div>
                    <h3>Total eficiencia operativa</h3>
                    <h3>{total_eficiencia_operativa(props.data).toFixed(2)}%</h3>
                </div>
            </div>
            <div className="item3">
                <GraficoBarrasEficienciaOperativa agrupacion={props.agrupado} data={props.data} />
            </div>
        </div>
    )
}