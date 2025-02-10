/* eslint-disable prettier/prettier */
import { useEffect, useReducer, useState } from 'react'
import { INITIAL_STATE_HISTORIAL_PROCESO, reducerHistorial } from './functions/reducer'
import { createPortal } from 'react-dom'
import TableHistorialProcesado from './tables/TableHistorialProcesado'
import BotonesAccionHistorialFrutaProcesada from './utils/BotonesAccionHistorialFrutaProcesada'
import { format } from 'date-fns'
import ModificarHistorialProceso from './modals/ModificarHistorialProceso'
import useAppContext from '@renderer/hooks/useAppContext'
import { historialLotesType } from '@renderer/types/lotesType'
import { requestData } from './functions/request'



export default function HistorialProcesado(): JSX.Element {
  const { messageModal, eventoServidor, triggerServer } = useAppContext();
  const [datosOriginales, setDatosOriginales] = useState([])
  const [titleTable, setTitleTable] = useState('Historial Lotes Procesados')
  const [showModal, setShowModal] = useState<boolean>(false)
  const [propsModal, setPropsModal] = useState<historialLotesType>()
  const [showModificar, setShowModificar] = useState<boolean>(false)
  const [table, dispatch] = useReducer(reducerHistorial, INITIAL_STATE_HISTORIAL_PROCESO)
  const [fechaInicio, SetFechaInicio] = useState("")
  const [fechaFin, SetFechaFin] = useState("")

  const obtenerHistorialProceso = async (): Promise<void> => {
    try {
      const request = requestData(fechaInicio, fechaFin)
      const frutaActual = await window.api.server2(request)
      if (frutaActual.status === 200) {
        setDatosOriginales(frutaActual.data)
        console.log(frutaActual)
        dispatch({ type: 'initialData', data: frutaActual.data, filtro: '' })
      } else {
        messageModal("error", `Error ${frutaActual.status}: ${frutaActual.message}`)
      }
    } catch (e: unknown) {
      if (e instanceof Error) {
        messageModal("error", `Error: ${e.message}`);
      }
    }
  }

  const closeModal = (): void => {
    setShowModal(!showModal)
  }

  const clickLote = (e): void => {
    const id = e.target.value
    const lote: historialLotesType | undefined = table.find((item) => item._id === id)
    if (lote !== undefined) {
      setPropsModal(lote)
      if (e.target.checked) {
        setTitleTable((lote?.documento.enf || '') + ' ' + (lote?.documento.predio && lote?.documento.predio.PREDIO || ''))
        if (format(new Date(lote?.fecha), 'MM/dd/yyyy') == format(new Date(), 'MM/dd/yyyy')) {
          setShowModificar(true)
        } else {
          setShowModificar(false)
        }
      }
    }
  }

  useEffect(() => {
    if (
      eventoServidor === 'vaciar_lote' ||
      eventoServidor === 'modificar_historial_fruta_procesada' 
    ) {
      obtenerHistorialProceso()
    }
  }, [triggerServer])

  useEffect(() => {
    obtenerHistorialProceso()
  }, [fechaInicio,fechaFin])

  useEffect(() => {
    dispatch({ type: 'filter', data: datosOriginales, filtro: '' })
  }, [])

  return (
    <div>
      <div className="navBar"></div>
      <BotonesAccionHistorialFrutaProcesada
        title={titleTable}
        table={table}
        closeModal={closeModal}
        modificar={showModificar}
        SetFechaInicio={SetFechaInicio}
        SetFechaFin={SetFechaFin}
      />
      <TableHistorialProcesado table={table} clickLote={clickLote} />

      {showModal &&
        createPortal(
          <ModificarHistorialProceso
            obtenerHistorialProceso={obtenerHistorialProceso}
            closeModal={closeModal}
            propsModal={propsModal}
          />,
          document.body
        )}
    </div>
  )
}
