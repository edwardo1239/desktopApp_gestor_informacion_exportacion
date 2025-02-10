/* eslint-disable prettier/prettier */
import { lotesType } from "@renderer/types/lotesType";

type propsType = {
    loteSeleccionado: lotesType
    tipoPrecio: string
    kilosFruta: number
}
export default function MostrarPrecios(props:propsType): JSX.Element {
    // if(props.loteSeleccionado.aprobacionComercial){
        return (
            <>
                <td>
                    {((): string => {
                        const precio = props.loteSeleccionado.precio[props.tipoPrecio];
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
                            props.loteSeleccionado.precio[props.tipoPrecio]
                            * props.kilosFruta
                        )
                    }
                </td></ >
        )
    // }
    // return (
    //     <>
    //         <td>
    //             {((): string => {
    //                 const precio = props.loteSeleccionado.predio?.precio?.[props.loteSeleccionado.tipoFruta ?? '']?.[props.tipoPrecio];
    //                 if (precio === undefined || precio === null) {
    //                     return 'N/A';
    //                 }
    //                 return new Intl.NumberFormat('es-CO', {
    //                     style: 'currency',
    //                     currency: 'COP',
    //                     minimumFractionDigits: 0,
    //                     maximumFractionDigits: 0
    //                 }).format(precio);
    //             })()}
    //         </td>
    //         <td>
    //             {
    //                 new Intl.NumberFormat('es-CO', {
    //                     style: 'currency',
    //                     currency: 'COP',
    //                     minimumFractionDigits: 0,
    //                     maximumFractionDigits: 0
    //                 }).format(
    //                     (props.loteSeleccionado.predio?.precio?.[props.loteSeleccionado.tipoFruta]?.[props.tipoPrecio])
    //                     * props.kilosFruta
    //                 )
    //             }
    //         </td></ >
    // )
}