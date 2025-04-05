/* eslint-disable prettier/prettier */
import useAppContext from "@renderer/hooks/useAppContext";
import { useEffect, useState } from 'react'
import { lotesType } from "@renderer/types/lotesType";
import TablaInventarioDesverdizado from "./components/TablaInventarioDesverdizado";
import BotonesDesverdizado from "./components/BotonesDesverdizado";
import ModalParametros from "./components/ModalParametros";
import "@renderer/css/dialog-style.css"



export default function Desverdizado(): JSX.Element {
  const { messageModal, eventoServidor, triggerServer } = useAppContext();
  const [data, setData] = useState<lotesType[]>()
  const [dataOriginal, setDataOriginal] = useState<lotesType[]>()
  const [select, setSelect] = useState<lotesType>()

  const [filtro, setFiltro] = useState<string>('')

  useEffect(() => {
    obtenerFruta()
  }, [])

  useEffect(() => {
    if (!dataOriginal || !data) return
    if (filtro === '') {
      setData(dataOriginal)
    } else {
      const dataFilter = dataOriginal.filter(item => (
        item.predio.PREDIO.toLowerCase().includes(filtro.toLowerCase()) ||
        item.enf.toLowerCase().includes(filtro.toLowerCase())
      ))
      setData(dataFilter)
    }
  }, [filtro])

  useEffect(() => {
    if (
      eventoServidor === 'enviar_desverdizado' ||
      eventoServidor === 'vaciar_lote') {
      obtenerFruta()
    }
  }, [triggerServer])

  const obtenerFruta = async (): Promise<void> => {
    try {
      const request = {
        action: 'get_inventarios_frutaDesverdizando_lotes'
      }
      const response = await window.api.server2(request)
      if (response.status !== 200)
        throw new Error(`Code ${response.status}: ${response.message}`)
      setData(response.data)
      setDataOriginal(response.data)
    } catch (e: unknown) {
      messageModal("error", `${e}`)
    }
  }

  const handleSelect = (lote: lotesType): void => {
    setSelect(lote)
  }

  return (
    <div className='componentContainer'>
      <div className="navBar"></div>
      <h2>Fruta desverdizando</h2>
      <hr />
      <ModalParametros select={select} />

      <BotonesDesverdizado
        select={select}
        filtro={filtro}
        setFiltro={setFiltro}
      />

      <TablaInventarioDesverdizado
        handleSelect={handleSelect}
        data={data} />
    </div>
  )
}

