/* eslint-disable prettier/prettier */
import { PiNotePencilDuotone } from "react-icons/pi";
import { recordLotesType } from "@renderer/types/recorLotesType";
import { formatearFecha } from "@renderer/functions/fechas";

type propsType = {
    data: recordLotesType[] | undefined
    handleModificar: () => void
    setLoteSeleccionado: (lote) => void
}
export default function TablaHistorialIngresoFruta(props: propsType): JSX.Element {
    if (props.data === undefined) return <div>Cargando...</div>
    const headers = ["EF1", "Predio", "Numero de canastillas", "Kilos", "Fecha creación", "Fecha estimada de llegada", "Tipo de fruta", "Observaciones", "Placa", "User", ""]
    const handleButton = (lote): void => {
        props.handleModificar()
        props.setLoteSeleccionado(lote)
    }
    return (
        <div className="table-container">
            <table className="table-main">
                <thead>
                    <tr >
                        {headers.map(item => (
                            <th key={item}>{item}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {props.data.map((lote, index) => (
                        <tr className={`${index % 2 === 0 ? 'fondo-par' : 'fondo-impar'}`} key={lote._id} >
                            <td>{lote.documento.enf}</td>
                            <td>{lote.documento.predio?.PREDIO}</td>
                            <td>{lote.documento.canastillas}</td>
                            <td>{lote.documento.kilos?.toLocaleString('es-ES')}</td>
                            <td>{formatearFecha(lote.documento.fecha_creacion, true)}</td>
                            <td>{formatearFecha(lote.documento.fecha_ingreso_inventario, true)}</td>
                            <td>{lote.documento.tipoFruta}</td>
                            <td>{lote.documento.observaciones}</td>
                            <td>{lote.documento.placa}</td>
                            <td>{lote.user}</td>
                            <td>
                                <button style={{ color: "blue" }} onClick={(): void => handleButton(lote)} ><PiNotePencilDuotone /></button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}