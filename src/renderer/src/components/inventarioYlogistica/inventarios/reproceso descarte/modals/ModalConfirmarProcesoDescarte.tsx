/* eslint-disable prettier/prettier */
import useAppContext from '@renderer/hooks/useAppContext';
import { Fragment, useState } from 'react'
import { descarteType, inventarioDescarteType } from '../types/types';
import { formDespachoInit, formDespachoLabels } from '../services/forms';
import { sumatoriaDescarteEspecifico } from '../function/sumatorias';
import { inventarioInit } from '../function/llaves';

import { lotesType } from '@renderer/types/lotesType';



type propsType = {
  formState: inventarioDescarteType
  table: descarteType[]
  setModal: (e: boolean) => void
  filtro: string
  obtenerFruta: () => void
  setFormState: (e: inventarioDescarteType) => void

  abrirResumen: (e: lotesType[]) => void

}

export default function ModalConfirmarProcesoDescarte(props: propsType): JSX.Element {
  const { messageModal } = useAppContext();
  const [formState, setFormState] = useState(formDespachoInit)


  const despachar = async (): Promise<void> => {
    try {
      //se valida que los valor ingresados no son mayores a los disponibles
      Object.keys(props.formState).forEach(descarte => {
        Object.keys(props.formState[descarte]).forEach(key => {
          const suma = sumatoriaDescarteEspecifico(props.table, descarte, key);
          if (props.formState[descarte][key] > suma) {
            throw new Error(`${descarte} - ${key}: es mas de lo que hay en el inventario`);
          }
        })
      })
      //se valida que se haya escogido un tipo de fruta
      if (props.filtro === '') throw new Error("Seleccione un tipo de fruta");
      const data = {
        clienteInfo: formState,
        tipoFruta: props.filtro,
        kilos: props.formState
      }
      // se crea el historial descarte
      const requestHistorial = {
        data: data,
        action: 'despacho_descarte',
      };
      const response = await window.api.server2(requestHistorial)
      if (response.status !== 200)
        throw new Error(`Code ${response.status}: ${response.message}`)
      props.setModal(false)
      props.obtenerFruta()
      props.setFormState(inventarioInit)
      if (response.data) {
        props.abrirResumen(response.data)
      }
      messageModal("success", "Fruta despachada!")

      if (response.status !== 200)
        throw new Error(`Code ${response.status}: ${response.message}`)

      messageModal("success", "Fruta despachada!")
      props.setModal(false)
      props.obtenerFruta()
      props.setFormState(inventarioInit)

    } catch (e) {
      if (e instanceof Error) {
        messageModal("error", `Error: ${e.message}`)
        props.setModal(false)
      }
    }
  }
  const handleChange = (event): void => {
    const { name, value } = event.target;
    setFormState({
      ...formState,
      [name]: value,
    });
  };
  return (
    <div className="fondo-modal">
      <div className={`modal-container`}>
        <div className='modal-header-agree'>
          <h2>
            Salida descarte
          </h2>
        </div>
        <div className='modal-container-body'>

          {Object.keys(formDespachoInit).map(key => (
            <Fragment key={key}>
              <label>{formDespachoLabels[key]}</label>
              <input
                type="text"
                value={formState[key]}
                name={key}
                onChange={handleChange}
              />
            </Fragment>
          ))}

        </div>
        <div className="modal-container-buttons">
          <button onClick={despachar} className='agree'>Despachar</button>
          <button onClick={(): void => props.setModal(false)} className='cancel'>Cancelar</button>
        </div>

      </div>
    </div>
  )
}
