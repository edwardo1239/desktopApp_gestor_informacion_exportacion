/* eslint-disable prettier/prettier */

import useAppContext from "@renderer/hooks/useAppContext";
import { useEffect, useState } from "react";
import { lotesType } from "@renderer/types/lotesType";
import TableHistorialCalidadInterna from "./components/TableHistorialCalidadInterna";
import ModalModificarHistorialCalidadInterna from "./components/ModalModificarHistorialCalidadInterna";
import { requestData } from "./services/request";
import BotonesPasarPaginas from "@renderer/components/UI/BotonesPasarPaginas";

export default function HistorialCalidadInterna(): JSX.Element {
  const { messageModal, eventoServidor, triggerServer } = useAppContext();
  const [data, setData] = useState<lotesType[]>()
  const [page, setPage] = useState<number>(1)
  const [numeroElementos, setNumeroElementos] = useState<number>(1)
  const [showModal, setShowModal] = useState<boolean>(false)
  const [loteSeleccionado, setLoteSeleccionado] = useState<lotesType>()

  useEffect(()=>{
    obtenerNumeroDatos()
  },[])

  useEffect(() => {
    obtenerData()
    window.api.reload(() => {
      obtenerData()
    });
    return () => {
      window.api.removeReload()
    }
  }, [page])

  useEffect(() => {
    if (
      eventoServidor === 'calidad_interna' 
    ) {
      obtenerData()
    }
  }, [triggerServer])

  const obtenerData = async (): Promise<void> => {
    try {
      const request = requestData(page)
      const response = await window.api.server2(request)
      if (response.status !== 200)
        throw new Error(response.message)
      console.log(response)
      setData([...response.data])
    } catch (e) {
      if (e instanceof Error)
        messageModal("error", e.message)
    }
  }
  const obtenerNumeroDatos = async (): Promise<void> => {
    try{
      const request = {
        action: "get_calidad_historial_calidadInterna_numeroElementos"
      }
      const response = await window.api.server2(request)
      if(response.status !== 200){
        throw new Error(`Code ${response.status}: ${response.message}`)
      }
      setNumeroElementos(response.data)
    }catch(err){
      if(err instanceof Error){
        messageModal("error", err.message)
      }
    }
  }
  const handleModificar = (): void => {
    setShowModal(!showModal)
  }
  return (
    <div className='componentContainer'>
      <div className='navBar'></div>
      <h2>Historial Calidad Interna</h2>
      <TableHistorialCalidadInterna
        setLoteSeleccionado={setLoteSeleccionado}
        handleModificar={handleModificar}
        data={data} />


      <BotonesPasarPaginas
        division={50}
        page={page}
        numeroElementos={numeroElementos}
        setPage={setPage} />

      {showModal &&
        <ModalModificarHistorialCalidadInterna
          showModal={showModal}
          obtenerData={obtenerData}
          loteSeleccionado={loteSeleccionado}
          handleModificar={handleModificar}
        />}
    </div>
  )
}
