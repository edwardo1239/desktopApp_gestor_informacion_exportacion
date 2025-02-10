/* eslint-disable prettier/prettier */
import { useEffect, useState } from 'react'

import { lotesType } from '@renderer/types/lotesType';
import { requestlotes } from './functions/request';
import useAppContext from '@renderer/hooks/useAppContext';
import NavClasificacionCalidad from './utils/NavClasificacionCalidad';
import './css/styles.css';
import IngresoDatos from './components/IngresoDatos';
import { elementoDefectoType, elementoPorcentajeType } from './types/clasificacionTypes';
import ShowData from './components/ShowData';
import ConfirmacionModal from '@renderer/messages/ConfirmacionModal';

export default function IngresoClasificacionCalidad(): JSX.Element {
  const { messageModal, eventoServidor, triggerServer } = useAppContext();
  const [lotesData, setLotesData] = useState<lotesType[]>([])
  const [lote, setLote] = useState<lotesType>()
  const [dataArray, setDataArray] = useState<elementoDefectoType[]>([])
  //modal para confirmar
  const [confirm, setConfirm] = useState<boolean>(false)
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false)
  const [message,] = useState<string>('¿Seguro desea guardar los datos?')
  useEffect(() => {
    obtenerData()
  }, [])

  useEffect(() => {
    if (confirm) {
      guardar();
      setConfirm(false)
    }
  }, [confirm]);


  useEffect(() => {
    if (eventoServidor === 'add_lote') {
      obtenerData()
    }
  }, [triggerServer])

  const obtenerData = async (): Promise<void> => {
    try {
      const lotes = await window.api.server2(requestlotes)
      if (lotes.status !== 200) {
        throw new Error(`${lotes.message}`);
      }
      setLotesData(lotes.data)
    } catch (e) {
      if (e instanceof Error) {
        messageModal("error", `${e.message}`)
      }
    }
  }
  const eliminarItem = (index: number): void => {
    setDataArray(prev => {
      const newArray = [...prev];
      newArray.splice(index, 1); // Eliminar el elemento en el índice especificado
      return newArray;
    })
  }
  const guardar = async (): Promise<void> => {
    try {
      if (!lote?._id) throw new Error("Error, seleccione un lote")
      const total = dataArray.reduce((acu, item) => acu += item.lavado + item.encerado, 0);
      if (total === 0) throw new Error('No hay defectos agregados');
      const porcentages: elementoPorcentajeType[] = dataArray.map(item => {
        const totalDefecto = item.encerado + item.lavado;
        const porcentage = (totalDefecto) / total;
        return { defecto: item.defecto, porcentage: porcentage }
      });
      const dataObject = porcentages.reduce((acu, item) => {
        acu[`calidad.clasificacionCalidad.${item.defecto}`] = item.porcentage;
        return acu;
      },{})
      const request = {
        action: 'put_lotes_clasificacion_descarte',
        data: dataObject,
        _id:lote._id,
        __v:lote.__v
    }
    const response = await window.api.server2(request);
    if (response.status !== 200) {
      throw new Error(`${response.message}`);
    } 
    messageModal("success","Datos guardados con exito!");
    setDataArray([]);
    await obtenerData()

  } catch (err) {
    if (err instanceof Error) {
      messageModal('error', `${err.message}`);
    }
  } finally {
    setShowConfirmation(false);
  }
}

return (
  <div className='componentContainer'>
    <NavClasificacionCalidad lotesData={lotesData} setLote={setLote} />
    <h2>Ingreso clasificación descarte</h2>
    <div className='container-clasificacion-calidad-formulario'>
      <div className='container-clasificacion-calidad-formulario-div'>
        <IngresoDatos setDataArray={setDataArray} />
        <button className='defaulButtonAgree' onClick={(): void => setShowConfirmation(true)}>Guardar</button>
      </div>
      <ShowData dataArray={dataArray} eliminarItem={eliminarItem} />
    </div>
    {showConfirmation && <ConfirmacionModal message={message} setConfirmation={setConfirm} setShowConfirmationModal={setShowConfirmation} />}

  </div>
)
}
