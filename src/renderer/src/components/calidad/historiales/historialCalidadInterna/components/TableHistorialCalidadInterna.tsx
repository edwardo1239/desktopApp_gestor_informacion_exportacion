/* eslint-disable prettier/prettier */
import { format } from "date-fns"
import { lotesType } from "@renderer/types/lotesType"
import { PiNotePencilDuotone } from "react-icons/pi";
import { es } from 'date-fns/locale';

type propsType = {
  data: lotesType[] | undefined
  handleModificar: () => void
  setLoteSeleccionado: (lote) => void

}

export default function TableHistorialCalidadInterna(props: propsType): JSX.Element {
  const headers = ["EF1", "Predio", "Tipo de fruta", "Acidez", "Brix", "Ratio", "Zumo", "Fecha", ""]
  if (props.data === undefined) {
    return <div>Cargando....</div>
  }

  const handleButton= (lote): void => {
    props.handleModificar()
    props.setLoteSeleccionado(lote)
}

  return (
    <div className="table-container">

    <table className="table-main">
      <thead>
        <tr >
          {headers.map(item => (
            <th key={item}>{item}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {props.data.map((lote, index) => (
          <tr className={`${index % 2 === 0 ? 'fondo-par' : 'fondo-impar'}`} key={lote._id} >
            <td>{lote.enf}</td>
            <td>{lote.predio?.PREDIO}</td>
            <td>{lote.tipoFruta}</td>
            <td>{lote.calidad?.calidadInterna?.acidez?.toLocaleString('es-ES')}</td>
            <td>{lote.calidad?.calidadInterna?.brix?.toLocaleString('es-ES')}</td>
            <td>{lote.calidad?.calidadInterna?.ratio ?
              lote.calidad?.calidadInterna?.ratio?.toLocaleString('es-ES') : 0}</td>
            <td>{lote.calidad?.calidadInterna?.zumo ?
              ((lote.calidad?.calidadInterna?.zumo / lote.calidad?.calidadInterna?.peso)*100).toLocaleString('es-ES') + "%" : "0%"}</td>
            <td>{format(lote.calidad?.calidadInterna?.fecha ?
              new Date(lote.calidad?.calidadInterna?.fecha) : new Date(),  'dd/MM/yyyy HH:mm', { locale: es })}</td>
            <td>
              <button style={{ color: "blue" }} onClick={(): void => handleButton(lote)} ><PiNotePencilDuotone /></button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    </div>
  )
}
