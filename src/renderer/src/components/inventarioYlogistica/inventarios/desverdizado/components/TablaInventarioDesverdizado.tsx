/* eslint-disable prettier/prettier */

import { formatearFecha } from "@renderer/functions/fechas"
import { lotesType } from "@renderer/types/lotesType"

type propsType = {
    data: lotesType[] | undefined
    handleSelect: (lote:lotesType) => void
}

const headers = ["", "EF1", "Nombre del predio", "Canastillas", "Kilos", "Cuarto Desverdizado", "Fecha Ingreso"]

export default function TablaInventarioDesverdizado(props: propsType): JSX.Element {
    if (props.data === undefined) {
        return <div>Cargando...</div>
    }
    return (
        <div className="table-container">
            <table className="table-main">
                <thead>
                    <tr>
                        {headers.map(item => <th key={item}>{item}</th>)}
                    </tr>
                </thead>
                <tbody>
                    {props.data.map((lote, index) => (
                        <tr key={lote._id} className={`${index % 2 === 0 ? 'fondo-par' : 'fondo-impar'}`}>
                            <td>
                                <input
                                    onClick={():void => props.handleSelect(lote)}
                                    type="radio"
                                    id={lote.enf}
                                    name='lote' />
                            </td>
                            <td>{lote.enf}</td>
                            <td>{lote.predio && lote.predio.PREDIO}</td>
                            <td>{lote.inventarioDesverdizado ? lote.inventarioDesverdizado : 0}</td>
                            <td>{(lote.inventarioDesverdizado ? lote.inventarioDesverdizado : 0) * (lote.promedio ? lote.promedio : 1)}</td>
                            <td>{lote.desverdizado?.cuartoDesverdizado}</td>
                            <td>
                                {formatearFecha(lote.desverdizado?.fechaIngreso ?? '')}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

