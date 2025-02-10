/* eslint-disable prettier/prettier */

import { contenedoresType } from "@renderer/types/contenedoresType"
import { useEffect, useState } from "react"
import { resumenCalidad } from "../functions/resumen"

type propsType = {
    contenedor: contenedoresType | undefined
    calidad: string
}

export default function TablaCalidadesInfo(props: propsType): JSX.Element {
    const [resumen, setResumen] = useState<object>()
    useEffect(() => {
        if (props.contenedor !== undefined) {
            const res = resumenCalidad(props.contenedor, props.calidad)
            setResumen(res)
        }
    }, [props.contenedor])
    if (props.contenedor === undefined) {
        return (
            <div>Cargando datos...</div>
        )
    }
    return (

            <table className="table-main">
                <thead>
                    <tr>
                        <th>SUMMARY CATEGORY</th>
                        <th>{props.calidad}</th>
                        <th></th>
                        <th></th>
                    </tr>
                    <tr>
                        <th>SIZE</th>
                        <th>QTY</th>
                        <th>N. PALLETS</th>
                        <th>% PERCENTAGE</th>
                    </tr>
                </thead>
                <tbody>
                    {resumen && Object.entries(resumen).map(([key, value]) => (
                        <tr key={key}>
                            <td>{key}</td>
                            <td>{value.cantidad}</td>
                            <td>{value.pallets}</td>
                            <td>{value.porcentage.toFixed(2)}%</td>
                        </tr>
                    ))}
                    <tr>
                        <td>TOTAL</td>
                        <td>{resumen && Object.keys(resumen).reduce((acu, item) => acu += resumen[item].cantidad, 0)}</td>
                        <td>{resumen && Object.keys(resumen).reduce((acu, item) => acu += resumen[item].pallets, 0)}</td>
                        <td>{resumen && Object.keys(resumen).reduce((acu, item) => acu += resumen[item].porcentage, 0).toFixed(2)}%</td>
                    </tr>
                </tbody>
            </table>
    )
}