/* eslint-disable prettier/prettier */
import { useEffect, useState } from 'react'
import NavBarInventario from './utils/NavBarInventario'
import useAppContext from '@renderer/hooks/useAppContext'
import { lotesType } from '@renderer/types/lotesType';
import TableFrutaSinProcesar from './tables/TableFrutaSinProcesar';
import BotonesAccionFrutaSinProcesar from './components/BotonesAccionFrutaSinProcesar';
import { createPortal } from 'react-dom';
import Directo from './modals/Directo';
import Desverdizado from './modals/Desverdizado';

export default function InventarioFrutaSinProcesar(): JSX.Element {
  const { messageModal, eventoServidor, triggerServer } = useAppContext();
  const [filtro, setFiltro] = useState<string>('')
  const [data, setData] = useState<lotesType[]>()
  const [datosOriginales, setDatosOriginales] = useState<lotesType[]>();

  const [loteSeleccionado, setLoteSeleccionado] = useState<lotesType>()
  const [fechaInicio, SetFechaInicio] = useState<string>()
  const [fechaFin, SetFechaFin] = useState<string>()
  const [tipoDato, setTipoDato] = useState<string>()
  //states de los modales
  const [showVaciarModal, setShowVaciarModal] = useState<boolean>(false)
  const [showDirectoModal, setShowDirectoModal] = useState<boolean>(false)
  const [showDesverdizadoModal, setShowDesverdizadoModal] = useState(false)

  //filtro
  useEffect(() => {
    if (!datosOriginales) return
    let datosFiltrados = datosOriginales;

    // Filtro por texto
    if (filtro !== '') {
      datosFiltrados = datosFiltrados.filter(lote =>
        lote.predio.PREDIO.toLowerCase().includes(filtro.toLowerCase()) ||
        lote.enf && lote.enf.toLowerCase().includes(filtro.toLowerCase()) ||
        lote.tipoFruta.toLowerCase().includes(filtro.toLowerCase())
      );
    }

    // Filtro por fecha
    if (fechaInicio || fechaFin) {
      let fechaFiltroInicio;
      let fechaFiltroFin;

      if (fechaInicio) {
        const fechaInicioUTC = new Date(fechaInicio);
        fechaInicioUTC.setHours(fechaInicioUTC.getHours() + 5);
        fechaFiltroInicio = fechaInicioUTC.getTime(); // Convertir a tiempo en milisegundos para comparación
      } else {
        fechaFiltroInicio = 0; // No hay fecha mínima
      }

      if (fechaFin) {
        const fechaFinUTC = new Date(fechaFin);
        fechaFinUTC.setDate(fechaFinUTC.getDate() + 1)
        fechaFinUTC.setHours(fechaFinUTC.getHours() + 5);
        fechaFiltroFin = fechaFinUTC.getTime(); // Convertir a tiempo en milisegundos para comparación
      } else {
        fechaFiltroFin = 999999999999999; // No hay fecha máxima
      }

      datosFiltrados = datosFiltrados.filter(lote => {
        let fechaIngreso
        if (lote.fecha_ingreso_inventario) {
          fechaIngreso = new Date(lote.fecha_ingreso_inventario).getTime();
        } else if (lote.fecha_ingreso_patio) {
          fechaIngreso = new Date(lote.fecha_ingreso_patio).getTime();
        } else if (lote.fecha_estimada_llegada) {
          fechaIngreso = new Date(lote.fecha_estimada_llegada).getTime();
        }
        return fechaIngreso >= fechaFiltroInicio && fechaIngreso <= fechaFiltroFin;
      });
    }

    if (tipoDato === 'enCamino') {
      datosFiltrados = datosFiltrados.filter(
        lote => !(lote.fecha_ingreso_inventario) && !(lote.fecha_ingreso_patio)
      )
    } else if (tipoDato === 'enPatio') {
      datosFiltrados = datosFiltrados.filter(
        lote => !(lote.fecha_ingreso_inventario) && (lote.fecha_ingreso_patio)
      )
    } else if (tipoDato === 'enInventario') {
      datosFiltrados = datosFiltrados.filter(
        lote => (lote.fecha_ingreso_inventario)
      )
    }

    setData(datosFiltrados);
  }, [filtro, fechaFin, fechaInicio, datosOriginales, tipoDato]);

  const obtenerFruta = async (): Promise<void> => {
    try {
      const request = { action: 'getInventario' };
      const response = await window.api.server2(request)
      if (response.status !== 200)
        throw new Error(`Code ${response.status}: ${response.message}`)
      setData(response.data)
      setDatosOriginales(response.data)
    } catch (e) {
      if (e instanceof Error) {
        messageModal("error", e.message)
      }
    }
  }

  const clickLote = (id): void => {
    if (!data) return
    const lote: lotesType | undefined = data.find((item) => item._id === id)
    if (lote !== undefined) {
      setLoteSeleccionado(lote)
    }
  }

  useEffect(() => {
    if (
      eventoServidor === 'add_lote' ||
      eventoServidor === 'vaciar_lote' ||
      eventoServidor === 'directo_nacional' ||
      eventoServidor === 'modificar_historial_fruta_procesada' ||
      eventoServidor === 'inspeccion_fruta' ||
      eventoServidor === 'derogar_lote' ||
      eventoServidor === 'calidad_interna' ||
      eventoServidor === 'enviar_desverdizado'
    ) {
      obtenerFruta()
    }
  }, [triggerServer])
  useEffect(() => {
    obtenerFruta()
  }, [])


  const handleFilter = (data: string): void => {
    setFiltro(data)
  }


  const closeVaciado = (): void => {
    setShowVaciarModal(!showVaciarModal)
  }
  const closeDirecto = (): void => {
    setShowDirectoModal(!showDirectoModal)
  }
  const closeDesverdizado = (): void => {
    setShowDesverdizadoModal(!showDesverdizadoModal)
  }
  const handleInfo = (): void => {
    setLoteSeleccionado(undefined)
  }

  if (!data) {
    return <div>Cargando datos...</div>
  }

  return (
    <div>
      <NavBarInventario handleFilter={handleFilter} />
      <h2>Fruta sin procesar</h2>
      <hr />


      <div className='filtroContainer'>
        <label>
          <p>Fecha Incio</p>
          <input type="date" onChange={(e): void => SetFechaInicio(e.target.value)} />
        </label>
        <label>
          <p>Fecha Fin</p>
          <input type="date" onChange={(e): void => SetFechaFin(e.target.value)} />
        </label>
        <label>
          <p>Estado</p>
          <select name="estado" onChange={(e): void => setTipoDato(e.target.value)}>
            <option value=""></option>
            <option value="enCamino">En camino</option>
            <option value="enPatio">Recepción pendiente</option>
            <option value="enInventario">En inventario</option>
          </select>
        </label>
      </div>

      <BotonesAccionFrutaSinProcesar
        data={data}
        loteSeleccionado={loteSeleccionado}
        closeVaciado={closeVaciado}
        closeDirecto={closeDirecto}
        closeDesverdizado={closeDesverdizado}
      />

      <TableFrutaSinProcesar
        loteSeleccionado={loteSeleccionado}
        data={data}
        clickLote={clickLote}
      />

      {showDirectoModal &&
        createPortal(
          <Directo
            obtenerFruta={obtenerFruta}
            handleInfo={handleInfo}
            closeDirecto={closeDirecto}
            loteSeleccionado={loteSeleccionado} />,
          document.body
        )}
      {showDesverdizadoModal &&
        createPortal(
          <Desverdizado
            obtenerFruta={obtenerFruta}
            handleInfo={handleInfo}
            closeDesverdizado={closeDesverdizado}
            loteSeleccionado={loteSeleccionado} />,
          document.body
        )}
    </div>
  )
}
