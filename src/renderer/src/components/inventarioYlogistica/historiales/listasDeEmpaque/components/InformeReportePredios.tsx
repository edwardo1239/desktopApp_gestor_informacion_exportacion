/* eslint-disable prettier/prettier */
import { contenedoresType } from "@renderer/types/contenedoresType"
import imagenCelifrut from "../../../../../assets/CELIFRUT.png"
import TablaReportePredios from "./TablaReportePredios"
import { proveedoresType } from "@renderer/types/proveedoresType"

type propsType = {
    contenedor: contenedoresType
    final: boolean
    proveedores: proveedoresType[]
    setDataToExcel: (e) => void

}
export default function InformeReportePredios(props: propsType): JSX.Element {
    return (
        <div className="historiales-listaempaque-info-container" id="view_informe_resporte_predios">
            <section >
                <div 
                    className="historiales-listaempaque-info-cabecera"
                    id="header_view_informe_reporte_predios"
                >
                    <img src={imagenCelifrut} />
                    <h2>REPORTE POR PREDIO ICA</h2>
                    <p>Codigo: PC-CAL-FOR-04
                        Versión: 03
                        Fecha: 17 Oct 2020
                    </p>
                </div>
                <hr />
                <div className="historiales-listaempaque-info-cabecera">
                    <p>CLIENTE:</p>
                    <p>{(typeof props.contenedor.infoContenedor.clienteInfo === "object" ?
                        props.contenedor.infoContenedor.clienteInfo.CLIENTE : "")}</p>

                </div>
                <div className="historiales-listaempaque-info-cabecera">
                    <p>FECHA:</p>
                    <p>{new Date(props.contenedor.infoContenedor.fechaCreacion).toLocaleDateString()}</p>

                </div>
                <hr />
            </section>
            <TablaReportePredios
                setDataToExcel={props.setDataToExcel}
                proveedores={props.proveedores}
                final={props.final} 
                data={props.contenedor} />
        </div>
    )
}