/* eslint-disable prettier/prettier */
import { ImCancelCircle } from "react-icons/im";
import { clienteType } from "@renderer/types/clientesType"

type propsType = {
    cliente: clienteType
    deleteCliente: (_id) => void
}

export default function ClientesComponent(props: propsType): JSX.Element {

    return (
        <div
            className={`comercial-precios-proveedores-componente-proveedor`}
        >
            <p>{props.cliente.CODIGO + " - "
                + props.cliente.CLIENTE}</p>
            <button onClick={():void => props.deleteCliente(props.cliente._id)}>
                <ImCancelCircle color="red"/>
            </button>
        </div>
    )
}