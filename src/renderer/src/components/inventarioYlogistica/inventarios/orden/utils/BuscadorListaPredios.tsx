/* eslint-disable prettier/prettier */
import "../../../../../css/filtros.css"
type propsType = {
    handleFiltro: (e) => void
    setFiltroSelect: (e) => void
}

export default function BuscadorListaPredios(props: propsType): JSX.Element {
    return (
        <div className="filtros-predios-inventario-container">
            <input type="text" className="defaultSelect" onChange={props.handleFiltro} />
            <select className="defaultSelect" onChange={(e): void => props.setFiltroSelect(e.target.value)}>
                <option value="">Tipo de fruta</option>
                <option value="Naranja">Naranja</option>
                <option value="Limon">Limon</option>
            </select>
            <hr />
        </div>
    )
}
