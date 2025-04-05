/* eslint-disable prettier/prettier */

import { formatearFecha } from "@renderer/functions/fechas"
import { volanteCalidadType } from "@renderer/types/formulariosCalidad"
import { convertir_fecha_a_mes, convertir_fecha_a_semana, promedio, resultado_volante_calidad } from "../function"
import GraficoBarrasNoCalidad from "../graficos/GraficoBarrasNoCalidad"

type propsType = {
    data: volanteCalidadType[]
    agrupado: string
}

const headers = [
    "Fecha",
    "Unidades revisadas",
    "Novedades encontradas",
    "Resultado"
]

export default function NoCalidad(props: propsType): JSX.Element {
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
                                    {props.agrupado === '' || props.agrupado === 'dia' && <td>{formatearFecha(item.fecha)}</td>}
                                    {props.agrupado === 'semana' && <td>{convertir_fecha_a_semana(item.fecha)}</td>}
                                    {props.agrupado === 'mes' && <td>{convertir_fecha_a_mes(item.fecha)}</td>}
                                    <td>{item.unidades}</td>
                                    <td>{item.defectos}</td>
                                    <td>{
                                        resultado_volante_calidad(item.unidades, item.defectos) === -1 ?
                                            "No definido" : resultado_volante_calidad(item.unidades, item.defectos).toFixed(2)
                                    }%</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="item2">
                <div>
                    <h3>Sumatoria Unidades Revisadas:</h3>
                    <h3>{props.data.reduce((acu, item) => acu += item.unidades, 0).toFixed(0)}</h3>
                </div>
                <div>
                    <h3>Sumatoria Novedades Encontradas:</h3>
                    <h3>{props.data.reduce((acu, item) => acu += item.defectos, 0).toFixed(0)}</h3>
                </div>
                <div>
                    <h3>Promedio Unidades Revisadas:</h3>
                    <h3>{promedio(props.data, "unidades").toFixed(2)}</h3>
                </div>
                <div>
                    <h3>Promedio Novedades Encontradas:</h3>
                    <h3>{promedio(props.data, "defectos").toFixed(2)}</h3>
                </div>
            </div>

            <div className="item3">
                <GraficoBarrasNoCalidad data={props.data} agrupacion={props.agrupado} />
            </div>
        </div>
    )
}
