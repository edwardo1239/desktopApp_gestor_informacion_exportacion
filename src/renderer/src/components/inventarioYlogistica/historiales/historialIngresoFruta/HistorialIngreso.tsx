/* eslint-disable prettier/prettier */

import { useEffect, useState } from "react";
import TablaHistorialIngresoFruta from "./components/TablaHistorialIngresoFruta";
import useAppContext from "@renderer/hooks/useAppContext";
import { requestLotes } from "./services/request";

import ModalModificarLote from "./components/ModalModificarLote";
import { recordLotesType } from "@renderer/types/recorLotesType";
import BotonesPasarPaginas from "@renderer/components/UI/BotonesPasarPaginas";


export default function HistorialIngresoFruta(): JSX.Element {
  const { messageModal, eventoServidor, triggerServer } = useAppContext();
  const [data, setData] = useState<recordLotesType[]>()
  const [page, setPage] = useState<number>(1);
  const [numeroElementos, setNumeroElementos] = useState<number>()
  const [showModal, setShowModal] = useState<boolean>(false)
  const [loteSeleccionado, setLoteSeleccionado] = useState<recordLotesType>()
  //vuelve a pedir los datos al servidor
  const obtenerData = async (): Promise<void> => {
    try {
      const request = requestLotes(page)
      const response = await window.api.server2(request)
      if (response.status !== 200)
        throw new Error(response.message)
      setData([...response.data])
    } catch (e) {
      if (e instanceof Error)
        messageModal("error", e.message)
    }
  }
  const obtenerCantidadElementos = async (): Promise<void> => {
    try {
      const request = {
        action: "get_inventario_historiales_ingresoFruta_numeroElementos"
      }
      const response = await window.api.server2(request);
      if (response.status !== 200)
        throw new Error(`Code ${response.status}: ${response.message}`)
      setNumeroElementos(response.data)
      console.log("numero de datos ", response)
    } catch (err) {
      if (err instanceof Error) {
        messageModal("error", err.message)
      }
    }
  }


  useEffect(() => {
    if (eventoServidor === 'add_lote') {
      obtenerData()
    }
  }, [triggerServer])


  useEffect(() => {
    obtenerData()
  }, [page])

  useEffect(() => {
    obtenerCantidadElementos()
  }, [])

  const handleModificar = (): void => {
    setShowModal(!showModal)
  }
  return (
    <div>
      <div className="navBar"></div>
      <h2>Historial ingreso fruta</h2>
      <TablaHistorialIngresoFruta
        setLoteSeleccionado={setLoteSeleccionado}
        data={data}
        handleModificar={handleModificar} />
      <BotonesPasarPaginas
        numeroElementos={numeroElementos}
        page={page}
        setPage={setPage}
        division={50} />

      {showModal &&
        <ModalModificarLote
          obtenerData={obtenerData}
          showModal={showModal}
          loteSeleccionado={loteSeleccionado}
          handleModificar={handleModificar} />}
    </div>
  );
};



