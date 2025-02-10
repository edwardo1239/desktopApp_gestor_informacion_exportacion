/* eslint-disable prettier/prettier */
import { formType } from "../SistemaFormulariosCrearInformeProveedor";

type propsType = {
    formState: formType
    tipoPrecio: string
    kilosFruta: number
}
export default function MostrarPrecios(props:propsType): JSX.Element {

    return (
        <>
            <td>
                {((): string => {
                    const precio = props.formState[props.tipoPrecio];
                    if (precio === undefined || precio === null) {
                        return 'N/A';
                    }
                    return new Intl.NumberFormat('es-CO', {
                        style: 'currency',
                        currency: 'COP',
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0
                    }).format(precio);
                })()}
            </td>
            <td>
                {
                    new Intl.NumberFormat('es-CO', {
                        style: 'currency',
                        currency: 'COP',
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0
                    }).format(
                        (props.formState[props.tipoPrecio])
                        * props.kilosFruta
                    )
                }
            </td></ >
    )
}