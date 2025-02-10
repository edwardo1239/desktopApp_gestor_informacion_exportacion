/* eslint-disable prettier/prettier */

import { proveedoresType } from "@renderer/types/proveedoresType"
import { formType } from "../SistemaFormulariosCrearInformeProveedor"
import { useEffect, useState } from "react"
import { obtenerPorcentage } from "@renderer/functions/operaciones"
import MostrarPrecios from "./MostrarPrecios"

type propsType = {
    formState: formType
    proveedores: proveedoresType[]
    clasificacionDescarte: { [key: string]: string }
    itemsClasifiacionDescarte: { [key: string]: string }
    images: ImageData[]
}

interface ImageData {
    url: string;
    name: string;
}


export default function InformeCalidad(props: propsType): JSX.Element {
    const [proveedor, setProveedor] = useState<proveedoresType>()
    const [totalDescarte, setTotalDescarte] = useState<number>()
    const [totalDescartePago, setTotalDescartePago] = useState<number>()
    const [precioTotalState, setPrecioTotalState] = useState<number>()
    useEffect(() => {
        if (props.proveedores && props.formState) {
            const prov = props.proveedores.find(item => item._id === props.formState.predio)
            setProveedor(prov)
            //total
            const tDescarte =
                Number(props.formState.descarteGeneral ?? 0) +
                Number(props.formState.pareja ?? 0) +
                Number(props.formState.extra ?? 0) +
                Number(props.formState.balin ?? 0) +
                Number(props.formState.descompuesta ?? 0) +
                Number(props.formState.hojas ?? 0) +
                Number(props.formState.piel ?? 0)

            setTotalDescarte(tDescarte)

            //precio
            const totalPrecioDescarte = tDescarte - Number(props.formState.hojas ?? 0)
                - Number(props.formState.piel ?? 0)
                - Number(props.formState.balin ?? 0)
                - Number(props.formState.descompuesta ?? 0)

            const precioTotal =
                (Number(props.formState.precioDescarte ?? 0) *
                    (totalPrecioDescarte))
                + Number(props.formState.calidad1 ?? 0) * Number(props.formState.precioCalidad1 ?? 0)
                + Number(props.formState.calidad15 ?? 0) * Number(props.formState.precioCalidad15 ?? 0)
                + Number(props.formState.calidad2 ?? 0) * Number(props.formState.precioCalidad2 ?? 0)

            setPrecioTotalState(precioTotal)
            setTotalDescartePago(totalPrecioDescarte)
        }
    }, [])

    return (
        <div className="container-informe-calidad-lote" id="viewInformeDataContainerBlanco">
            <h2>Informe de calidad para el productor</h2>
            <hr />
            <div className="view-informes-datos-general-container">
                <div>
                    <p>Clase de Fruta: <span>{props.formState.tipoFruta}</span></p>
                    <p>Variedad:</p>
                </div>
                <div>
                    <p>Fecha de Ingreso:
                        <span>
                            {props.formState.fecha_ingreso_patio}
                        </span>
                    </p>
                    <p>Lugar: <span>{proveedor?.DEPARTAMENTO}</span></p>
                </div>
                <div>
                    <p>Predio: <span>{proveedor?.PREDIO}</span></p>
                    <p>Código ICA: <span>{proveedor?.ICA.code}</span></p>
                    <p>Código GGN: <span>{proveedor?.GGN.code}</span></p>
                </div>
                <div>
                    <p>Cantidad Ingreso Kg: <span>{props.formState.kilos}</span></p>
                    <p>Orden de compra N° <span>{props.formState.enf}</span></p>
                </div>
                <div>
                    <p>TRZ:
                        <span>
                            {
                                props.formState.contenedores
                            }
                        </span></p>
                </div>
            </div>
            <hr />
            <div className='informe-calidad-lote-div'>
                <h3>Resultados</h3>
            </div>
            <table className='table-main-informe-proveedor' >
                <thead>
                    <tr>
                        <th>Clasificacion</th>
                        <th>Unidad/Kg</th>
                        <th>Porcentaje</th>
                        <th>Precio /Kg</th>
                        <th>PrecioTotal</th>
                    </tr>
                </thead>
                <tbody>
                    <>

                        <tr >
                            <td>Exportacion Tipo 1:</td>
                            <td>{props.formState.calidad1}</td>
                            <td>{
                                props.formState.kilos &&
                                obtenerPorcentage(
                                    Number(props.formState.calidad1?.replace(",", ".")) ?? 0,
                                    Number(props.formState.kilos?.replace(",", ".")) ?? 1
                                ).toFixed(2)
                            }% </td>
                            <MostrarPrecios
                                formState={props.formState}
                                tipoPrecio="precioCalidad1"
                                kilosFruta={Number(props.formState.calidad1?.replace(",", "."))}
                            />
                        </tr>
                        <tr >
                            <td>Exportacion Tipo 1.5:</td>
                            <td>{props.formState.calidad15 ?? 0}</td>
                            <td>{
                                props.formState.kilos &&
                                obtenerPorcentage(
                                    Number(props.formState.calidad15?.replace(",", ".") ?? 0),
                                    Number(props.formState.kilos.replace(",", ".") ?? 1)
                                ).toFixed(2)
                            } % </td>
                            <MostrarPrecios
                                formState={props.formState}
                                tipoPrecio="precioCalidad15"
                                kilosFruta={Number(props.formState.calidad15?.replace(",", ".") ?? 0)}
                            />
                        </tr>
                        <tr >
                            <td>Exportacion Tipo 2:</td>
                            <td>{props.formState.calidad2 ?? 0}</td>
                            <td>{
                                props.formState.kilos &&
                                obtenerPorcentage(
                                    Number(props.formState.calidad2?.replace(",", ".") ?? 0),
                                    Number(props.formState.kilos?.replace(",", ".") ?? 1)
                                ).toFixed(2)
                            }% </td>
                            <MostrarPrecios
                                formState={props.formState}
                                tipoPrecio="precioCalidad2"
                                kilosFruta={Number(props.formState.calidad2?.replace(",", ".") ?? 0)}
                            />
                        </tr>


                    </>
                    <>
                        {Object.entries(props.clasificacionDescarte).map(([key, value]) => {
                            if (key === 'fecha') {
                                return null
                            } else {
                                return (
                                    <tr key={key} >
                                        <td>{props.itemsClasifiacionDescarte[key] || key}</td>
                                        <td>
                                            {(
                                                (Number(props.formState.descarteGeneral?.replace(",", ".") ?? 0) +
                                                Number(props.formState.piel?.replace(",", ".") ?? 0))
                                             *
                                                (Number(value?.replace(",", ".") ?? 0) / 100)).toFixed(2)} Kg
                                        </td>
                                        <td>
                                            {obtenerPorcentage(
                                                (Number(props.formState.descarteGeneral?.replace(",", ".") ?? 0) +
                                                    (Number(props.formState.piel?.replace(",", ".") ?? 0)
                                                    ) *
                                                    (Number(value?.replace(",", ".") ?? 0) / 100)),
                                                (Number(props.formState.kilos?.replace(",", ".")) ?? 1)
                                            ).toFixed(2)}%
                                        </td>
                                        <MostrarPrecios
                                            formState={props.formState}
                                            tipoPrecio="precioDescarte"
                                            kilosFruta={(Number(props.formState.descarteGeneral?.replace(",", ".") ?? 0) *
                                                (Number(value ?? 0) / 100))}
                                        />
                                    </tr>
                                )
                            }
                        })}
                        <tr>
                            <td>Fruta con diámetro Ecuatorial superior a los requerido </td>
                            <td>
                                {(Number(props.formState.extra?.replace(",", ".") ?? 0)).toFixed(2)} Kg
                            </td>
                            <td>{obtenerPorcentage(
                                (Number(props.formState.extra?.replace(",", ".") ?? 0)),
                                Number(props.formState.kilos?.replace(",", ".") ?? 1)).toFixed(2)} %
                            </td>
                            <MostrarPrecios
                                formState={props.formState}
                                tipoPrecio="precioDescarte"
                                kilosFruta={Number(props.formState.extra?.replace(",", ".") ?? 1)}
                            />
                        </tr>
                        <tr>
                            <td>Fruta con diámetro Ecuatorial inferior a lo requerido (Balín)</td>
                            <td>
                                {(Number(props.formState.balin?.replace(",", ".") ?? 0)).toFixed(2)} Kg
                            </td>
                            <td>{obtenerPorcentage(
                                (Number(props.formState.balin?.replace(",", ".") ?? 0)),
                                Number(props.formState.kilos?.replace(",", ".") ?? 1)).toFixed(2)} %
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
                            <td>Fruta con diámetro Ecuatorial inferior a lo requerido (Pareja)</td>
                            <td>
                                {(Number(props.formState.pareja?.replace(",", ".") ?? 0)).toFixed(2)} Kg
                            </td>
                            <td>{obtenerPorcentage(
                                (Number(props.formState.pareja?.replace(",", ".") ?? 0)),
                                Number(props.formState.kilos?.replace(",", ".") ?? 1)).toFixed(2)} %
                            </td>
                            <MostrarPrecios
                                formState={props.formState}
                                tipoPrecio="precioDescarte"
                                kilosFruta={Number(props.formState.pareja?.replace(",", ".") ?? 0)}
                            />
                        </tr>
                        <tr>
                            <td>Descompuesta  (Geotrichum, daños mecánicos, oleocelosis severa, hongos, fruta rajada).</td>
                            <td>
                                {(Number(props.formState.descompuesta?.replace(",", ".") ?? 0)).toFixed(2)} Kg
                            </td>
                            <td>
                                {obtenerPorcentage(
                                    (Number(props.formState.descompuesta?.replace(",", ".") ?? 0)),
                                    Number(props.formState.kilos?.replace(",", ".") ?? 1)).toFixed(2)} %
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
                                {(Number(props.formState.hojas ?? 0)).toFixed(2)} Kg
                            </td>
                            <td>
                                {obtenerPorcentage(
                                    (Number(props.formState.hojas ?? 0)),
                                    Number(props.formState.kilos ?? 1)).toFixed(2)} %
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
                                {(Number(props.formState.frutaNacional ?? 0)).toFixed(2)} Kg
                            </td>
                            <td>{obtenerPorcentage(
                                (Number(props.formState.frutaNacional ?? 0)),
                                Number(props.formState.kilos ?? 1)).toFixed(2)} %
                            </td>
                            <MostrarPrecios
                                formState={props.formState}
                                tipoPrecio="precioFrutaNacional"
                                kilosFruta={Number(props.formState.frutaNacional ?? 0)}
                            />
                        </tr>
                        <tr style={{ height: 30 }}>
                            <td>Total descarte</td>
                            <td>
                                {(totalDescarte ?? 0).toFixed(2)} Kg
                            </td>
                            <td>
                                {obtenerPorcentage(
                                    (totalDescarte ?? 0),
                                    (Number(props.formState.kilos))
                                ).toFixed(2)}%
                            </td>
                            <td>{new Intl.NumberFormat('es-CO', {
                                style: 'currency',
                                currency: 'COP',
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 0
                            }).format(Number(props.formState.precioDescarte ?? 0))}
                            </td>
                            <td>{new Intl.NumberFormat('es-CO', {
                                style: 'currency',
                                currency: 'COP',
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 0
                            }).format(totalDescartePago ?? 0 * Number(props.formState.precioDescarte ?? 0))}
                            </td>
                        </tr>
                    </>
                    <tr className='informe-calidad-total-fila fondo-impar'>
                        <td>Total</td>
                        <td>
                            {(Number(props.formState.kilos)).toFixed(2)} Kg
                        </td>
                        <td>
                            100%
                        </td>
                        <td></td>
                        <td>
                            {
                                new Intl.NumberFormat('es-CO', {
                                    style: 'currency',
                                    currency: 'COP',
                                    minimumFractionDigits: 0,
                                    maximumFractionDigits: 0
                                }).format(precioTotalState ?? 0)
                            }
                        </td>
                    </tr>
                </tbody>
            </table>

            <div className='informe-calidad-lote-div'>
                <h3>Observaciones</h3>
            </div>

            <div>
                <div className="informe-calida-lote-div-calidad-interna">

                    <div>
                        <h4>Brix:</h4>
                        <p>{props.formState.brix}%</p>
                    </div>

                    <div>
                        <h4>Acidez:</h4>
                        <p>{props.formState.acidez}%</p>
                    </div>

                    <div>
                        <h4>Ratio:</h4>
                        <p>{props.formState.ratio}%</p>
                    </div>

                    <div>
                        <h4>Zumo:</h4>
                        <p>{props.formState.zumo}%</p>
                    </div>
                </div>

                <div className="informe-calida-lote-div-observaciones">
                    <p>{props.formState.observacion1}</p>
                    <p>{props.formState.observacion2}</p>
                    <p>{props.formState.observacion3}</p>
                    <p>{props.formState.observacion4}</p>
                </div>
            </div>

            <div className='informe-calidad-lote-div'>
                <h3>Evidencias fotograficas</h3>
            </div>
            <div className="informe-calidad-lote-fotos-div">
                {props.images.map((image, index) => (
                    <div key={index}>
                        <img src={image.url} alt={`Imagen ${index}`} width={250} height={250} />
                        <p>{image.name}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}