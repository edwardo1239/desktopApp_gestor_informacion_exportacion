/* eslint-disable prettier/prettier */
import { datosExportacion } from "../types/type"

type propsType = {
    data: datosExportacion
}
export default function TableInfo(props: propsType): JSX.Element {
    return (
        <table className="table-main-informe-proveedor" >
            <thead>
                <tr>
                    <th>Semana</th>
                    <th>Kilos procesados</th>
                    <th>Kilos exportación</th>
                    <th>Resultados</th>
                </tr>
            </thead>
            <tbody>
                {Object.keys(props.data).map((semana, index) => (
                    <tr key={semana} className={`${index % 2 === 0 ? 'fondo-par' : 'fondo-impar'}`} >
                        <td>Semana {semana}</td>
                        <td>{props.data[semana].kilosProcesados.toLocaleString('es-ES')}Kg</td>
                        <td>{props.data[semana].kilosExportacion.toLocaleString('es-ES')}Kg</td>
                        <td>{
                            ((props.data[semana].kilosExportacion / props.data[semana].kilosProcesados) * 100).toLocaleString('es-ES')
                        }%</td>

                    </tr>
                ))}
            </tbody>
        </table>
    )
}