/* eslint-disable prettier/prettier */
import { lotesType } from "@renderer/types/lotesType"
import { PiNotePencilDuotone } from "react-icons/pi";

type propsType = {
    data: lotesType[] | undefined
    handleModificar: () => void
    setLoteSeleccionado: (lote) => void

}

export default function TablaDescarteEncerado(props: propsType): JSX.Element {
    const headers = ["EF1", "Predio", "Tipo de fruta", "General", "Pareja", "Balin", "Extra", "Suelo", "Descompuesta",""]
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
                        <td>{lote.descarteEncerado?.descarteGeneral.toLocaleString("es-ES")} Kg</td>
                        <td>{lote.descarteEncerado?.pareja.toLocaleString("es-ES")} Kg</td>
                        <td>{lote.descarteEncerado?.balin.toLocaleString("es-ES")} Kg</td>
                        <td>{lote.descarteEncerado?.extra.toLocaleString("es-ES")} Kg</td>
                        <td>{lote.descarteEncerado?.suelo.toLocaleString("es-ES")} Kg</td>
                        <td>{lote.descarteEncerado?.descompuesta.toLocaleString("es-ES")} Kg</td>
                        <td>
                            <button style={{ color: "blue" }} onClick={(): void => handleButton(lote)} ><PiNotePencilDuotone /></button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}
