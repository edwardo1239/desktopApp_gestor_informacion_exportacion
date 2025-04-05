/* eslint-disable prettier/prettier */
import useAppContext from '@renderer/hooks/useAppContext';
import { useState } from 'react'
import { descarteType, inventarioDescarteType } from '../types/types';
import { sumatoriaDescarteEspecifico } from '../function/sumatorias';
import { inventarioInit } from '../function/llaves';

type propsType = {
  formState: inventarioDescarteType
  table: descarteType[]
  filtro: string
  setFormState: (e: inventarioDescarteType) => void
}

type formStateType = {
  razon?: string
  comentario_adicional?: string
}

const formularioData = {
  razon: "Razón",
  comentario_adicional: "Comentario adicional"
}

export default function ModalCrearRegistroFrutaDescompuesta(props: propsType): JSX.Element {
  const { messageModal, user } = useAppContext();
  const [formState, setFormState] = useState<formStateType>()

  const registrarFrutaDescompuesta = async (): Promise<void> => {
    try {
      if (props.filtro === '' || props.filtro === undefined) throw new Error("Seleccione un tipo de fruta")
      //se valida que los valor ingresados no son mayores a los disponibles
      for (const descarte of Object.keys(props.formState)) {
        for (const key of Object.keys(props.formState[descarte])) {
          const suma = sumatoriaDescarteEspecifico(props.table, descarte, key);
          if (props.formState[descarte][key] > suma) {
            throw new Error(`${descarte} - ${key}: es más de lo que hay en el inventario`);
          }
        }
      }

      let kilos_total = 0;
      for (const descarte of Object.keys(props.formState)) {
        for (const key of Object.keys(props.formState[descarte])) {
          kilos_total += Number(props.formState[descarte][key]);
        }
      }
      if(kilos_total >= 50){
        if(user && user.rol > 3){
          throw new Error("No tiene permisos para ingresar más de 50 kilos de fruta descompuesta")
        }
      }
      const request = {
        action: 'post_inventarios_frutaDescarte_frutaDescompuesta',
        data: {
          ...formState,
          tipo_fruta: props.filtro,
          kilos_total: kilos_total,
        },
        descarte: props.formState,
      }
      const response = await window.api.server2(request)
      if (response.status !== 200) {
        throw new Error(`Code ${response}: ${response.message}`)
      }
      messageModal("success", "Fruta descompuesta registrada!")
    } catch (e) {
      if (e instanceof Error) {
        messageModal("error", `Error: ${e.message}`)
      }
    } finally {
      props.setFormState(inventarioInit)
      setFormState(undefined)
      closeModal()
    }
  }

  const closeModal = (): void => {
    const dialogSetting = document.getElementById("modal_post_fruta_descompuesta") as HTMLDialogElement;
    if (dialogSetting) {
      dialogSetting.close();
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
    <dialog id='modal_post_fruta_descompuesta' className='"dialog-container"'>
      <div className="dialog-header">
        <h3>Ingresar Fruta descompuesta</h3>
        <button className="close-button" aria-label="Cerrar" onClick={closeModal}>×</button>
      </div>
      <div className="dialog-body">
        {Object.entries(formularioData).map(([key, value]) => (
          <div className="form-field" key={key}>
            <label htmlFor={key}>{value}</label>
            <textarea
              id={key}
              name={key}
              onChange={handleChange}
              value={formState && formState[key] ? formState[key] : ''}
              required
            />
          </div>
        ))}
      </div>
      <div className="dialog-footer">
        <button className="default-button-agree" onClick={registrarFrutaDescompuesta}>Guardar</button>
        <button className="default-button-error" onClick={closeModal}>Cerrar</button>
      </div>
    </dialog >
  )
}
