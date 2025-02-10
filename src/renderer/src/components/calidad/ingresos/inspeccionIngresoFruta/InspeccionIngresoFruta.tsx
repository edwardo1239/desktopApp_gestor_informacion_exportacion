/* eslint-disable prettier/prettier */
import { useEffect, useState } from 'react'

import { lotesType } from '@renderer/types/lotesType';
import useAppContext from '@renderer/hooks/useAppContext';
import NavClasificacionCalidad from './utils/NavClasificacionCalidad';
import './css/styles.css';
import IngresoDatos from './components/IngresoDatos';
import { elementoDefectoType } from './types/clasificacionTypes';
import ShowData from './components/ShowData';
import ConfirmacionModal from '@renderer/messages/ConfirmacionModal';

export default function InspeccionIngresoFruta(): JSX.Element {
  const { messageModal, eventoServidor, triggerServer } = useAppContext();
  const [lotesData, setLotesData] = useState<lotesType[]>([])
  const [lote, setLote] = useState<lotesType>()
  const [dataArray, setDataArray] = useState<elementoDefectoType[]>([])
  const [dataFormulario, setDataFormulario] = useState<Record<string, {name:string}>>()

  //modal para confirmar
  const [confirm, setConfirm] = useState<boolean>(false)
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false)
  const [message,] = useState<string>('¿Seguro desea guardar los datos?')
  useEffect(() => {
    obtenerData()
    obtenerDatosFormulario()
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

  
  const obtenerDatosFormulario = async (): Promise<void> => {
    try {
      const request = { action: 'get_info_formulario_inspeccion_fruta' };
      const lotes = await window.api.server2(request)
      if (lotes.status !== 200) {
        throw new Error(`${lotes.message}`);
      }
      setDataFormulario(lotes.data)
    } catch (e) {
      if (e instanceof Error) {
        messageModal("error", `${e.message}`)
      }
    }
  }
  const obtenerData = async (): Promise<void> => {
    try {
      const request = { action: 'get_calidad_ingresos_inspeccionFruta_lotes' };
      const lotes = await window.api.server2(request)
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
      const total = dataArray.reduce((acu, item) => acu += item.lavado, 0);
      if (total === 0) throw new Error('No hay defectos agregados');
      const porcentages = dataArray.map(item => {
        const totalDefecto = item.lavado;
        const porcentage = (totalDefecto) / total;
        return { defecto: item.defecto, porcentage: porcentage }
      });
      const dataObject = porcentages.reduce((acu, item) => {
        acu[`calidad.inspeccionIngreso.${item.defecto}`] = item.porcentage;
        return acu;
      }, {})
      const request = {
        action: 'put_lotes_inspeccion_ingreso',
        data: dataObject,
        _id: lote._id,
        __v: lote.__v
      }
      const response = await window.api.server2(request);
      if (response.status !== 200) {
        throw new Error(`${response.message}`);
      }
      messageModal("success", "Datos guardados con exito!");
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
      <h2>Ingreso Inspección fruta</h2>
      <div className='container-clasificacion-calidad-formulario'>
        <div className='container-clasificacion-calidad-formulario-div'>
          <IngresoDatos setDataArray={setDataArray} dataFormulario={dataFormulario} />
          <button className='defaulButtonAgree' onClick={(): void => setShowConfirmation(true)}>Guardar</button>
        </div>
        <ShowData 
          dataFormulario={dataFormulario}
          dataArray={dataArray}
          eliminarItem={eliminarItem} />
      </div>
      {showConfirmation && <ConfirmacionModal message={message} setConfirmation={setConfirm} setShowConfirmationModal={setShowConfirmation} />}

    </div>
  )
}
