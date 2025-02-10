/* eslint-disable prettier/prettier */
import { lotesType } from '@renderer/types/lotesType'
import FilaTablaFrutaSinProcesar from '../components/FilaTablaFrutaSinProcesar';
import ModalFrutaSinProcesarEnCamino from '../components/ModalFrutaSinProcesarEnCamino';
import ModalFrutaSinProcesarToInventario from '../components/ModalFrutaSinProcesarToInventario';
import { useEffect, useState } from 'react';
import ModalCantidadFrutaInspeccion from '../components/ModalCantidadFrutaInspeccion';
import ModalFrutaSinProcesarDerogacion from '../components/ModalFrutaSinProcesarDerogacion';

type propsType = {
  data: lotesType[]
  clickLote: (e) => void
  loteSeleccionado: lotesType | undefined
}

export default function TableFrutaSinProcesar(props: propsType): JSX.Element {
  const header = ["", "EF1", "Nombre del predio", "Codigo ICA", "Fecha ingreso", "Fecha ingreso inventario", "Kilos", "Canastillas", "Tipo de fruta", "Calidad", "Observaciones", ""]
  const [ef1, setEf1] = useState<string>()
  const [newCanastillas, setNewCanastillas] = useState<string>()

  const obtener_ef1 = async (): Promise<void> => {
    try {
      const request = { action: "obtenerEF1" }
      const response = await window.api.server2(request)
      if (response.status !== 200)
        throw new Error(`Code ${response.status}: ${response.message}`)
      setEf1(response.data)
      console.log(response)
    } catch (err) {
      if (err instanceof Error) {
        console.log(err.message)
      }
    }
  }
  useEffect(() => {
    obtener_ef1();
  }, [])

  return (
    <>
      <div className="table-container">
        <table className='table-main'>
          <thead>
            <tr >
              {header.map(item => (
                <th key={item}>{item}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {props.data.map((lote, index) => (
              <FilaTablaFrutaSinProcesar
                lote={lote}
                index={index}
                key={index}
                clickLote={props.clickLote}
              />
            ))}
          </tbody>
        </table>
      </div>
      <ModalFrutaSinProcesarEnCamino clickLote={props.clickLote} loteSeleccionado={props.loteSeleccionado} />
      <ModalFrutaSinProcesarToInventario
        setNewCanastillas={setNewCanastillas}
        ef1={ef1}
        loteSeleccionado={props.loteSeleccionado} />
      <ModalCantidadFrutaInspeccion
        canastillas={newCanastillas}
        loteSeleccionado={props.loteSeleccionado}
      />
      <ModalFrutaSinProcesarDerogacion loteSeleccionado={props.loteSeleccionado} clickLote={props.clickLote} />
    </>
  )
}
