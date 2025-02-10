/* eslint-disable prettier/prettier */
type propsType = {
    setFiltroResponsable: (responsable) => void
    setFechaInicio: (date) => void
    setFechaFin: (date) => void
    buscar: () => void
}
export default function FiltrosHigienePersonal(props: propsType): JSX.Element {

    return (
        <div className="filtroContainer">
            <label>
                <p>Responsable</p>
                <input type="text" placeholder="Nombre..." onChange={(e): void => props.setFiltroResponsable(e.target.value)} />
            </label>
            <label>
                <p>Fecha Incio</p>
                <input type="date" onChange={(e): void => props.setFechaInicio(e.target.value)} />
            </label>

            <label>
                <p>Feca fin</p>
                <input type="date" onChange={(e): void => props.setFechaFin(e.target.value)} />
            </label>
            <label>
                <button onClick={(): void => props.buscar()}>Buscar</button>
            </label>
        </div>
    )
}