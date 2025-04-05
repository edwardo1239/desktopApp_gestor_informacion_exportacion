/* eslint-disable prettier/prettier */
import { useState } from "react"
import { filtroColumnasType } from "../type/types"
import { KEYS_FILTROS_COL } from "../functions/constantes"
import { lotesType } from "@renderer/types/lotesType"
import { numeroContenedorType } from "../functions/request"
import { obtener_porcentages_exportacion, total_porcentaje_calibre } from "../functions/functions"
import { formatearFecha } from "@renderer/functions/fechas"
import { PredioDatosType } from "@renderer/functions/resumenContenedores"

type propsType = {
  data: lotesType[]
  numeroContenedor: numeroContenedorType | undefined
  columnVisibility: filtroColumnasType
  prediosInfo: PredioDatosType | undefined
}
export default function TableInfoLotes(props: propsType): JSX.Element {
  const [showDetailDescarte, setShowDetailDescarte] = useState<boolean>(false)
  const [indice1, setIndice1] = useState<string>('')
  const [indice2, setIndice2] = useState<string>('')
  const handleDetails = (e, e2): void => {
    setIndice1(e)
    setIndice2(e2)
    setShowDetailDescarte(!showDetailDescarte)
  }

  return (
    <div className="table-container">
      <table className="table-main">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre del predio</th>
            <th>ICA</th>
            <th>GGN</th>
            <th>Tipo de fruta</th>
            {Object.keys(props.columnVisibility).map(item => {
              if (props.columnVisibility[item]) {
                return (
                  <th key={item}>
                    {KEYS_FILTROS_COL[item]}
                  </th>
                )
              } else {
                return null
              }
            })}
          </tr>
        </thead>
        <tbody>
          {Array.isArray(props.data) && props.data.map((lote, index) => (
            lote && typeof lote === 'object' && typeof lote !== undefined ?
              <tr className={`${index % 2 === 0 ? 'fondo-par' : 'fondo-impar'}`} key={index}>
                <td>{lote.enf}</td>
                <td>{lote.predio?.PREDIO ? lote.predio.PREDIO : lote.predio?.PREDIO}</td>
                <td>{lote.predio?.PREDIO ? lote.predio.ICA.code : lote.predio?.ICA.code}</td>
                <td>{lote.predio?.GGN && lote.predio?.GGN.code ? lote.predio.GGN.code : ""}</td>


                <td>{lote.tipoFruta}</td>
                {Object.keys(props.columnVisibility).map((item, index2) => {
                  if (props.columnVisibility[item]) {
                    if (item === 'descarteLavado' || item === 'descarteEncerado') {
                      return (
                        <td
                          key={lote + item}
                          onClick={(): void => handleDetails(index, index2)}>

                          {showDetailDescarte && (index === Number(indice1) && (index2 === Number(indice2))) ?
                            <td>{
                              typeof lote !== 'undefined' && lote[item] !== undefined ? Object.keys(lote[item as string]).map(descarte => (
                                <p key={descarte}>{descarte}: {lote[item as string][descarte]}</p>
                              )) : null
                            }</td>
                            :
                            lote[item as string] && Object.keys(lote[item as string])
                              .reduce((acu, descarte) =>
                                acu += lote[item as string][descarte] ? lote[item as string][descarte] : 0, 0)
                              .toFixed(2)}
                        </td>
                      )
                    } else if (["fecha_creacion", "fecha_estimada_llegada", "fecha_ingreso_inventario", "fechaProceso"].includes(item)) {
                      return (
                        <td key={lote + item}>{formatearFecha(lote[item], true)}</td>
                      )
                    }

                    else if (item === 'contenedores') {

                      return <td key={lote + item} >
                        {lote.contenedores?.reduce((acu, cont) => {
                          if (props.numeroContenedor) {
                            acu += props.numeroContenedor[cont] + ' - ';
                          }
                          return acu;
                        }, '')}
                      </td>

                    } else if (item === 'exportacion') {
                      return (
                        <td
                          key={lote + item}
                          onClick={(): void => handleDetails(index, index2)}>

                          {showDetailDescarte && (index === Number(indice1) && (index2 === Number(indice2))) ?
                            <td>{
                              <div className="lote-proceso-tabla-exportacion-div">
                                <p> Calidad 1: {lote.calidad1}</p>
                                <p> Calidad 1.5: {lote.calidad15}</p>
                                <p> Calidad 2: {lote.calidad2}</p>
                              </div>

                            }</td>
                            :
                            lote && lote.calidad1 !== undefined && lote.calidad15 !== undefined && lote.calidad2 !== undefined ?
                              (lote.calidad1 + lote.calidad15 + lote.calidad2).toFixed(2) : 0}
                        </td>
                      )
                    } else if (item === 'desverdizado') {
                      return (<td key={lote + item}>
                        {lote.desverdizado ? lote.desverdizado?.kilosIngreso : 0}
                      </td>)
                    } else if (item === 'deshidratacionKilos') {
                      return (
                        <td key={lote + item}>
                          {typeof lote.deshidratacion === 'number' ? ((lote.deshidratacion / 100) * lote.kilos).toFixed(2) : lote[item]}
                        </td>
                      )
                    }
                    else if (item === 'exportacionCalidad') {
                      return (
                        <td key={lote + item}>
                          {obtener_porcentages_exportacion(lote)}
                        </td>
                      )
                    }
                    else if (item === 'calibreExportacion') {
                      return (
                        <td key={lote._id + item}>

                          {props.prediosInfo && props.prediosInfo[lote._id] &&
                            Object.entries(props.prediosInfo[lote._id].calibres).map(([key, value]) => (
                              <div key={key}>
                                <div>{key}: {value.cajas} Cajas - {value.kilos}Kg - </div>
                                <div>{
                                  props.prediosInfo &&
                                  total_porcentaje_calibre(props.prediosInfo[lote._id].calibres, key).toFixed(2)}%
                                </div>
                              </div>
                            ))}
                        </td>
                      )
                    }
                    else {
                      return (
                        <td key={lote + item}>
                          {typeof lote[item] === 'number' ? lote[item].toFixed(2) : lote[item]}
                        </td>
                      )
                    }
                  } else {
                    return null
                  }
                })}
              </tr>
              : <div key={index}></div>))}
        </tbody>
      </table>
    </div>
  )
}
