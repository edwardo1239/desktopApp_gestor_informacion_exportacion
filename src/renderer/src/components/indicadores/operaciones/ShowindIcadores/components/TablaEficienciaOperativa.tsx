/* eslint-disable prettier/prettier */
import { formatearFecha } from "@renderer/functions/fechas"
import { indicadoresType } from "@renderer/types/indicadoresType"
import { convertir_fecha_a_mes, convertir_fecha_a_semana, eficiencia_operativa } from "../function"
import '../styles.css'

const headers = [
    "Fecha",
    "Tipo Fruta",
    "Horas hombre",
    "Kilos Procesados",
    "Meta Kilos Procesar",
    "Total"
]

type propsType = {
    data: indicadoresType[]
    agrupado: string
}

export default function TablaEficienciaOperativa(props: propsType): JSX.Element {
    return (
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
    )
}