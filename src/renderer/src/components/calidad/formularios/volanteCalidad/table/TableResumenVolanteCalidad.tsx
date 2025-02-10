/* eslint-disable prettier/prettier */
import { useEffect, useState } from "react"
import { promedioOperarioType, registrosType } from "../type/type"
import { obtenerOperarios } from "../functions/functions"

type propsType = {
  data: registrosType[]

}
export default function TableResumenVolanteCalidad(props: propsType): JSX.Element {
  const [operario, setOperarios] = useState<promedioOperarioType[]>([])
  useEffect(() => {
    const operarios = obtenerOperarios(props.data)
    setOperarios(operarios)
  }, [props.data])
  return (
    <div className="table-container">

      <table className="table-main">
        <thead>
          <tr>
            <th>Operario</th>
            <th>Porcentaje total</th>
          </tr>
        </thead>
        <tbody>
          {operario.map((item, index) => (
            <tr key={index} className={`${index % 2 === 0 ? 'fondo-par' : 'fondo-impar'}`}>
              <td>{item.operario}</td>
              <td >{item.porcentaje.toFixed(2) + '%'}</td>
            </tr>
          ))}
          <tr style={{ backgroundColor: "rgb(194, 248, 214)" }}>
            <td>Promedio Total</td>
            <td>
              {(operario.reduce((acu, item) => acu += item.porcentaje, 0) / props.data.length).toFixed(2) + '%'}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )

}
