/* eslint-disable prettier/prettier */
import HeaderTableHistorialDirecto from '../utils/HeaderTableHistorialDirecto'
import { historialLotesType } from '@renderer/types/lotesType'
import { formatearFecha } from '@renderer/functions/fechas';

type propsType = {
  table: historialLotesType[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  clickLote: (e: any) => void
}

export default function TableHistorialDirectoNacional(props: propsType): JSX.Element {
  return (
    <div className="table-container">

      <table className='table-main'>
        <HeaderTableHistorialDirecto />
        <tbody>
          {props.table.map((item, index) => (
            <tr key={item._id} className={`${index % 2 === 0 ? 'fondo-par' : 'fondo-impar'}`}>
              <td>
                <input type="radio" id={item._id} value={item._id} onClick={props.clickLote} name='lote'></input>
              </td>
              <td>{item.documento.enf}</td>
              <td>{item.documento.predio && item.documento.predio.PREDIO}</td>
              <td>
                {(item.documento.directoNacional && item.documento.promedio) ?
                  (item.documento.directoNacional / item.documento.promedio).toFixed(2) : 0}
              </td>
              <td>{item.documento.directoNacional && item.documento.directoNacional.toFixed(2)}</td>
              <td>{item.documento.tipoFruta}</td>
              <td>{formatearFecha(item.fecha, true)}</td>
              <td>{item.user && item.user}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
