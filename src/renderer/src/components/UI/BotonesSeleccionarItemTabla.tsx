/* eslint-disable prettier/prettier */
import { IoSaveSharp } from "react-icons/io5";
import { GiCancel } from "react-icons/gi";
import { PiNotePencilDuotone } from "react-icons/pi";

type propsType = { 
    itemSeleccionadoID?: string
    itemId: string
    handleModificar: (id: string) => void
    handleAceptar: () => void
    handleCancelar: () => void
}

export default function BotonesSeleccionarItemTabla(props: propsType): JSX.Element {
    return (
        <td>
            {(props.itemSeleccionadoID !== props.itemId) &&
                <button
                    style={{ color: "blue" }}
                    onClick={(): void => props.handleModificar(props.itemId)}
                >
                    <PiNotePencilDuotone />
                </button>}

            {(props.itemSeleccionadoID === props.itemId) &&
                <button style={{ color: 'green' }} onClick={props.handleAceptar} >
                    <IoSaveSharp />
                </button>}
            {(props.itemSeleccionadoID === props.itemId) &&
                <button style={{ color: 'red' }} onClick={props.handleCancelar}>
                    <GiCancel />
                </button>}
        </td>
    )
}