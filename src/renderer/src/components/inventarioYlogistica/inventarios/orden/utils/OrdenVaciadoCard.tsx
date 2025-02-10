/* eslint-disable prettier/prettier */
import { lotesType } from "@renderer/types/lotesType"
import "../css/ordenVaciadoCard.css"
import { ImCancelCircle } from "react-icons/im";
import { formatearFecha } from "@renderer/functions/fechas";
import { useEffect, useState } from "react";


type propsType = {
  lote: lotesType
  index: number
  handleRemoveOrdenVaceo: (_id) => void
}

export default function OrdenVaciadoCard(props: propsType): JSX.Element {
  const [exportacion, setExportacion] = useState<number>()
  const [descarte, setDescarte] = useState<number>()
  useEffect(() => {
      if (props.lote.calidad && props.lote.calidad.inspeccionIngreso) {
          let des = 0;
          let exp = 0;
          for (const [key, value] of Object.entries(props.lote.calidad?.inspeccionIngreso)) {
              if(key === 'exportacion1' || key === 'exportacion15' || key === 'exportacion2'){
                  exp += Number(value)
              } else if(key !== 'fecha') {
                  des += Number(value)
              }
          }
          setExportacion(exp * 100)
          setDescarte(des * 100)
      }
  }, [])
  return (
    <div className="orden-vaciado-card-container">
      <div className="orden-vaciado-card-container-div-index">
        {props.index + 1}
      </div>
      <div className="orden-vaciado-card-container-div-predio">
        <div className="orden-vaciado-card-container-div-info">
          <p>{props.lote?.enf}</p>
          <p>{props.lote?.predio?.PREDIO}</p>
          <p>{formatearFecha(props.lote.fecha_ingreso_inventario)}</p>
          <p>{props.lote.tipoFruta}</p>
          {Object.prototype.hasOwnProperty.call(props.lote, "desverdizado") ?
            <p> Canastillas: {Number(props.lote?.inventario)}</p> :
            <p>Canastillas: {Number(props.lote?.inventario)}</p>
          }
        </div>
        <div className="orden-vaciado-card-container-div-info">
          {Object.prototype.hasOwnProperty.call(props.lote, "desverdizado") ?
            <p>Canastillas: {(Number(props.lote?.inventario) * Number(props.lote.promedio)).toLocaleString('es-CO')} Kg</p> :
            <p> Canastillas: {(Number(props.lote?.inventario) * Number(props.lote.promedio)).toLocaleString('es-CO')} Kg</p>
          }
          {Object.prototype.hasOwnProperty.call(props.lote, "desverdizado") &&
            <p>Desverdizado</p>
          }
          {/* <p>{props.lote._id}</p> */}
          <p>Exportacion: {exportacion?.toFixed(2)} %</p>
          <p>Descarte: {descarte?.toFixed(2)} %</p>
        </div>

      </div>
      <div className="orden-vaciado-card-container-div-cancel">

          <button onClick={(): void => props.handleRemoveOrdenVaceo(props.lote._id)}>
            <ImCancelCircle />
          </button>
        
      </div>
    </div>
  )
}
