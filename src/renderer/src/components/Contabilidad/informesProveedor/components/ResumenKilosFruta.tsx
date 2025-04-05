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

    // useEffect(() => { console.log(props.lote) }, [])
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


    const balin_nopago = (): JSX.Element => {


        return (
            <tr>
                <td>
                    No pagos
                </td>
                <td>
                    {
                        (props.lote.descarteLavado?.balin ?? 0) +
                        (props.lote.descarteEncerado?.balin ?? 0)
                    }
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
        // Helper to ensure numbers come out with comma decimal
        const decimalToComma = (num: number): string => {
            // Adjust precision if needed, here we use 2 decimals as an example
            if (typeof num !== 'number') return num
            return num.toFixed(2).replace('.', '.');
        };
        let textCopy = ''
        // Build up your lines
        if (props.lote.exportacionDetallada) {
            const textCopyArrCont = Object.entries(props.lote.exportacionDetallada.any ?? {}).map(
                ([key, value]) => {
                    const contenedor = props.contenedores.find(item => item._id === key);

                    return Object.entries(value as Record<string, unknown>).map(
                        ([keyCalidad, valueCalidad]) => {

                            if (contenedor && (keyCalidad !== '_id' && keyCalidad !== "2")) {
                                console.log(keyCalidad, "-", valueCalidad)

                                const kilos = decimalToComma(valueCalidad as number);
                                const precioKey = decimalToComma(props.lote.precio[keyCalidad]);
                                const subTotal = decimalToComma(
                                    props.lote.precio[keyCalidad] * (valueCalidad as number)
                                );

                                return (
                                    `2\t${props.lote.tipoFruta === 'Limon' ? 'LE' : 'NE'}\tKg\t${kilos}\t${precioKey}\t\t${subTotal}\t\t${contenedor.numeroContenedor}\n`
                                );
                            } else if (contenedor && keyCalidad === "2") {
                                const kilos = decimalToComma(valueCalidad as number);
                                const precioKey = decimalToComma(props.lote.precio[keyCalidad]);
                                const subTotal = decimalToComma(
                                    props.lote.precio[keyCalidad] * (valueCalidad as number)
                                );

                                return (
                                    `2\t${props.lote.tipoFruta === 'Limon' ? 'LN' : 'NN'}\tKg\t${kilos}\t${precioKey}\t\t${subTotal}\t\t${contenedor.numeroContenedor}\n`
                                );
                            }
                            return undefined;
                        }
                    );
                }
            );

            const textCopyCont = textCopyArrCont.map(item => item.filter(item2 => item2 !== undefined));

            textCopy = textCopyCont.reduce((acu, item) => (acu += item.join('')), '');
        }
        let total = descarte_pagos(props.lote);

        if (props.lote.flag_balin_free) {
            total -= (props.lote.descarteEncerado?.balin ?? 0) + (props.lote.descarteLavado?.balin ?? 0)
        }

        const totalNoPago = descarte_nopago(props.lote); // number

        // Líneas adicionales
        const frutaNacional = props.lote.frutaNacional
        if (frutaNacional) {
            textCopy +=
                `1\t${props.lote.tipoFruta === 'Limon' ? 'LN' : 'NN'}\tKilos\t${decimalToComma(frutaNacional)}\t${decimalToComma(props.lote.precio.frutaNacional)}\t\t${decimalToComma(props.lote.precio.frutaNacional * frutaNacional)}\n`;
        }

        const directoNacional = props.lote.directoNacional

        if (directoNacional) {
            textCopy +=
                `1\t${props.lote.tipoFruta === 'Limon' ? 'LN' : 'NN'}\tKilos\t${decimalToComma(directoNacional)}\t${decimalToComma(props.lote.precio.frutaNacional)}\t\t${decimalToComma(props.lote.precio.frutaNacional * directoNacional)}\n`;
        }


        textCopy +=
            `1\t${props.lote.tipoFruta === 'Limon' ? 'LN' : 'NN'}\tKilos\t${decimalToComma(total)}\t${decimalToComma(props.lote.precio.descarte)}\t\t${decimalToComma(props.lote.precio.descarte * total)}\n`;

        const balinTotal = (props.lote.descarteLavado?.balin ?? 0) + (props.lote.descarteEncerado?.balin ?? 0);
        textCopy +=
            `1\t${props.lote.tipoFruta === 'Limon' ? 'LN' : 'NN'}\tKilos\t${decimalToComma(balinTotal)}\t${decimalToComma(0)}\t\t${decimalToComma(0)}\n`;

        textCopy +=
            `1\tMPL1\tKilos\t${decimalToComma(totalNoPago)}\t${decimalToComma(0)}\t\t${decimalToComma(0)}\n`;

        // Finally, copy to clipboard
        if (textCopy) {
            await navigator.clipboard.writeText(textCopy);
        }
    };

    return (
        <div className="container-informe-calidad-lote" >
            <h2>Resumen kilos fruta</h2>
            <hr />
            <button onClick={guardar_data_clipboard} className="defaulButtonAgree">Copiar</button>
            <h3>Exportación</h3>

            <table className="table-main-informe-proveedor">
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
                    {props.lote.exportacionDetallada && Object.entries(props.lote.exportacionDetallada.any).map(([key, value], index) => {
                        const contenedor = props.contenedores.find(item => item._id === key);
                        return Object.entries(value as Record<string, unknown>).map(([keyCalidad, valueCalidad]) => {
                            if (contenedor && keyCalidad !== '_id') {
                                return (
                                    <tr key={`${key}-${keyCalidad}`} className={`${index % 2 === 0 ? 'fondo-par' : 'fondo-impar'}`}>
                                        <td>{contenedor.numeroContenedor}</td>
                                        {keyCalidad === '2' ?
                                            <td>{props.lote.tipoFruta === 'Limon' ? 'LN' : 'NN'}</td>

                                            :
                                            <td>{props.lote.tipoFruta === 'Limon' ? 'LE' : 'NE'}</td>
                                        }
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
            <h3>Fruta nacional</h3>
            <table className="table-main-informe-proveedor">
                <thead>
                    <tr>
                        <th>Tipo</th>
                        <th>Tipo de fruta</th>
                        <th>Kilos</th>
                        <th>Precio</th>
                        <th>Precio total</th>
                    </tr>
                </thead>
                <tbody>
                    <tr className={`fondo-par`}>
                        <td>Directo nacional</td>
                        <td>{props.lote.tipoFruta === 'Limon' ? 'LN' : 'NN'}</td>

                        <td>{props.lote.directoNacional.toFixed(2)}</td>
                        <td>{new Intl.NumberFormat('es-CO', {
                            style: 'currency',
                            currency: 'COP',
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0
                        }).format(props.lote.precio.frutaNacional)}</td>
                        <td>
                            {new Intl.NumberFormat('es-CO', {
                                style: 'currency',
                                currency: 'COP',
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 0,
                            }).format(props.lote.precio.frutaNacional * props.lote.directoNacional)}
                        </td>
                    </tr>
                    <tr className={`fondo-impar`}>
                        <td>Fruta nacional</td>
                        <td>{props.lote.tipoFruta === 'Limon' ? 'LN' : 'NN'}</td>
                        <td>{props.lote.frutaNacional?.toFixed(2) ?? '0'}</td>
                        <td>{new Intl.NumberFormat('es-CO', {
                            style: 'currency',
                            currency: 'COP',
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0
                        }).format(props.lote.precio.frutaNacional)}</td>
                        <td>
                            {new Intl.NumberFormat('es-CO', {
                                style: 'currency',
                                currency: 'COP',
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 0,
                            }).format(props.lote.precio.frutaNacional * (props.lote.frutaNacional ?? 0))}
                        </td>
                    </tr>
                </tbody>
            </table>

            <h3>Descartes</h3>

            <table className="table-main-informe-proveedor">
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
                    {balin_nopago()}
                    {sumardescartes_nopagos()}
                </tbody>
            </table>
        </div>
    )
}
