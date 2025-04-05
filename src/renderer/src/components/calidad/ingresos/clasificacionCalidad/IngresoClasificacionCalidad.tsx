/* eslint-disable prettier/prettier */
import { useEffect, useState } from 'react'

import { lotesType } from '@renderer/types/lotesType';
import { requestlotes } from './functions/request';
import useAppContext from '@renderer/hooks/useAppContext';
import NavClasificacionCalidad from './utils/NavClasificacionCalidad';
import './css/styles.css';
import IngresoDatos from './components/IngresoDatos';
import { elementoDefectoType } from './types/clasificacionTypes';
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

      // 1. Calculamos la suma total de 'lavado + encerado'
      const total = dataArray.reduce((acu, item) => acu + item.lavado + item.encerado, 0);
      if (total === 0) {
        throw new Error('No hay defectos agregados');
      }

      // 2. Calculamos los porcentajes sin redondear (valor entre 0 y 1)
      const rawPorcentages = dataArray.map(item => {
        const totalDefecto = item.encerado + item.lavado;
        return {
          defecto: item.defecto,
          porcentage: totalDefecto / total
        };
      });

      // 3. Redondeamos cada porcentaje a 4 decimales y calculamos su suma
      let sumOfRounded = 0;
      const roundedPorcentages = rawPorcentages.map(p => {
        const roundedValue = parseFloat(p.porcentage.toFixed(4));
        sumOfRounded += roundedValue;
        return {
          defecto: p.defecto,
          porcentage: roundedValue
        };
      });

      // 4. Ajustamos la diferencia en el último elemento para que el total sea exactamente 1
      const difference = parseFloat((1 - sumOfRounded).toFixed(4));
      if (roundedPorcentages.length > 0) {
        const lastIndex = roundedPorcentages.length - 1;
        const lastValue = roundedPorcentages[lastIndex].porcentage + difference;
        // Redondeamos nuevamente, para evitar decimales extra
        roundedPorcentages[lastIndex].porcentage = parseFloat(lastValue.toFixed(4));
      }

      const dataObject = roundedPorcentages.reduce((acu, item) => {
        // Ejemplo: "calidad.clasificacionCalidad.defecto1": 0.3333
        acu[`calidad.clasificacionCalidad.${item.defecto}`] = item.porcentage;
        return acu;
      }, {} as Record<string, number>);
  
      const request = {
        action: 'put_calidad_ingresos_clasificacionDescarte',
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
