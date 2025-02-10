/* eslint-disable prettier/prettier */
import { useEffect, useReducer, useState } from 'react'
import { INITIAL_STATE, reducer } from '../functions/reduce'
import TableInventarioDesverdizado from '../tables/TableInventarioDesverdizado'
import BotonesInventarioDesverdizado from '../utils/BotonesInventarioDesverdizado'
import { createPortal } from 'react-dom'
import DesverdizadoSetParametrosModal from '../modals/DesverdizadoSetParametrosModal'
import useAppContext from '@renderer/hooks/useAppContext'
import { lotesType } from '@renderer/types/lotesType'
import ConfirmacionModal from '@renderer/messages/ConfirmacionModal'

type propsType = {
  filtro: string
}
const request = {
  action: 'getInventarioDesverdizado'
};

export default function InventarioDesverdizado(props: propsType): JSX.Element {
  const { messageModal, eventoServidor, triggerServer } = useAppContext();
  const [datosOriginales, setDatosOriginales] = useState([])
  const [propsModal, setPropsModal] = useState<lotesType>()
  const [titleTable, setTitleTable] = useState('Lotes')
  const [showButton, setShowButton] = useState<string>('')
  const [showModalParametros, setShowModalParametros] = useState<boolean>(false)
  const [render, setRender] = useState<boolean>(false)

  const [table, dispatch] = useReducer(reducer, INITIAL_STATE)
  //modal de confimacion
  const [confirm, setConfirm] = useState<boolean>(false)
  const [message,] = useState<string>('¿Desea finalizar el desverdizado?')
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false)


  const obtenerFruta = async (): Promise<void> => {
    try {
      setRender(!render)
      const frutaActual = await window.api.server2(request)

      if (frutaActual.status === 200) {
        setDatosOriginales(frutaActual.data)
        dispatch({ type: 'initialData', data: frutaActual.data, filtro: '' })
      } else {
        messageModal("error", `Error ${frutaActual.status}: ${frutaActual.message}`);
      }
    } catch (e: unknown) {
      messageModal("error", `Error ${e}`)
    }
  }
  useEffect(() => {
    if (
      eventoServidor === 'enviar_desverdizado' ||
      eventoServidor === 'vaciar_lote') {
      obtenerFruta()
    }
  }, [triggerServer])

  useEffect(() => {
    obtenerFruta()
  }, [])
  const clickLote = (e): void => {
    const enf = e.target.value
    const lote: lotesType | undefined = table.find((item) => item.enf === enf)
    if (lote !== undefined) {
      setPropsModal(lote)
    }
    if (e.target.checked) {
      setTitleTable(enf + ' ' + (lote?.predio?.PREDIO || ""))
      if (lote?.desverdizado?.fechaFinalizar) {
        setShowButton('finalizado')
      } else {
        setShowButton('desverdizando')
      }
    }
  }
  const closeParametros = (): void => {
    setShowModalParametros(!showModalParametros)
  }
  const handleInfo = (): void => {
    setPropsModal(undefined)
    setTitleTable("Lotes")
  }
  const finalizar = async (): Promise<void> => {
    try {
      if (propsModal === undefined) throw new Error("No se ha seleccionado ningun lote")
      const request = {
        _id: propsModal._id,
        __v: propsModal.__v,
        action: 'put_inventarios_desverdizado_finalizar',
      }
      const response = await window.api.server2(request)

      if (response.status == 200) {
        messageModal("success", "Desverdizado finalizado!");
      } else {
        messageModal("error", "Error enviando los datos a el servidor!")
      }
    } catch (e) {
      if (e instanceof Error) {
        messageModal("error", e.message)
      }
    } finally {
      handleInfo();
    }
  }

  useEffect(() => {
    dispatch({ type: 'filter', data: datosOriginales, filtro: props.filtro })
  }, [props.filtro])
  useEffect(() => {
    if (confirm) {
      finalizar();
      setConfirm(false)
    }
  }, [confirm]);
  return (
    <div>
      <BotonesInventarioDesverdizado
        title={titleTable}
        table={table}
        showButton={showButton}
        closeParametros={closeParametros}
        setShowConfirmation={setShowConfirmation}
      />

      <TableInventarioDesverdizado
        propsModal={propsModal}
        table={table}
        clickLote={clickLote}
        render={render}
      />
      {showModalParametros &&
        createPortal(
          <DesverdizadoSetParametrosModal
            closeParametros={closeParametros}
            propsModal={propsModal}
            handleInfo={handleInfo}
          />,
          document.body
        )}

      {showConfirmation && <ConfirmacionModal message={message} setConfirmation={setConfirm} setShowConfirmationModal={setShowConfirmation} />}

    </div>
  )
}
