/* eslint-disable prettier/prettier */
import { useEffect } from 'react'
import HeaderTableDesverdizado from '../utils/HeaderTableInventarioDesverdizado'
import { format } from 'date-fns'
import { lotesType } from '@renderer/types/lotesType'

type propsType = {
  table: lotesType[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  clickLote: (e: any) => void
  render: boolean
  propsModal: lotesType | undefined
}

export default function TableInventarioDesverdizado(props: propsType): JSX.Element {
  useEffect(() => {
    const radios: HTMLCollectionOf<HTMLInputElement> = document.getElementsByClassName(
      'myRadioButtons'
    ) as HTMLCollectionOf<HTMLInputElement>

    for (let i = 0; i < radios.length; i++) {
      radios[i].checked = false
    }
  }, [props.render])
  const handleClick = (e): void => {
    props.clickLote(e);

  };
  return (
    <div className="table-container">
      <table className='table-main'>
        <HeaderTableDesverdizado />
        <tbody>
          {props.table.map((lote, index) => (
            <tr key={lote.enf} className={`${index % 2 === 0 ? 'fondo-par' : 'fondo-impar'}`} >
              <td>
                <input
                  type="radio"
                  onChange={handleClick}
                  id={lote.enf}
                  value={lote.enf}
                  name='lote' />
              </td>
              <td>{lote.enf}</td>
              <td>{lote.predio && lote.predio.PREDIO}</td>
              <td>{lote.inventarioDesverdizado ? lote.inventarioDesverdizado : 0}</td>
              <td>{(lote.inventarioDesverdizado ? lote.inventarioDesverdizado : 0) * (lote.promedio ? lote.promedio : 1)}</td>
              <td>{lote.desverdizado?.cuartoDesverdizado}</td>
              <td>
                {lote.desverdizado?.fechaIngreso && format(new Date(lote.desverdizado?.fechaIngreso), 'dd-MM-yyyy')}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
