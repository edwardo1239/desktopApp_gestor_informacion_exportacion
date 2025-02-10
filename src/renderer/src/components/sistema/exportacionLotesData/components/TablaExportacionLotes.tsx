/* eslint-disable prettier/prettier */
import { lotesType } from "@renderer/types/lotesType"
import { PiNotePencilDuotone } from "react-icons/pi";
import { numeroContenedorType } from "../services/form";

type propsType = {
    data: lotesType[] | undefined
    handleModificar: () => void
    setLoteSeleccionado: (lote) => void
    numeroContenedor: numeroContenedorType | undefined

}

export default function TablaExportacionLotes(props: propsType): JSX.Element {
    const headers = ["EF1", "Predio", "Tipo de fruta", "Calidad 1","Calidad 1.5", "Calidad 2", "Contenedores", ""]
    if (props.data === undefined) {
        return <div>Cargando....</div>
    }

    const handleButton = (lote): void => {
        props.handleModificar()
        props.setLoteSeleccionado(lote)
    }

    return (
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
                        <td>{lote.calidad1?.toLocaleString("es-ES")} Kg</td>
                        <td>{lote.calidad15?.toLocaleString("es-ES")} Kg</td>
                        <td>{lote.calidad2?.toLocaleString("es-ES")} Kg</td>
                        <td className="sistema-exportacion-lotes-elementos-container">{lote.contenedores?.map(item => (
                            <div key={item + lote._id} className="sistema-exportacion-lotes-elementos-div">
                                {props.numeroContenedor && props.numeroContenedor[item]}
                            </div>
                        ))}</td>
                        <td>
                            <button style={{ color: "blue" }} onClick={(): void => handleButton(lote)} ><PiNotePencilDuotone /></button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}
