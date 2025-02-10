/* eslint-disable prettier/prettier */
import { lotesType } from "@renderer/types/lotesType"
import { obtenerPorcentage } from "../functions/data"
import MostrarPrecios from "./MostrarPrecios"

type propsType = {
    loteSeleccionado: lotesType
}

export default function ViewInformeResultados(props: propsType): JSX.Element {
    const data = {
        calidad1: {
            label: "Exportación Tipo 1:",
            tipo: 1
        },
        calidad15: {
            label: "Exportación Tipo Caribe: ",
            tipo: 15
        },
        calidad2: {
            label: "Exportación Tipo 2: ",
            tipo: 2
        },
    }
    return (
        <>
            {Object.keys(data).map(key => (
                <tr key={key}>
                    <td>{data[key].label}</td>
                    <td>{props.loteSeleccionado[key]}</td>
                    <td>{
                        props.loteSeleccionado.kilos &&
                        obtenerPorcentage(props.loteSeleccionado[key], props.loteSeleccionado.kilos).toFixed(2)
                    }% </td>
                    <MostrarPrecios
                        loteSeleccionado={props.loteSeleccionado}
                        tipoPrecio={data[key].tipo}
                        kilosFruta={props.loteSeleccionado[key]}
                    />
                </tr>
            ))}

        </>
    )
}
