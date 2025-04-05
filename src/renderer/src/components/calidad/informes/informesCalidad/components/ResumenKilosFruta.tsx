/* eslint-disable prettier/prettier */

import { descarte_nopago, descarte_pagos } from "@renderer/functions/informesLotes"
import { contenedoresType } from "@renderer/types/contenedoresType"
import { lotesType } from "@renderer/types/lotesType"
import React from "react"

type propsType = {
    lote: lotesType
    contenedores: contenedoresType[]
}

export default function ResumenKilosFruta(props: propsType): JSX.Element {

    const sumardescartes_pagos = (): JSX.Element => {
   
        const total = descarte_pagos(props.lote)

        return (
            <tr>
                <td>
                    {props.lote.tipoFruta === 'Limon' ? 'LN' : 'NN'}
                </td>
                <td>
                    {total.toFixed(2)}
                </td>
                <td>
                    {new Intl.NumberFormat('es-CO', {
                        style: 'currency',
                        currency: 'COP',
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0
                    }).format(props.lote.precio.descarte)}

                </td>
                <td>
                    {new Intl.NumberFormat('es-CO', {
                        style: 'currency',
                        currency: 'COP',
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0
                    }).format(props.lote.precio.descarte * total)}

                </td>
            </tr>
        )
    }

    const sumardescartes_nopagos = (): JSX.Element => {

        const total = descarte_nopago(props.lote)

        return (
            <tr>
                <td>
                    No pagos
                </td>
                <td>
                    {total}
                </td>
                <td>
                    $0
                </td>
                <td>
                    $0
                </td>
            </tr>
        )
    }

    const guardar_data_clipboard = async (): Promise<void> => {
        const textCopyArrCont = Object.entries(props.lote.exportacionDetallada.any).map(([key, value]) => {
            const contenedor = props.contenedores.find(item => item._id === key);
            return Object.entries(value as Record<string, unknown>).map(([keyCalidad, valueCalidad]) => {

                if (contenedor && keyCalidad !== '_id') {
                    return (
                        `1\t${props.lote.tipoFruta === 'Limon' ? 'LE' : 'NE'}\tKg\t${props.lote.precio[keyCalidad]}\t${props.lote.precio[keyCalidad]}\t\t${props.lote.precio[keyCalidad] * (valueCalidad as number)}\t${contenedor.numeroContenedor}\n`

                    );
                }
                return undefined
            });
        })


        const textCopyCont = textCopyArrCont.map(item => item.filter(item2 => item2 !== undefined))


        const total = descarte_pagos(props.lote)
        const total_nopago = descarte_nopago(props.lote)
    
        let textCopy = textCopyCont.reduce((acu, item) =>  acu += item, '')

        textCopy += `1\t${props.lote.tipoFruta === 'Limon' ? 'LN' : 'NN'}\tKilos\t${total}\t${props.lote.precio.descarte}\t\t${props.lote.precio.descarte * total}\n`
        textCopy += `1\tMPL1\tKilos\t${total}\t\t\t${props.lote.precio.descarte * total_nopago}\n`
        if(textCopy !== null)
            await navigator.clipboard.writeText(textCopy)
    }
    return (
        <div className="container-informe-calidad-lote" >
            <h2>Resumen kilos fruta</h2>
            <hr />
            <button onClick={guardar_data_clipboard} className="defaulButtonAgree">Copiar</button>
            <h3>Exportación</h3>
            <table className="table-main">
                <thead>
                    <tr>
                        <th>Contenedor</th>
                        <th>Tipo fruta</th>
                        <th>Kilos</th>
                        <th>Precio</th>
                        <th>Precio Total</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.entries(props.lote.exportacionDetallada.any).map(([key, value], index) => {
                        const contenedor = props.contenedores.find(item => item._id === key);
                        return Object.entries(value as Record<string, unknown>).map(([keyCalidad, valueCalidad]) => {

                            if (contenedor && keyCalidad !== '_id') {
                                return (
                                    <tr key={`${key}-${keyCalidad}`} className={`${index % 2 === 0 ? 'fondo-par' : 'fondo-impar'}`}>
                                        <td>{contenedor.numeroContenedor}</td>
                                        <td>{props.lote.tipoFruta === 'Limon' ? 'LE' : 'NE'}</td>
                                        <td>{valueCalidad as React.ReactNode}</td>
                                        <td>{new Intl.NumberFormat('es-CO', {
                                            style: 'currency',
                                            currency: 'COP',
                                            minimumFractionDigits: 0,
                                            maximumFractionDigits: 0
                                        }).format(props.lote.precio[keyCalidad])}</td>
                                        <td>
                                        {new Intl.NumberFormat('es-CO', {
                                            style: 'currency',
                                            currency: 'COP',
                                            minimumFractionDigits: 0,
                                            maximumFractionDigits: 0,
                                        }).format(props.lote.precio[keyCalidad] * (valueCalidad as number))}
                                        </td>
                                    </tr>
                                );
                            } else {
                                return null
                            }
                        });
                    })}
                </tbody>

            </table>

            <h3>Descartes</h3>
            <table className="table-main">
                <thead>
                    <tr>
                        <th>Tipo de fruta</th>
                        <th>Kilos</th>
                        <th>Precio</th>
                        <th>Precio total</th>
                    </tr>
                </thead>
                <tbody>
                    {sumardescartes_pagos()}
                    {sumardescartes_nopagos()}
                </tbody>
            </table>
        </div>
    )
}
