/* eslint-disable prettier/prettier */
import { useEffect, useReducer, useState } from 'react'
import { INITIAL_STATE_HISTORIAL_PROCESO, reducerHistorial } from './functions/reducer'
import { createPortal } from 'react-dom'
import { format } from 'date-fns'
import TableHistorialDirectoNacional from './tables/TableHistorialDirectoNacional'
import BotonesAccionHistorialFrutaProcesada from './utils/BotonesAccionHistorialFrutaProcesada'
import ModificarHistorialDirecto from './modals/ModificarHistorialDirecto'
import NavBarInventario from './utils/NavBarInventario'
import { historialLotesType } from '@renderer/types/lotesType'
import useAppContext from '@renderer/hooks/useAppContext'
import { requestData } from './functions/request'



export default function HistorialDirectoNacional(): JSX.Element {
  const {messageModal, eventoServidor, triggerServer} = useAppContext();
  const [datosOriginales, setDatosOriginales] = useState([])
  const [titleTable, setTitleTable] = useState('Historial directo nacional')
  const [showModal, setShowModal] = useState<boolean>(false)
  const [propsModal, setPropsModal] = useState<historialLotesType>()
  const [showModificar, setShowModificar] = useState<boolean>(false)
  const [filtro, setFiltro] = useState<string>('')
  const [table, dispatch] = useReducer(reducerHistorial, INITIAL_STATE_HISTORIAL_PROCESO)
  const [fechaInicio, SetFechaInicio] = useState("")
  const [fechaFin, SetFechaFin] = useState("")

  const obtenerHistorialProceso = async ():Promise<void> => {
    try {
      const request = requestData(fechaInicio, fechaFin)
      const frutaActual = await window.api.server2(request)
      if (frutaActual.status === 200) {
        setDatosOriginales(frutaActual.data)
        dispatch({ type: 'initialData', data: frutaActual.data, filtro: '' })
      } else {
        messageModal('error' , 'Error obteniendo datos del servidor')
      }
    } catch (e: unknown) {
      messageModal('error',`Fruta actual ${e}`)
    }
  }

  useEffect(() => {
    obtenerHistorialProceso()
  }, [showModal])
  const closeModal = (): void => {
    setShowModal(!showModal)
  }
  const clickLote = (e): void => {
    const id = e.target.value
    const lote: historialLotesType | undefined = table.find((item) => item._id === id)
    if (lote !== undefined) {
      setPropsModal(lote)
      if (e.target.checked) {
        setTitleTable(( lote?.documento.enf || '') + ' ' + (lote?.documento.predio && lote?.documento.predio.PREDIO || ''))
        if (format(new Date(lote?.fecha), 'MM/dd/yyyy') == format(new Date(), 'MM/dd/yyyy')) {
          setShowModificar(true)
        } else {
          setShowModificar(false)
        }
      }
    }
  }
  useEffect(() => {
    dispatch({ type: 'filter', data: datosOriginales, filtro: filtro })
  }, [filtro])
  const handleFilter = (data: string): void => {
    setFiltro(data)
  }

  useEffect(() => {
    if (eventoServidor === 'directo_nacional' ) {
      obtenerHistorialProceso()
    }
  }, [triggerServer])
  
  useEffect(() => {
    obtenerHistorialProceso()
  }, [])


  useEffect(() => {
    obtenerHistorialProceso()
  }, [fechaInicio,fechaFin ])
  return (
    <div>
      <NavBarInventario handleFilter={handleFilter} />

      <BotonesAccionHistorialFrutaProcesada
        title={titleTable}
        table={table}
        closeModal={closeModal}
        modificar={showModificar}
        SetFechaInicio={SetFechaInicio}
        SetFechaFin={SetFechaFin}
      />
      <TableHistorialDirectoNacional table={table} clickLote={clickLote} />

      {showModal &&
        createPortal(
          <ModificarHistorialDirecto
            obtenerHistorialProceso={obtenerHistorialProceso}
            closeModal={closeModal}
            propsModal={propsModal}
          />,
          document.body
        )}

    </div>
  )
}
