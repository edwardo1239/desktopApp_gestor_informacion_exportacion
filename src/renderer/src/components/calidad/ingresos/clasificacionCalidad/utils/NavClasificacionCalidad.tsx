/* eslint-disable prettier/prettier */
import { lotesType } from "@renderer/types/lotesType"

type propsType = {
  lotesData: lotesType[]
  setLote: (e) => void
}

export default function NavClasificacionCalidad(props: propsType): JSX.Element {

  const changeHandle = (e): void => {
    const id = e.target.value
    const lote = props.lotesData.find(item => item._id === id)
    if(lote === undefined){
      props.setLote({_id:"", enf:"", predio:{PREDIO:""}, tipoFruta:'Limon'})
    } else {
      props.setLote(lote);
    }
  }

  return (
    <div className='navBar'>
      <select onChange={changeHandle}>
        <option value=''>Lotes</option>
        {props.lotesData.map((lote) => (
          <option key={lote._id} value={lote._id}>
            {lote && lote.predio ? lote.enf + ' ' + ' ' + lote.predio.PREDIO : ' '}
          </option>
        ))}
      </select>
    </div>
  )
}
