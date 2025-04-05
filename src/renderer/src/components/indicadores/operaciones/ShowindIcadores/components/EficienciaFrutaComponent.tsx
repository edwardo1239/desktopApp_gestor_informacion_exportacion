/* eslint-disable prettier/prettier */

import { formatearFecha } from "@renderer/functions/fechas"
import { indicadoresType } from "@renderer/types/indicadoresType"
import { convertir_fecha_a_mes, convertir_fecha_a_semana, kilos_exportacion, porcentage_exportacion, promedio, sumatoria_kilos_exportacion, total_eficeincia_fruta } from "../function"
import GraficoBarrasEficienciaFruta from "../graficos/GraficoBarrasEficienciaFruta"

type propsType = {
    data: indicadoresType[]
    agrupado: string
}

const headers = [
    "Fecha",
    "Tipo Fruta",
    "Kilos Procesados",
    "Kilos Exportación",
    "Total"
]

export default function EficienciaFrutaComponent(props: propsType): JSX.Element {
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
                                    <td>{item.kilos_procesador?.toFixed(2) ?? ''}</td>
                                    <td>{kilos_exportacion(item)?.toFixed(2) ?? ''}</td>
                                    <td>{porcentage_exportacion(
                                        kilos_exportacion(item), item.kilos_procesador)?.toFixed(2) ?? '0'
                                    }%</td>

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
                    <h3>Sumatoria Kilos exportacion</h3>
                    <h3>{sumatoria_kilos_exportacion(props.data).toFixed(2)}</h3>
                </div>
                <div>
                    <h3>Promedio Kilos exportacion</h3>
                    {props.data.length > 0 &&
                        <h3>{(sumatoria_kilos_exportacion(props.data)/props.data.length).toFixed(2)}</h3>}
                </div>
                <div>
                    <h3>Rendimiento de la fruta:</h3>
                    <h3>{total_eficeincia_fruta(props.data).toFixed(2)}%</h3>
                </div>
            </div>
            <div className="item3">
                <GraficoBarrasEficienciaFruta data={props.data} agrupacion={props.agrupado} />
            </div>
        </div>
    )
}