/* eslint-disable prettier/prettier */
import { ImCancelCircle } from "react-icons/im";
import { listaProveedortype } from "../PrediccionesExportacion";

type propsType = {
    proveedor: listaProveedortype
    deleteProveedor: (e:string) => void
}

export default function ProveedorComponente(props: propsType): JSX.Element {


    return (
        <div
            className="comercial-precios-proveedores-componente-proveedor"
        >
            <p>{props.proveedor.codigo + " - "
                + props.proveedor.predio + " - "} {props.proveedor.kilos}Kg - 
                <span>{props.proveedor.tipoFruta}</span></p>
            
            <button onClick={():void => props.deleteProveedor(props.proveedor._id)}>
                <ImCancelCircle color="red"/>
            </button>
        </div>
    );
}
