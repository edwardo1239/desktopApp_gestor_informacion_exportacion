/* eslint-disable prettier/prettier */

import { dataDefectos } from "@renderer/constants/calidadDefectos"
import { lotesType } from "@renderer/types/lotesType"
import MostrarPrecios from "./MostrarPrecios";
import { obtenerPorcentage, total_precio_descarte, totalDescarte } from "@renderer/functions/informesLotes";
// import { useEffect } from "react";

type propsType = {
    loteSeleccionado: lotesType
}

export default function ViewInformeDescarte(props: propsType): JSX.Element {
    // useEffect(()=>{console.log(props.loteSeleccionado)},[])
    const clasificacionCalidad = props.loteSeleccionado?.calidad?.clasificacionCalidad;
    if (!clasificacionCalidad) {
        return <div>No hay datos de clasificación de calidad disponibles.</div>;
    }

    return (
        <>
            {Object.entries(clasificacionCalidad).map(([key, value]) => {
                if (key === 'fecha') {
                    return null
                } else {
                    return (
                        <tr key={key} >
                            <td>{dataDefectos[key] || key}</td>
                            <td>
                                {(
                                    (value as number) *
                                    ((props.loteSeleccionado.descarteLavado?.descarteGeneral ?? 0) +
                                        (props.loteSeleccionado.descarteEncerado?.suelo ?? 0) +
                                        (props.loteSeleccionado.descarteEncerado?.descarteGeneral ?? 0) +
                                        ((props.loteSeleccionado.deshidratacion === 0 ? 0 : (props.loteSeleccionado.deshidratacion / 100)) * (props.loteSeleccionado.kilos)))

                                ).toFixed(2)} Kg
                            </td>
                            <td>
                                {obtenerPorcentage(
                                    (
                                        (value as number) *
                                        ((props.loteSeleccionado.descarteLavado?.descarteGeneral ?? 0) +
                                            (props.loteSeleccionado.descarteEncerado?.suelo ?? 0) +
                                            (props.loteSeleccionado.descarteEncerado?.descarteGeneral ?? 0) +
                                            ((props.loteSeleccionado.deshidratacion === 0 ? 0 : (props.loteSeleccionado.deshidratacion / 100)) * (props.loteSeleccionado.kilos)))
                                    ),
                                    (props.loteSeleccionado.kilos ?? 1)
                                ).toFixed(2)}%
                            </td>
                            <MostrarPrecios
                                loteSeleccionado={props.loteSeleccionado}
                                tipoPrecio="descarte"
                                kilosFruta={
                                    (value as number) *
                                    ((props.loteSeleccionado.descarteLavado?.descarteGeneral ?? 0) +
                                        (props.loteSeleccionado.descarteEncerado?.suelo ?? 0) +
                                        (props.loteSeleccionado.descarteEncerado?.descarteGeneral ?? 0) +
                                        ((props.loteSeleccionado.deshidratacion === 0 ? 0 : (props.loteSeleccionado.deshidratacion / 100)) * (props.loteSeleccionado.kilos)))} />
                        </tr>
                    )
                }
            })}
            <tr>
                <td>Fruta con diámetro Ecuatorial superior a los requerido </td>
                <td>
                    {(props.loteSeleccionado.descarteEncerado?.extra ?? 0).toFixed(2)} Kg
                </td>
                <td>{obtenerPorcentage(
                    (props.loteSeleccionado.descarteEncerado?.extra ?? 0),
                    props.loteSeleccionado.kilos ?? 1).toFixed(2)} %
                </td>
                <MostrarPrecios
                    loteSeleccionado={props.loteSeleccionado}
                    tipoPrecio="descarte"
                    kilosFruta={(props.loteSeleccionado.descarteEncerado?.extra ?? 0)} />
            </tr>
            <tr>
                <td>Fruta con diámetro Ecuatorial inferior a lo requerido (Balín)</td>
                <td>
                    {((props.loteSeleccionado.descarteEncerado?.balin ?? 0)
                        + (props.loteSeleccionado.descarteLavado?.balin ?? 0)
                    ).toFixed(2)} Kg
                </td>
                <td>
                    {obtenerPorcentage(
                        ((props.loteSeleccionado.descarteEncerado?.balin ?? 0)
                            + (props.loteSeleccionado.descarteLavado?.balin ?? 0)
                        ),
                        (props.loteSeleccionado.kilos ?? 1)
                    ).toFixed(2)}%
                </td>
                {props.loteSeleccionado.flag_balin_free ?
                    <>
                        <td>0$</td>
                        <td>0$</td>
                    </>
                    :
                    <MostrarPrecios
                        loteSeleccionado={props.loteSeleccionado}
                        tipoPrecio="descarte"
                        kilosFruta={(((props.loteSeleccionado.descarteEncerado?.balin ?? 0)
                            + (props.loteSeleccionado.descarteLavado?.balin ?? 0)
                        ))} />}
            </tr>
            <tr>
                <td>Fruta con diámetro Ecuatorial inferior a lo requerido (Pareja)</td>
                <td>
                    {((props.loteSeleccionado.descarteEncerado?.pareja ?? 0)
                        + (props.loteSeleccionado.descarteLavado?.pareja ?? 0)
                    ).toFixed(2)} Kg
                </td>
                <td>
                    {obtenerPorcentage(
                        ((props.loteSeleccionado.descarteEncerado?.pareja ?? 0)
                            + (props.loteSeleccionado.descarteLavado?.pareja ?? 0)
                        ),
                        (props.loteSeleccionado.kilos ?? 1)
                    ).toFixed(2)}%
                </td>
                <MostrarPrecios
                    loteSeleccionado={props.loteSeleccionado}
                    tipoPrecio="descarte"
                    kilosFruta={((props.loteSeleccionado.descarteEncerado?.pareja ?? 0)
                        + (props.loteSeleccionado.descarteLavado?.pareja ?? 0)
                    )} />
            </tr>
            <tr>
                <td>Descompuesta  (Geotrichum, daños mecánicos, oleocelosis severa, hongos, fruta rajada).</td>
                <td>
                    {((props.loteSeleccionado.descarteEncerado?.descompuesta ?? 0)
                        + (props.loteSeleccionado.descarteLavado?.descompuesta ?? 0)
                    ).toFixed(2)} Kg
                </td>
                <td>
                    {obtenerPorcentage(
                        ((props.loteSeleccionado.descarteEncerado?.descompuesta ?? 0)
                            + (props.loteSeleccionado.descarteLavado?.descompuesta ?? 0)
                        ),
                        (props.loteSeleccionado.kilos ?? 1)
                    ).toFixed(2)}%
                </td>
                <td>{new Intl.NumberFormat('es-CO', {
                    style: 'currency',
                    currency: 'COP',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0
                }).format(0)}
                </td>
                <td>{new Intl.NumberFormat('es-CO', {
                    style: 'currency',
                    currency: 'COP',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0
                }).format(0)}
                </td>
            </tr>
            <tr>
                <td>Hojas</td>
                <td>
                    {(props.loteSeleccionado.descarteLavado?.hojas ?? 0).toFixed(2)} Kg
                </td>
                <td>{obtenerPorcentage(
                    (props.loteSeleccionado.descarteLavado?.hojas ?? 0),
                    props.loteSeleccionado.kilos ?? 1).toFixed(2)} %
                </td>
                <td>{new Intl.NumberFormat('es-CO', {
                    style: 'currency',
                    currency: 'COP',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0
                }).format(0)}
                </td>
                <td>{new Intl.NumberFormat('es-CO', {
                    style: 'currency',
                    currency: 'COP',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0
                }).format(0)}
                </td>
            </tr>
            <tr>
                <td>Fruta nacional</td>
                <td>
                    {(props.loteSeleccionado.frutaNacional ?? 0).toFixed(2)} Kg
                </td>
                <td>{obtenerPorcentage(
                    (props.loteSeleccionado.frutaNacional ?? 0),
                    props.loteSeleccionado.kilos ?? 1).toFixed(2)} %
                </td>
                <MostrarPrecios
                    loteSeleccionado={props.loteSeleccionado}
                    tipoPrecio="frutaNacional"
                    kilosFruta={(props.loteSeleccionado.frutaNacional ?? 0)} />
            </tr>
            <tr style={{ height: 30 }}>
                <td>Total descarte</td>
                <td>
                    {totalDescarte(props.loteSeleccionado).toFixed(2)} Kg
                </td>
                <td>
                    {obtenerPorcentage(
                        totalDescarte(props.loteSeleccionado),
                        (props.loteSeleccionado.kilos ?? 1)
                    ).toFixed(2)}%
                </td>
                <td>{new Intl.NumberFormat('es-CO', {
                    style: 'currency',
                    currency: 'COP',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0
                }).format(0)}
                </td>
                <td>{new Intl.NumberFormat('es-CO', {
                    style: 'currency',
                    currency: 'COP',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0
                }).format(total_precio_descarte(props.loteSeleccionado))}
                </td>
            </tr>
        </>
    )
}
