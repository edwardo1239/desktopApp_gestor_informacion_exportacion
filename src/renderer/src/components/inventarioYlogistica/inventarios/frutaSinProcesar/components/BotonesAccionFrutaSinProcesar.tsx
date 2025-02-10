/* eslint-disable prettier/prettier */
import { lotesType } from '@renderer/types/lotesType'
import "../css/inventario-fruta-sin-procesar.css"
import { useEffect, useState } from 'react'
type propsType = {
  data: lotesType[]
  loteSeleccionado: lotesType | undefined
  closeVaciado: () => void
  closeDirecto: () => void
  closeDesverdizado: () => void
}

export default function BotonesAccionFrutaSinProcesar(props: propsType): JSX.Element {
  // const [enCaminoNaranja, setEnCaminoNaranja] = useState<number>();
  // const [enCaminoLimon, setEnCaminoLimon] = useState<number>();
  // const [esperaDescargueNaranja, setEsperaDescargueNaranja] = useState<number>();
  // const [esperaDescargueLimon, setEsperaDescargueLimon] = useState<number>();
  const [enInventarioNaranja, setEnInventarioNaranja] = useState<number>();
  const [enInventarioLimon, setEninventarioLimon] = useState<number>();

  useEffect(() => {
    // const enCaminoTempNaranja = props.data.filter(
    //   lote => !(lote.fecha_ingreso_inventario) && !(lote.fecha_ingreso_patio) && lote.tipoFruta === 'Naranja'
    // ).reduce((acu, lote) => acu += lote.kilos_estimados, 0)

    // const enCaminoTempLimon = props.data.filter(
    //   lote => !(lote.fecha_ingreso_inventario) && !(lote.fecha_ingreso_patio) && lote.tipoFruta === 'Limon'
    // ).reduce((acu, lote) => acu += lote.kilos_estimados, 0)

    // const esperaDescargueNaranjaTemp = props.data.filter(
    //   lote => !(lote.fecha_ingreso_inventario) && (lote.fecha_ingreso_patio) && lote.tipoFruta === 'Naranja'
    // ).reduce((acu, lote) => acu += lote.kilos_estimados, 0)

    // const esperaDescargueLimonTemp = props.data.filter(
    //   lote => !(lote.fecha_ingreso_inventario) && (lote.fecha_ingreso_patio) && lote.tipoFruta === 'Limon'
    // ).reduce((acu, lote) => acu += lote.kilos_estimados, 0)

    const enInventarioNaranjaTemp = props.data && props.data.reduce((acu, lote) => {
      if (lote.tipoFruta === 'Naranja') {
        return (acu += lote.inventario ? lote.inventario * lote.promedio : 0)
      } else {
        return acu += 0
      }
    }, 0)

    const enInventarioLimonTemp = props.data.reduce((acu, lote) => {
      if (lote.tipoFruta === 'Limon') {
        return (acu += lote.inventario ? (lote.inventario * lote.promedio) : 0)
      } else {
        return acu += 0
      }
    }, 0)

    // setEnCaminoNaranja(enCaminoTempNaranja)
    // setEnCaminoLimon(enCaminoTempLimon)
    // setEsperaDescargueLimon(esperaDescargueLimonTemp)
    // setEsperaDescargueNaranja(esperaDescargueNaranjaTemp)
    setEnInventarioNaranja(enInventarioNaranjaTemp)
    setEninventarioLimon(enInventarioLimonTemp)

  }, [])
  return (
    <div >
      <div className='inventario-fruta-sin-procesar-botones-container'>

        <button onClick={props.closeDirecto} className='directo-nacional'>
          <span>Directo Nacional</span>
        </button>
        <button onClick={props.closeDesverdizado}
          className={props.loteSeleccionado?.tipoFruta === "Naranja" ? 'desverdizar' : 'no-desverdizar'} >
          <span >Desverdizar</span>
        </button>
      </div>

      <div className='inventario-fruta-sin-procesar-botones-container'>
        <h3>{
          props.loteSeleccionado && props.loteSeleccionado.enf ?
            props.loteSeleccionado.enf + " " + props.loteSeleccionado.predio.PREDIO
            : "EF1"
        }</h3>
        <h3>
          {/* Total:
          {
            (enCaminoLimon ? enCaminoLimon : 0) +
            (esperaDescargueLimon ? esperaDescargueLimon : 0) +
            (enInventarioLimon ? enInventarioLimon : 0) +
            (enCaminoNaranja ? enCaminoNaranja : 0) +
            (esperaDescargueNaranja ? esperaDescargueNaranja : 0) +
            (enInventarioNaranja ? enInventarioNaranja : 0)
          } */}
        </h3>

        <h3>
          {/* Kilos Limon:
          {
            (enCaminoLimon ? enCaminoLimon : 0) +
            (esperaDescargueLimon ? esperaDescargueLimon : 0) +
            (enInventarioLimon ? enInventarioLimon : 0)
          } */}
        </h3>
        <h3>
          {/* Kilos Naranja:
          {
            (enCaminoNaranja ? enCaminoNaranja : 0) +
            (esperaDescargueNaranja ? esperaDescargueNaranja : 0) +
            (enInventarioNaranja ? enInventarioNaranja : 0)
          } */}
        </h3>

      </div>

      <div className='inventario-fruta-sin-procesar-botones-container'>
        <h3>{
          "En inventario"
        }</h3>
        <h3>Total:
          {((enInventarioLimon ? 
            enInventarioLimon : 0) + (enInventarioNaranja ? enInventarioNaranja : 0)).toLocaleString('es-ES')} </h3>

        <h3>Kilos Limon {enInventarioLimon && enInventarioLimon.toLocaleString('es-ES')} </h3>
        <h3>Kilos Naranja {enInventarioNaranja && enInventarioNaranja.toLocaleString('es-ES')} </h3>

      </div>
      {/* <div className='inventario-fruta-sin-procesar-botones-container'>
        <h3>
          Espera descargue
        </h3>
        <h3>
          Total: {
            (esperaDescargueLimon ? esperaDescargueLimon : 0) +
            (esperaDescargueNaranja ? esperaDescargueNaranja : 0)
          }
        </h3>
        <h3>
          Total Limon: {esperaDescargueLimon}
        </h3>
        <h3>
          Total Naranja: {esperaDescargueNaranja}
        </h3>
      </div> */}
      {/* <div className='inventario-fruta-sin-procesar-botones-container'>
        <h3>
          En camino
        </h3>
        <h3>
          Total: {(enCaminoNaranja ? enCaminoNaranja : 0) + (enCaminoLimon ? enCaminoLimon : 0)}
        </h3>
        <h3>
          Total Limon: {enCaminoLimon}
        </h3>
        <h3>
          Total Naranja: {enCaminoNaranja}
        </h3>
      </div> */}
    </div>
  )
}
