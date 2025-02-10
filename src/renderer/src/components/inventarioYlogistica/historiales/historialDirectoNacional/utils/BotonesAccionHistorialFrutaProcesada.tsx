/* eslint-disable prettier/prettier */
import { historialLotesType } from '@renderer/types/lotesType'

type propsType = {
  title: string
  table: historialLotesType[]
  modificar: boolean
  closeModal: () => void
  SetFechaInicio: (e:string) => void
  SetFechaFin: (e:string) => void
}
export default function BotonesAccionHistorialFrutaProcesada(props: propsType): JSX.Element {
  return (
    <div>
      <div className='filtroContainer' style={{ justifyContent: 'space-around' }}>
        <h2>{props.title}</h2>
        <h2>{props.table && props.table.reduce((acu, lote) => (acu += lote.documento.directoNacional ? lote.documento.directoNacional : 0), 0).toLocaleString('es-ES')} Kg</h2>
        <button onClick={props.closeModal} className='vaciar'>
          Modificar
        </button>
      </div>
      <div className='filtroContainer'>

        <label>
          <p>Fecha Incio</p>
          <input type="date" onChange={(e): void => props.SetFechaInicio(e.target.value)} />
        </label>
        <label>
          <p>Fecha Fin</p>
          <input type="date" onChange={(e): void => props.SetFechaFin(e.target.value)} />
        </label>
      </div>

    </div>
  )
}
