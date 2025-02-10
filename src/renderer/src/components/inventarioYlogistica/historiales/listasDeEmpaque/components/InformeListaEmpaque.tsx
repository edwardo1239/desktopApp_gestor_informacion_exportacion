/* eslint-disable prettier/prettier */
import { contenedoresType } from "@renderer/types/contenedoresType"
import imagenCelifrut from "../../../../../assets/CELIFRUT.png"
import TablaInfoListaEmpaque from "./TablaInfoListaEmpaque"
import TablaCalidadesInfo from "./TablaCalidadesInfo"
import { proveedoresType } from "@renderer/types/proveedoresType"

type propsType = {
    contenedor: contenedoresType
    tipoFruta: string | undefined
    final: boolean
    proveedores: proveedoresType[] 
}
export default function InformeListaEmpaque(props: propsType): JSX.Element {
    return (
        <div className="historiales-listaempaque-info-container" id="view_informe_lista_empaque">
            <section >
                <div className="historiales-listaempaque-info-cabecera">
                    <img src={imagenCelifrut} />
                    <h2>PACKING LIST REPORT</h2>
                    <p>Codigo: PC-CAL-FOR-05</p>
                </div>
                <hr />
                <div className="historiales-listaempaque-info-cabecera">
                    <p>{(typeof props.contenedor.infoContenedor.clienteInfo === "object" ?
                        props.contenedor.infoContenedor.clienteInfo.CLIENTE : "")}</p>
                    <p>TEMP. SET POINT: 44,6F</p>
                    <p>FREIGHT:</p>
                    <p>CONTAINER NUMBER: {props.contenedor.numeroContenedor}</p>
                </div>
                <div className="historiales-listaempaque-info-cabecera">
                    <p>REFERENCE N°:</p>
                    <p>{props.tipoFruta}</p>
                    <p>TEMP RECORDER LOCATION: PALLET 10</p>
                    <p>TEMP RECORDER ID: SS-0085719</p>
                    <p>
                        {"DATE: " +
                            new Date(props.contenedor.infoContenedor.fechaCreacion).toDateString()}
                    </p>
                    <p>CoC: N/A</p>
                </div>
                <hr />

            </section>
            <TablaInfoListaEmpaque 
                proveedores={props.proveedores}
                final={props.final} 
                contenedor={props.contenedor} />
            <section className="historiales-listaempaque-info-resumen">
                {props.contenedor.infoContenedor.calidad.map(calidad => (
                    <div key={calidad}>
                        <TablaCalidadesInfo calidad={calidad} contenedor={props.contenedor} />
                    </div>
                ))}
            </section>
        </div>
    )
}
