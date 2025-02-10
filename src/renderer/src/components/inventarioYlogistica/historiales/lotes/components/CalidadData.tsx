/* eslint-disable prettier/prettier */
import { useEffect, useState } from "react"
import { filtroColumnasCalidadType } from "../type/types"
import { KEY_FILTRO_COL_CALIDAD, filtrosColumnasObjCalidad } from "../functions/constantes"
import FiltroFilasCalidad from "../utils/FiltrosFilasCalidad"
import TableInfolotesCalidad from "../table/TableInfolotesCalidad"
import PromediosCalidad from "../utils/PromediosCalidad"
import GraficasBarrasCalidad from "../utils/GraficasBarrasCalidad"
import GraficasLinealCalidad from "../utils/GraficaLinealCalidad"
import { filtroCalidadInit, filtroCalidadType } from "../functions/filtroProceso"
import { lotesType } from "@renderer/types/lotesType"
import useAppContext from "@renderer/hooks/useAppContext"
import { requestLotes, requestProveedor } from "../functions/request"
import { predioType } from "@renderer/components/inventarioYlogistica/inventarios/reproceso descarte/types/types"
import { ordenarDataExcelCalidad } from "../functions/functions"

export default function CalidadData(): JSX.Element {
  const { messageModal } = useAppContext();

  const [columnVisibility, setColumnVisibility] = useState<filtroColumnasCalidadType>(filtrosColumnasObjCalidad)
  const [filtro, setFiltro] = useState<filtroCalidadType>(filtroCalidadInit)
  const [prediosData, setPrediosData] = useState<predioType[]>([])
  const [data, setData] = useState<lotesType[]>([])
  const [tipoGraficas, setTipoGraficas] = useState<string>('')
  //vuelve a pedir los datos al servidor
  const [reload, setReload] = useState<boolean>(false);

  useEffect(()=>{obtenerProveedores();}, []);
  useEffect(() => {
    const saved = localStorage.getItem("lotes_filtro_rows_calidad");
    const savedCol = localStorage.getItem("lotes_filtro_col_calidad");
    if (saved) {
      setFiltro(JSON.parse(saved))
    }
    if (savedCol) {
      setColumnVisibility(JSON.parse(savedCol))
    }
    window.api.reload(() => {
      setReload(!reload)
    });
    window.api.Descargar(() => {
      const dataOrdenada = ordenarDataExcelCalidad(data)
      const dataR = JSON.stringify(dataOrdenada)
      window.api.crearDocumento(dataR)
    })
    return () => {
      window.api.removeReload()
    }

  }, [reload])

  const obtenerProveedores = async (): Promise<void> => {
    try {
      const response = await window.api.server2(requestProveedor);
      if (response.status !== 200) throw new Error(`Code ${response.status}: ${response.message}`)
      setPrediosData(response.data)
    } catch (e: unknown) {
      if (e instanceof Error) {
        messageModal("error", `${e.message}`);
      }
    }
  }
  const obtenerData = async (): Promise<void> => {
    try {

      const request = requestLotes(filtro)
      const datosLotes = await window.api.server2(request);
      if (datosLotes.status !== 200)
        throw new Error(datosLotes.message)
      setData(datosLotes.data)
    } catch (e: unknown) {
      if (e instanceof Error) {
        messageModal("error", `${e.message}`);
      }
    }
  }
  const handleChange = (e): void => {
    setColumnVisibility({
      ...columnVisibility,
      [e.target.value]: e.target.checked,
    });
  }
  const buscar = (): void => {
    localStorage.setItem("lotes_filtro_rows_calidad", JSON.stringify(filtro))
    localStorage.setItem("lotes_filtro_col_calidad", JSON.stringify(columnVisibility))
    obtenerData()
  }
  const handleChangeFiltro = (event): void => {
    const { name, value, checked } = event.target;
    if (name === 'todosLosDatos') {
      console.log(checked)
      setFiltro({
        ...filtro,
        [name]: checked,
      });
    } else {
      const uppercaseValue = name === 'enf' ? value.toUpperCase().trim() : value;
      setFiltro({
        ...filtro,
        [name]: String(uppercaseValue),
      });
    }

  };
  return (
    <div className="componentContainer">
      <div><h2>Lotes calidad</h2></div>
      <div className="m-2">
        <div className="filtroContainer">
          <div className="lotes-filtros-columnas-div">
            {Object.keys(columnVisibility).map(item => (
              <label key={item} className="lotes-filtros-columnas-label">
                <input type="checkbox" value={item} onClick={handleChange} checked={columnVisibility[item]} />
                <p>{KEY_FILTRO_COL_CALIDAD[item]}</p>
              </label>
            ))}
          </div>
        </div>
        <div>
          <FiltroFilasCalidad
            filtro={filtro}
            prediosData={prediosData}
            buscar={buscar}
            handleChangeFiltro={handleChangeFiltro}
          />
        </div>
      </div>
      <div>
        <PromediosCalidad data={data} columnVisibility={columnVisibility} />
      </div>
      <div className="lotes-select-tipo-grafica-div">
        <select className="defaultSelect" onChange={(e): void => setTipoGraficas(e.target.value)}>
          <option value="">Tipo de gráficas</option>
          <option value="barras">Grafica de barras</option>
          <option value="lineal">Histograma</option>
        </select>
      </div>
      <div className="lotes-grafica-container">
        {tipoGraficas === 'barras' && <GraficasBarrasCalidad data={data} />}
        {tipoGraficas === 'lineal' && <GraficasLinealCalidad data={data} />}

      </div>
      <div>
        <TableInfolotesCalidad data={data} columnVisibility={columnVisibility} />
      </div>
    </div>
  )
}
