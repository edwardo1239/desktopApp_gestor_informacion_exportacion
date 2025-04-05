/* eslint-disable prettier/prettier */
import { useState, useEffect } from 'react'
import { lotesType } from '@renderer/types/lotesType'
import { serverResponse } from '@renderer/env'
import { requestAddItemOrdenVaceo, requestLotes, requestOrdenVaceo } from '../functions/request'
import useAppContext from '@renderer/hooks/useAppContext'
import PrediosEnInventario from './PrediosEnInventario'
import "../css/ordenVaceo.css"
import ListaOrdenVaceo from './ListaOrdenVaceo'
import { reoreder } from '../functions/functions'



export default function OrdenVaceo(): JSX.Element {
  const { messageModal, eventoServidor, triggerServer } = useAppContext();
  const [lotes, setLotes] = useState<lotesType[]>([])
  const [lotesOriginal, setLotesOriginal] = useState<lotesType[]>([])
  const [ordenVaceo, setOrdenVaceo] = useState<string[]>([])
  const [lotesOrdenVaceo, setLotesOrdenVaceo] = useState<lotesType[]>([])

  const obtenerData = async (): Promise<void> => {
    try {
      const responseLotes: serverResponse<lotesType[]> = await window.api.server2(requestLotes)
      
      if (responseLotes.status !== 200) {
        throw new Error(responseLotes.message);
      }
      const responseOrden = await window.api.server2(requestOrdenVaceo)
      if (responseOrden.status !== 200) {
        throw new Error(responseOrden.message)
      }
      setOrdenVaceo(responseOrden.data)

      const nuevosLotes = responseLotes.data.filter((lote) => !responseOrden.data.includes(lote._id))
      setLotes(nuevosLotes)
      setLotesOriginal(nuevosLotes)
      const nuevosLotesOrdenVaceo = responseOrden.data.map((_id) => responseLotes.data.find(lote => lote._id === _id))
      setLotesOrdenVaceo(nuevosLotesOrdenVaceo)

    } catch (error) {
      if (error instanceof Error) {
        messageModal("error", error.message);
      }
    }
  }

  useEffect(() => {
    obtenerData()
  }, [])


  useEffect(() => {
    if (
      eventoServidor === 'add_lote' ||
      eventoServidor === 'vaciar_lote' ||
      eventoServidor === 'directo_nacional' ||
      eventoServidor === 'modificar_orden_vaceo' ||
      eventoServidor === 'modificar_historial_fruta_procesada' ||
      eventoServidor === 'inspeccion_fruta' ||
      eventoServidor === 'derogar_lote' ||
      eventoServidor === 'enviar_desverdizado' ||
      eventoServidor === 'finalizar_desverdizado'
    ) {
      obtenerData()
    }
  }, [triggerServer])

  const handleAddOrdenVaceo = async (_id): Promise<void> => {
    try {
      setOrdenVaceo(item => [...item, String(_id)]);
      const req = requestAddItemOrdenVaceo([...ordenVaceo, String(_id)]);
      const response = await window.api.server2(req);
      if (response.status !== 200) {
        throw new Error(response.message);
      }
      messageModal("success", "Guardado con exito");
      await obtenerData()
    } catch (e) {
      if (e instanceof Error) {
        messageModal("error", e.message);
      }
    }
  }
  const handleRemoveOrdenVaceo = async (_id): Promise<void> => {
    try {
      const nuevaOrdenVaceo = ordenVaceo.filter(item => item !== String(_id));
      setOrdenVaceo(nuevaOrdenVaceo);

      const req = requestAddItemOrdenVaceo([...nuevaOrdenVaceo]);
      const response = await window.api.server2(req);
      if (response.status !== 200) {
        throw new Error(response.message);
      }
      messageModal("success", "Guardado con exito");
      await obtenerData()
    } catch (e) {
      if (e instanceof Error) {
        messageModal("error", e.message);
      }
    }
  }
  const handleMoveOrdenVaceo = async (source, destination): Promise<void> => {
    try {

      const newOrdenVaceo = reoreder(ordenVaceo, source, destination);
      const req = requestAddItemOrdenVaceo(newOrdenVaceo);
      const response = await window.api.server2(req);
      if (response.status !== 200) {
        throw new Error(response.message);
      }
      messageModal("success", "Guardado con exito");
      await obtenerData()

    } catch (e) {
      if (e instanceof Error) {
        messageModal("error", e.message);
      }
    }
  }
  return (
    <div className="componentContainer">
      <div className='orden-vaceo-div'>
        <PrediosEnInventario
          setLotes={setLotes}
          lotes={lotes}
          lotesOriginal={lotesOriginal}
          handleAddOrdenVaceo={handleAddOrdenVaceo} />
        <ListaOrdenVaceo
          lotes={lotes}
          handleRemoveOrdenVaceo={handleRemoveOrdenVaceo}
          lotesOrdenVaceo={lotesOrdenVaceo}
          handleMoveOrdenVaceo={handleMoveOrdenVaceo} />
      </div>
    </div>
  )
}


