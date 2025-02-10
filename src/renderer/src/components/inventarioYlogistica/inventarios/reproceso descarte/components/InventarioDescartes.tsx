/* eslint-disable prettier/prettier */
import { INITIAL_STATE, reducer } from '../function/reducer'
import { useEffect, useReducer, useState } from 'react'
import TarjetaInvetarioDescartes from '../utils/TarjetaInvetarioDescartes'
import BotonesInventarioDescartes from '../utils/BotonesInventarioDescartes'
import { createPortal } from 'react-dom'
import ModalConfirmarProcesoDescarte from '../modals/ModalConfirmarProcesoDescarte'
import { lotesType } from '@renderer/types/lotesType'
import ModalModificarInventarioDescarte from './ModalModificarInventarioDescarte'
import useAppContext from '@renderer/hooks/useAppContext'
import { descarteType, inventarioDescarteType } from '../types/types'
import { inventarioInit } from '../function/llaves'
import ConfirmacionModal from '@renderer/messages/ConfirmacionModal'
import ModalInfoDescartes from './ModalInfoDescarte'
import ModalCrearRegistroFrutaDescompuesta from './ModalCrearRegistroFrutaDescompuesta'

type propsType = {
  filtro: string
}

let enfObj = {}

export default function InventarioDescartes(props: propsType): JSX.Element {
  const { messageModal, eventoServidor, triggerServer } = useAppContext();
  const [datosOriginales, setDatosOriginales] = useState<descarteType[]>([])
  const [render, setRender] = useState<boolean>(false)
  const [reprocesar, setReprocesar] = useState<boolean>(true)
  const [modal, setModal] = useState<boolean>(false)
  const [propsModal, setPropsModal] = useState({ action: '', data: {} })
  const [respawn, setRespawn] = useState<boolean>(false)
  const [formState, setFormState] = useState<inventarioDescarteType>(inventarioInit);
  const [showResumen, setShowResumen] = useState<boolean>(false);
  const [resumen, setResumen] = useState<lotesType[] | undefined>()

  //mostrar modal reproceso
  const [confirm, setConfirm] = useState<boolean>(false)
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false)
  const [message, setMessage] = useState<string>('')

  //modal modificar descarte
  const [loteSeleccionado, setLoteSeleccionado] = useState<lotesType>()
  const [showModal, setShowModal] = useState<boolean>(false)

  const [table, dispatch] = useReducer(reducer, INITIAL_STATE)

  useEffect(() => {
    obtenerFruta()
  }, [])
  useEffect(() => {
    if (eventoServidor === 'put_descarte' || eventoServidor === 'registro_fruta_descompuesta') {
      obtenerFruta()
    }
  }, [triggerServer])
  useEffect(() => {
    if (confirm) {
      if (message === 'Reprocesar el lote') {
        reprocesarPredio()
      } else if (message === 'Reprocesar como Celifrut') {
        reprocesarCelifrut()
      }
    }
    setConfirm(false);
  }, [confirm]);

  const obtenerFruta = async (): Promise<void> => {
    try {
      const request = { action: 'obtener_inventario_descartes' };
      const frutaActual = await window.api.server2(request)
      if (frutaActual.status !== 200) throw new Error(`Code ${frutaActual.status}: ${frutaActual.message}`)
      setDatosOriginales(frutaActual.data)
      dispatch({ type: 'initialData', data: frutaActual.data, filtro: '' })
    } catch (e) {
      if (e instanceof Error) {
        messageModal("error", `${e.message}`)
      }
    }
  }
  const isProcesar = (data): void => {
    const keys = Object.keys(data)
    const enf = keys.map((item) => item.split('/')[0])
    const setEnfs = new Set(enf)
    const arrayEnf = [...setEnfs]
    if (arrayEnf.length === 1) {
      setReprocesar(true)
    } else {
      setReprocesar(false)
    }
  }
  const seleccionarItems = (e): void => {
    const id = e.target.value
    const [enf, descarte, tipoDescarte] = e.target.value.split('/')
    const lote = table.find((lote) => enf === lote._id)
    if (e.target.checked && lote) {
      enfObj[id] = lote && lote[descarte][tipoDescarte]
    } else if (!e.target.checked && lote) {
      delete enfObj[id]
    }
    isProcesar(enfObj)
    setRender(!render)
  }
  const seleccionarVariosItems = (items): void => {
    for (const i of items) {
      const id = i.value
      const [enf, descarte, tipoDescarte] = i.value.split('/')
      const lote = table.find((lote) => enf === lote._id)
      if (i.checked && lote) {
        enfObj[id] = lote && lote[descarte][tipoDescarte]
      } else if (!i.checked && lote) {
        delete enfObj[id]
      }
      setRender(!render)
    }
    isProcesar(enfObj)
  }
  const procesar = (data: string): void => {
    setMessage(data)
    setShowConfirmation(true)
    setPropsModal({ action: data, data: enfObj })
  }
  const unCheck = (data: boolean): void => {
    setRespawn(data)
  }
  const reset = (): void => {
    enfObj = {}
  }
  useEffect(() => {
    dispatch({ type: 'filter', data: datosOriginales, filtro: props.filtro })
  }, [props.filtro])




  const handleModificar = (): void => {
    setShowModal(!showModal)
  }
  const handleChange = (name, value, type): void => {
    setFormState((prevState) => ({
      ...prevState,
      [name]: {
        ...prevState[name],
        [type]: value,
      },
    }));
  };
  const reprocesarPredio = async (): Promise<void> => {
    try {
      const objRequest = {}
      const objRequestDescarte = {}
      let _id;
      Object.keys(propsModal.data).forEach(item => {
        const [id, tipoDescarte, descarte] = item.split("/")
        if (!Object.prototype.hasOwnProperty.call(objRequest, tipoDescarte)) {
          objRequest[tipoDescarte] = {}
          _id = id
        }
        if (descarte === "frutaNacional") {
          objRequest[tipoDescarte][descarte] = - propsModal.data[item];
          objRequestDescarte[`${descarte}`] = 0;
        } else {
          objRequest[tipoDescarte][descarte] = - propsModal.data[item];
          objRequestDescarte[`${tipoDescarte}.${descarte}`] = 0;
        }

      });
      const request = {
        _id: _id,
        query: objRequestDescarte,
        inventario: objRequest,
        action: 'reprocesar_predio'
      }
      const response = await window.api.server2(request)
      if (response.status !== 200) {
        throw new Error(`Code ${response}: ${response.message}`)

      }
      messageModal("success", "Fruta vaciada!")
    } catch (e) {
      if (e instanceof Error) {
        messageModal("error", `Error: ${e.message}`)
      }
    } finally {
      unCheck(false)
      setMessage('')
      obtenerFruta()
      setShowConfirmation(false)
      reset()
    }
  };
  const reprocesarCelifrut = async (): Promise<void> => {
    try {
      const kilos = Object.keys(propsModal.data).reduce((acu, item) => acu += propsModal.data[item], 0);
      const objRequest = []
      const objectInventario = {
        descarteLavado: { descarteGeneral: 0, pareja: 0, balin: 0 },
        descarteEncerado: { descarteGeneral: 0, pareja: 0, balin: 0, extra: 0, suelo: 0 }
      }
      let _id;
      Object.keys(propsModal.data).forEach(item => {
        const [id, tipoDescarte, descarte] = item.split("/")
        if (!Object.prototype.hasOwnProperty.call(objRequest, id)) {
          objRequest[id] = {}
          _id = id
        }
        objRequest[id][`${tipoDescarte}.${descarte}`] = propsModal.data[item];
        objectInventario[tipoDescarte][descarte] += - propsModal.data[item];
      });
      const array = Object.keys(objRequest).map(key => {
        return {
          _id: key,
          ...objRequest[key]
        };
      });
      const lote = table.find(lote => lote._id === _id);

      const datos = {
        predio: "65c27f3870dd4b7f03ed9857",
        canastillas: "0",
        kilos: kilos,
        placa: "AAA000",
        tipoFruta: lote?.tipoFruta,
        observaciones: "Reproceso",
        promedio: Number(kilos) / (lote?.tipoFruta === "Naranja" ? 19 : 20),
        descarteLavado: { balin: 0, pareja: 0, descarteGeneral: 0, descompuesta: 0, piel: 0, hojas: 0 },
        descarteEncerado: { balin: 0, pareja: 0, extra: 0, descarteGeneral: 0, descompuesta: 0, suelo: 0 },
      }

      const request = {
        lote: datos,
        lotes: array,
        inventario: objectInventario,
        action: 'reprocesar_celifrut',
      };

      const responseReprocesoCelifrut = await window.api.server2(request);
      if (responseReprocesoCelifrut.status !== 200)
        throw new Error(`Code ${responseReprocesoCelifrut}: ${responseReprocesoCelifrut.message}`)

    }
    catch (e) {
      if (e instanceof Error) {
        messageModal("error", `Error: ${e.message}`)
      }
    } finally {
      unCheck(false)
      setMessage('')
      obtenerFruta()
      setShowConfirmation(false)
      propsAction()
    }
  };


  const propsAction = (): void => {
    unCheck(false)
    setMessage('')
    reset()
  }
  const abrirResumen = (resumen: lotesType[]): void => {
    setShowResumen(true)
    setResumen(resumen)
  }
  const cerrarResumen = (): void => {
    setShowResumen(false)
    setResumen(undefined)
  }

  return (
    <div className='componentContainer'>
      <ModalCrearRegistroFrutaDescompuesta
        table={table}
        formState={formState}
        setFormState={setFormState}
        filtro={props.filtro}
      />

      <BotonesInventarioDescartes
        setModal={setModal}
        formState={formState}
        handleChange={handleChange}
        table={table}
        enfObj={enfObj}
        reprocesar={reprocesar}
        procesar={procesar}
      />
      {table &&
        table.map((lote) => (
          <div key={lote._id}>
            <TarjetaInvetarioDescartes
              lote={lote}
              setLoteSeleccionado={setLoteSeleccionado}
              handleModificar={handleModificar}
              seleccionarItems={seleccionarItems}
              seleccionarVariosItems={seleccionarVariosItems}
              respawn={respawn}
            />
          </div>
        ))}
      {modal &&
        createPortal(
          <ModalConfirmarProcesoDescarte
            obtenerFruta={obtenerFruta}
            filtro={props.filtro}
            table={table}
            setModal={setModal}
            formState={formState}
            setFormState={setFormState}
            abrirResumen={abrirResumen}
          />,
          document.body
        )}



      {showModal &&
        <ModalModificarInventarioDescarte
          showModal={showModal}
          loteSeleccionado={loteSeleccionado}
          handleModificar={handleModificar}

        />}
      {showConfirmation && <ConfirmacionModal message={message} setConfirmation={setConfirm} setShowConfirmationModal={setShowConfirmation} />}
      {showResumen && <ModalInfoDescartes cerrarResumen={cerrarResumen} data={resumen} />}
    </div>
  )
}
