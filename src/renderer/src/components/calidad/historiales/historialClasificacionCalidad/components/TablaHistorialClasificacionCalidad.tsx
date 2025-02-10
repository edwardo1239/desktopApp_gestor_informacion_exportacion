/* eslint-disable prettier/prettier */

import { lotesType } from "@renderer/types/lotesType"
import { format } from "date-fns"
import "../css/styles.css"
import { PiNotePencilDuotone } from "react-icons/pi";
import { objetoLimon, objetoNaranja } from "../functions/reduce";
import { es } from 'date-fns/locale';


type propsType = {
    data: lotesType[] | undefined
    handleModificar: () => void
    setLoteSeleccionado: (lote) => void
}
export default function TablaHistorialClasificacionCalidad(props: propsType): JSX.Element {
    const headers = ["EF1", "Predio", "Tipo de fruta", "Defectos", "Fecha", ""]
    if (props.data === undefined) {
        return <div>Cargando....</div>
    }
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
                            <td>{lote.enf}</td>
                            <td>{lote.predio?.PREDIO}</td>
                            <td>{lote.tipoFruta}</td>
                            <td className="historial-clasificacion-calidad-elementos-container">{lote.calidad?.clasificacionCalidad &&
                                Object.keys(lote.calidad?.clasificacionCalidad).map(item => {
                                    if (lote.calidad?.clasificacionCalidad &&
                                        item !== "fecha" &&
                                        lote.calidad?.clasificacionCalidad[item] !== 0) {
                                        let objeto = {}
                                        if (lote.tipoFruta === "Limon") {
                                            objeto = objetoLimon
                                        } else {
                                            objeto = objetoNaranja
                                        }
                                        return (
                                            <div key={lote._id + item} className="historial-clasificacion-calidad-elementos-div">
                                                <h3>{objeto[item]}</h3>
                                                <h4>{(lote.calidad?.clasificacionCalidad[item] * 100).toFixed(3)}%</h4>
                                            </div>
                                        )
                                    } else { return null }
                                })}</td>
                            <td>{format(lote.calidad?.clasificacionCalidad?.fecha ?
                                new Date(lote.calidad?.clasificacionCalidad?.fecha) : new Date(), 'dd/MM/yyyy HH:mm', { locale: es })}</td>
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