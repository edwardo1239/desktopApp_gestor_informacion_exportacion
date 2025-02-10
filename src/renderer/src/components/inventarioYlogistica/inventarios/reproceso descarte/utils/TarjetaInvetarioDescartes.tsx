/* eslint-disable prettier/prettier */
import { llavesVisualizar } from '../function/llaves'
import { useEffect } from 'react'
import { PiNotePencilDuotone } from "react-icons/pi";
import { descarteType } from '../types/types';

type propsType = {
  lote: descarteType
  seleccionarItems: (e: unknown) => void
  seleccionarVariosItems: (items: unknown) => void
  respawn: boolean
  handleModificar: () => void
  setLoteSeleccionado: (lote) => void
}

export default function TarjetaInvetarioDescartes(props: propsType): JSX.Element {
  if (props.lote) {
    const seleccionarLote = (e): void => {
      const buttons = document.getElementsByClassName(props.lote._id + 'descarteCheckbox')
      if (e.target.checked) {
        for (const i of buttons) {
          ; (i as HTMLInputElement).checked = true
        }
      } else {
        for (const i of buttons) {
          ; (i as HTMLInputElement).checked = false
        }
      }
      props.seleccionarVariosItems(buttons)
    }

    useEffect(() => {
      const buttons = document.querySelectorAll('input')
      for (const i of buttons) {
        ; (i as HTMLInputElement).checked = false
      }
    }, [props.respawn])

    const handleButton = (lote): void => {
      props.handleModificar()
      props.setLoteSeleccionado(lote)
    }

    return (
      <div className="inventario-descartes-tarjeta-container">
        <div className="inventario-descartes-tarjeta-info-div">
          <div className="inventario-descartes-tarjeta-info-div2">
            <div className="inventario-descartes-tarjeta-info-div-checkbox">
              <input type="checkbox" onClick={seleccionarLote} />
              <h4>{props.lote.enf}</h4>
            </div><h5>{props.lote.predio && props.lote.predio.PREDIO}
            </h5>
            <h3>Tipo de fruta:</h3>
            <h5>{props.lote.tipoFruta}</h5>
          </div>
          <div className='inventario-descartes-tarjeta-descarte-div'>
            <div>
              <div>
                <h4>Descarte Lavado:</h4>
                <div className="inventario-descartes-tarjeta-descarte-lavado">
                  {props.lote && props.lote.descarteLavado && Object.keys(props.lote.descarteLavado).map((item): JSX.Element | null => {
                    if (item === 'descarteGeneral' || item === 'pareja' || item === 'balin') {
                      return (
                        <div key={item}>
                          <label>
                            <span> {llavesVisualizar[item]}:</span>{' '}
                            {props.lote && props.lote.descarteLavado && props.lote.descarteLavado[item]} Kg
                            <input
                              type="checkbox"
                              onClick={props.seleccionarItems}
                              value={props.lote._id + '/' + 'descarteLavado' + '/' + item}
                              className={`${props.lote._id}descarteCheckbox`}
                            />
                          </label>
                        </div>
                      )
                    } else return null
                  })}
                </div>
              </div>
              <div>
                <h4>Descarte Encerado:</h4>
                <div className="inventario-descartes-tarjeta-descarte-lavado">
                  {props.lote && props.lote.descarteEncerado && Object.keys(props.lote.descarteEncerado).map((item) => {
                    if (['descarteGeneral', 'pareja', 'balin', 'extra', 'suelo', 'frutaNacional'].includes(item)) {
                      return (
                        <div key={item} style={{marginRight:'8px'}}>
                          <label>
                              <span> {llavesVisualizar[item]}:</span>{' '}
                              {props.lote && props.lote && props.lote.descarteEncerado ? props.lote.descarteEncerado[item].toLocaleString('es-ES') : 0} Kg
                            <input
                              type="checkbox"
                              onClick={props.seleccionarItems}
                              value={props.lote._id + '/' + 'descarteEncerado' + '/' + item}
                              className={`${props.lote._id}descarteCheckbox`}
                            />
                          </label>
                        </div>
                      )
                    } else return null
                  })}
                </div>
              </div>
            </div>
          </div>
          <td>
            <button style={{ color: "blue" }} onClick={(): void => handleButton(props.lote)} ><PiNotePencilDuotone /></button>
          </td>
        </div>

      </div>
    )
  } else {
    return <div></div>
  }
}
