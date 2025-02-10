/* eslint-disable prettier/prettier */
import { useState } from 'react'
import useAppContext from '@renderer/hooks/useAppContext'
import { lotesType } from '@renderer/types/lotesType'

type vaciadoType = {
  closeParametros: () => void
  propsModal: lotesType | undefined
  handleInfo: () => void

}

export default function DesverdizadoSetParametrosModal(props: vaciadoType): JSX.Element {
  const { messageModal } = useAppContext();
  const [temperatura, setTemperatura] = useState<number>(0)
  const [etileno, setEtileno] = useState<number>(0)
  const [dioxido, setDioxido] = useState<number>(0)
  const [humedad, setHumedad] = useState<number>(0)

  if (props.propsModal === undefined) {
    messageModal("error", "No se ha seleccionado lote");
    props.closeParametros()
    return (
      <div></div>
    )
  }

  const guardar = async (): Promise<void> => {
    try {
      if (props.propsModal === undefined) throw new Error("No se ha seleccionado lote")

      const parametros = {
        temperatura: temperatura,
        etileno: etileno,
        carbono: dioxido,
        humedad: humedad,
        fecha: new Date().toUTCString()

      }
      const request = {
        __v: props.propsModal.__v,
        _id: props.propsModal._id,
        data: parametros,
        action: 'set_parametros_desverdizado',

      }
      const response = await window.api.server2(request)
      if (response.status === 200) {
        messageModal("success", "Parametros guardados con exito!");
      } else if (response.status === 400) {
        messageModal("error", "Error enviando los datos a el servidor!");
      } else {
        messageModal("error", "Error enviando los datos a el servidor!")
      }
    } catch (e: unknown) {
      alert(`${e}`)
    } finally {
      props.closeParametros();
      props.handleInfo();
    }
  }

  return (
    <div className="fondo-modal">
      <div className="modal-container">
        <div className='modal-header-warning'>
          <h2>{props.propsModal.predio && props.propsModal.predio.PREDIO}</h2>
        </div>
        <div className='modal-container-body'>
          <p>Temperatura C°</p>
          <input
            type="number"
            min="0"
            onChange={(e): void => setTemperatura(Number(e.target.value))}
          />
          <p>Etileno (ppm)</p>
          <input
            type="number"
            min="0"
            onChange={(e): void => setEtileno(Number(e.target.value))}
          />
          <p>Dioxido de carbono (ppm)</p>
          <input
            type="number"
            min="0"
            onChange={(e): void => setDioxido(Number(e.target.value))}
          />
          <p>Humedad %</p>
          <input
            type="number"
            min="0"
            step="1"
            onChange={(e): void => setHumedad(Number(e.target.value))}
          />
        </div>
        <div className="modal-container-buttons">
          <button onClick={guardar} className='warning'>Guardar</button>
          <button onClick={props.closeParametros} className='cancel'>Cancelar</button>
        </div>
      </div>
    </div>
  )
}
