/* eslint-disable prettier/prettier */
type propsType = {
    setFiltro: (e) => void
    filtro: object
    filtrar: () => void
 }
export default function FiltrosExportacionLotes(props:propsType): JSX.Element {
    const handleChange = (e): void => {
        const filtroData = {...props.filtro}
        filtroData[e.target.name] = e.target.value
        props.setFiltro(filtroData)
    }
    return (
        <div className="filtroContainer">
        <label>
            <p>Codigo del lote</p>
            <input type="text" placeholder="EF1-..." onChange={handleChange} name="enf"/>
        </label>
        <label>
            <p>Fecha</p>
            <input type="date" onChange={handleChange} name="fecha" />
        </label>
        <label>
            <p>Tipo fruta</p>
            <select onChange={handleChange} name="tipoFruta">
                <option value="">Tipo de fruta</option>
                <option value="Limon">Limon</option>
                <option value="Naranja">Naranja</option>
            </select>
        </label>
        <label>
            <button onClick={props.filtrar}>Buscar</button>
        </label>
    </div>
    )
}
