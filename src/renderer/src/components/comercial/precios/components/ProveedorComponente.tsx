/* eslint-disable prettier/prettier */

import { proveedoresType } from "@renderer/types/proveedoresType"

type propsType = {
    proveedor: proveedoresType
    setSelectedProveedores: (proveedor) => void
    selectedProveedores: proveedoresType[] | undefined

}

export default function ProveedorComponente(props: propsType): JSX.Element {
    const frutas = props.proveedor.tipo_fruta ? 
        Object.keys(props.proveedor.tipo_fruta).join(" - ") : '';

    const handleCheck = (event): void => {
        if(event.target.checked){
            props.setSelectedProveedores(prev => {
                if(prev){ return [...prev, props.proveedor] }
                else { return [props.proveedor] }
            })
        } else {
            props.setSelectedProveedores(prev => {
                if(prev){
                    return prev.filter(proveedor => proveedor._id !== props.proveedor._id)
                }
            })
        }
    }

    const checkIfProveedorChecked = ():boolean => {
        if(props.selectedProveedores){
            return props.selectedProveedores.some(proveedor => proveedor._id === props.proveedor._id)
        }
        return false
    }

    return (
        <div 
        className={`comercial-precios-proveedores-componente-proveedor 
            ${props.proveedor.precioFijo && 'precio-fijo'}`} 
        onClick={handleCheck}
        >
            <input type="checkbox"  checked={checkIfProveedorChecked()}/>
            <p>{props.proveedor["CODIGO INTERNO"] + " - " 
                +props.proveedor.PREDIO}</p>
            <span>{frutas}</span>
        </div>
    );
}
