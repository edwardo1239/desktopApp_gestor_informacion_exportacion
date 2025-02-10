/* eslint-disable prettier/prettier */

import { useReducer, useState } from "react"
import { INITIAL_STATE, reducer } from "../functions/reduce"
import ContenidoZumo from "./ContenidoZumo"
import PruebasPlataforma from "./PruebasPlataforma"
import { lotesType } from "@renderer/types/lotesType"
import useAppContext from "@renderer/hooks/useAppContext"
import { new_lote } from "../functions/request"
import CalidadDeLaFruta from "./CalidadDeLaFruta"
import "../css/calidad-interna.css"

type propsType = {
  lote: lotesType
  setLotesData: (e) => void
  interval: () => void
}

export default function PruebasCalidadInterna(props: propsType): JSX.Element {
  const { messageModal } = useAppContext();
  const [formulario, dispatch] = useReducer(reducer, INITIAL_STATE)
  const [calidad, setCalidad] = useState<string>("");

  const handleChange = (data: React.ChangeEvent<HTMLInputElement>, action: string): void => {
    if (action === 'semillas') {
      dispatch({ type: action, data: String(data.target.checked) })
    } else {
      dispatch({ type: action, data: data.target.value })
    }
  }
  const handleChangeCalidad = (event): void => {
    setCalidad(event.target.value);
};
  const guardar = async (): Promise<void> => {
    try {
      const lote = new_lote(formulario);
      const requestLotes = {
        action: 'ingresoCalidadInterna',
        data: {...lote, clasificacionCalidad: calidad},
        _id:props.lote._id
      }
      const response = await window.api.server2(requestLotes)
      if (response.status !== 200) {
        throw new Error(`${response.message}`)
      }
      messageModal("success", "Datos guardados con exito")
    } catch (e: unknown) {
      if (e instanceof Error) {
        messageModal("error", `Error: ${e.message}`);
      }
    } finally {
      dispatch({ type: 'restablecer', data: '' })
      props.interval()
    }
  }

  return (
    <div className="calidad-interna-container">
      <div className="calidad-interna-div1">
        <ContenidoZumo
          handleChange={handleChange}
          formulario={formulario}
        />
        <CalidadDeLaFruta lote={props.lote} handleChangeCalidad={handleChangeCalidad}/>
      </div>

      <PruebasPlataforma
        handleChange={handleChange}
        formulario={formulario}
      />

      <button
        onClick={guardar}
        className="bg-orange-600 text-white border-none px-4 py-2 rounded-md mb-5 active:bg-orange-900 m-5"
      >
        Guardar
      </button>
    </div>
  )
}
