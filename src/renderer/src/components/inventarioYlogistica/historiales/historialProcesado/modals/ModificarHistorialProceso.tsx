/* eslint-disable prettier/prettier */

import useAppContext from '@renderer/hooks/useAppContext'
import { historialLotesType } from '@renderer/types/lotesType'
import { useState } from 'react'
import { compararCanastillas, requestModificarHistorial } from '../functions/request'
import { validateRequestModificarRegistro } from '../validation/requestValidation'

type vaciadoType = {
  closeModal: () => void
  propsModal: historialLotesType | undefined
  obtenerHistorialProceso: () => Promise<void>
}

export default function ModificarHistorialProceso(props: vaciadoType): JSX.Element {
  const { messageModal, setLoading, loading } = useAppContext();
  const [canastillas, setCanastillas] = useState<number>(0)
  if (props.propsModal === undefined) {
    messageModal("error", "No se ha seleccionado predio")
    return (
      <div></div>
    )
  }
  const modificar = async (): Promise<void> => {
    try {
      setLoading(true)
      if (props.propsModal === undefined) throw new Error("No se ha seleccionado predio")
      const checkCanastillas = compararCanastillas(Number(canastillas), props.propsModal)
      if (checkCanastillas) {
        throw new Error("Error en el numero de canastillas")
      }
      const request = requestModificarHistorial(Number(canastillas), props.propsModal)
      console.log(request)
      validateRequestModificarRegistro(request)
      const response = await window.api.server2(request)
      if (response.status === 200) {
        messageModal("success", "Historial modificado!");
        await props.obtenerHistorialProceso()
      } else {
        throw new Error(`Error ${response.status}: ${response.message} `)
      }
    } catch (e: unknown) {
      if (e instanceof Error) {
        messageModal("error", `${e.message}`)
      }
    } finally {
      props.closeModal();
      setLoading(false)
    }
  }
  return (
    <div className="fondo-modal">
      <div className="modal-container">
        <div className='modal-header-agree'>
          <h2>{props.propsModal.documento.predio && props.propsModal.documento.predio.PREDIO}</h2>
        </div>
        <div className='modal-container-body'>
          <p>Ingrese el numero de canastillas que desea regresar al inventario:</p>
          <input
            type="number"
            min="0"
            step="1"
            onChange={(e): void => setCanastillas(Number(e.target.value))}
          />
        </div>
        <div className="modal-container-buttons">
          <button onClick={modificar} className='agree' disabled={loading}>Modificar</button>
          <button onClick={props.closeModal} className='cancel'>Cancelar</button>
        </div>
      </div>
    </div>
  );
}

