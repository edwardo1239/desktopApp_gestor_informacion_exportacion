/* eslint-disable prettier/prettier */
import { predioType } from "@renderer/components/inventarioYlogistica/inventarios/reproceso descarte/types/types"
import { filtroCalidadType } from "../functions/filtroProceso"

type propsType = {
  prediosData: predioType[]
  buscar: () => void
  filtro: filtroCalidadType
  handleChangeFiltro: (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => void

}

export default function FiltroFilasCalidad(props: propsType): JSX.Element {
  return (
    <div className="filtroContainer">
      <label>
        <p>Tipo fruta</p>
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
        <p>Codigo lote</p>
        <input value={props.filtro.enf} type="text" placeholder="EF1-" name="enf" onChange={props.handleChangeFiltro} />
      </label>
      <label >
        <p>Fecha Incio</p>
        <input type="date" name="fechaInicio" value={props.filtro.fechaInicio} onChange={props.handleChangeFiltro} />
      </label>
      <label>
        <p>Fecha Fin</p>
        <input type="date" name="fechaFin" value={props.filtro.fechaFin} onChange={props.handleChangeFiltro} />
      </label>
      <label>
        <p>Criterios</p>
        <select onChange={props.handleChangeFiltro} value={props.filtro.criterio} name="criterio">
          <option value="">Criterio</option>
          <option value="acidez">Acidez</option>
          <option value="brix">Brix</option>
          <option value="ratio">Ratio</option>
          <option value="peso">Peso</option>
          <option value="zumo">Zumo</option>
        </select>
      </label>
      {props.filtro.criterio !== '' &&
        <label >
          <p>Umbral</p>
          <div>
            <input type="number" placeholder="min" name="umbralMin" value={Number(props.filtro.umbralMin)} onChange={props.handleChangeFiltro} />
            -
            <input type="number" placeholder="max" name="umbralMax" value={Number(props.filtro.umbralMax)} onChange={props.handleChangeFiltro} />
          </div>
        </label>}
      {/* {criterio !== '' &&
        <label>
          <p>Ordenar por</p>
          <select onChange={handleOrdenar}>
          <option value="-1">Ordenado por</option>
          <option value="1">De menor a mayor</option>
          <option value="-1">De mayor a menor</option>
        </select>
        </label>
        } */}
      <label>
        <p>Cantidad de datos</p>
        <input type="number" min={0} name="limit" value={Number(props.filtro.limit)} onChange={props.handleChangeFiltro} />
      </label>
      <label className="lotes-filtros-columnas-label">
        <input type="checkbox" name="todosLosDatos" checked={props.filtro.todosLosDatos} onChange={props.handleChangeFiltro}/>
        Todos los datos
      </label>
      <label>
        <button onClick={(): void => props.buscar()}>Buscar</button>
      </label>
    </div>
  )
}
