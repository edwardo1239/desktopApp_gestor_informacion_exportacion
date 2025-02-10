/* eslint-disable prettier/prettier */
type propsType = {
    setFechaInicio: (e: string) => void
    setFechaFin: (e: string) => void
    setTipoFruta: (e: string) => void
    buscar: () => void
}

export default function FilstrosFecha(props: propsType): JSX.Element {

    const handleTipoFruta = (e): void => {
        props.setTipoFruta(e.target.value)
    }

    return (
        <div className="filtroContainer">
            <div className='div-filter-actions'>

                <label>
                    <p>Tipo de fruta</p>
                    <select name="tipoFruta" onChange={handleTipoFruta}>
                        <option value="">Tipo de fruta</option>
                        <option value="Naranja">Naranja</option>
                        <option value="Limon">Limon</option>
                    </select>
                </label>
                <label>
                    <p>Fecha Incio</p>
                    <input type="date" onChange={(e): void => props.setFechaInicio(e.target.value)} />
                </label>
                <label>
                    <p>Fecha Fin</p>
                    <input type="date" onChange={(e): void => props.setFechaFin(e.target.value)} />
                </label>
                <label>
                    <button onClick={(): void => props.buscar()}>Buscar</button>
                </label>
            </div>
        </div>

    )

}
