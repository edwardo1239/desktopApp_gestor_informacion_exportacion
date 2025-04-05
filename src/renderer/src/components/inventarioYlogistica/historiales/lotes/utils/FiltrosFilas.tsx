/* eslint-disable prettier/prettier */

import { predioType } from "@renderer/components/inventarioYlogistica/inventarios/reproceso descarte/types/types"
import { filtrotype } from "../functions/filtroProceso"

type propsType = {
  prediosData: predioType[]
  buscar: () => void
  filtro: filtrotype
  handleChangeFiltro: (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => void
}

export default function FiltrosFilas(props: propsType): JSX.Element {
  return (
    <div className="filtroContainer">
      <label>
        <p>Tipo de fruta</p>
        <select name="tipoFruta" onChange={props.handleChangeFiltro} value={props.filtro.tipoFruta}>
          <option value="">Tipo de fruta</option>
          <option value="Naranja">Naranja</option>
          <option value="Limon">Limon</option>
        </select>
      </label>
      <label>
        <p>Nombre predio</p>
        <select name="predio" onChange={props.handleChangeFiltro} value={props.filtro.predio}>
          <option value="">Nombre predios</option>
          {props.prediosData.map((item, index) => (
            <option key={item._id + index} value={item._id}>{item.PREDIO}</option>
          ))}
        </select>
      </label>
      <label>
        <p>Codigo de lote</p>
        <input value={props.filtro.enf} type="text" placeholder="EF1-" name="enf" onChange={props.handleChangeFiltro} />
      </label>
      <label>
        <p>Ordenar por:</p>
        <select name="ordenarPor" onChange={props.handleChangeFiltro} value={props.filtro.ordenarPor}>
          <option value="fecha_creacion">Fecha creación</option>
          <option value="fecha_estimada_llegada">Fecha estimada de llegada</option>
          <option value="fecha_ingreso_inventario">Fecha ingreso</option>
          <option value="fechaProceso">Fecha proceso</option>
        </select>
      </label>
      <label>
        <p>Fecha Inicio</p>
        <input type="date" name="fechaInicio" value={props.filtro.fechaInicio} onChange={props.handleChangeFiltro} />
      </label>

      <label>
        <p>Fecha fin</p>
        <input type="date" name="fechaFin" value={props.filtro.fechaFin} onChange={props.handleChangeFiltro} />
      </label>


      <label>
        <p>Rendimiento</p>
        <div>
          <input type="number" placeholder="min" name="rendimientoMin" value={Number(props.filtro.rendimientoMin)} onChange={props.handleChangeFiltro} />
          -
          <input type="number" placeholder="max" name="rendimientoMax" value={Number(props.filtro.rendimientoMax)} onChange={props.handleChangeFiltro} />
        </div>
      </label>

      <label>
        <p>Cantidad de datos</p>
        <input type="number" min={0} name="limit" value={Number(props.filtro.limit)} onChange={props.handleChangeFiltro} />
      </label>

      <label className="lotes-filtros-columnas-label">
        <input type="checkbox" name="todosLosDatos" checked={props.filtro.todosLosDatos} onChange={props.handleChangeFiltro} />
        Todos los datos
      </label>
      <label>
        <button onClick={(): void => props.buscar()}>Buscar</button>
      </label>
    </div>
  )
}
