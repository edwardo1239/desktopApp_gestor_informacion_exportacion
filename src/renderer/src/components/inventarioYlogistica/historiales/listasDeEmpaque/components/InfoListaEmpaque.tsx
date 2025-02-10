/* eslint-disable prettier/prettier */

import { useEffect, useState } from "react"
import { contenedoresType } from "@renderer/types/contenedoresType"
import InformeListaEmpaque from "./InformeListaEmpaque"
import InformeReportePredios from "./InformeReportePredios"
import { proveedoresType } from "@renderer/types/proveedoresType"
import useAppContext from "@renderer/hooks/useAppContext"
import { resumenPredioType } from "../functions/reportePredios"

type propsType = {
    contenedor: contenedoresType | undefined
    handleVolverTabla: () => void
    proveedores: proveedoresType[] | undefined
}

export default function InfoListaEmpaque(props: propsType): JSX.Element {
    const { messageModal } = useAppContext();
    const [tipoFruta, setTipoFruta] = useState<string>()
    const [final, setFinal] = useState<boolean>(false)
    const [reportePredios, setReportePredios] = useState<boolean>(false)
    const [dataToExcel, setDataToExcel] = useState<resumenPredioType>()
    useEffect(() => {
        if (props.contenedor) {
            if (props.contenedor.infoContenedor.tipoFruta === "Naranja") {
                setTipoFruta("Naranja")
            } else if (props.contenedor.infoContenedor.tipoFruta === "Limon") {
                setTipoFruta("Limon")
            } else if (props.contenedor.infoContenedor.tipoFruta === "Mixto") {
                setTipoFruta("Limon - Naranja")
            }
        }
    }, [])
    const generar_informe = async (): Promise<void> => {
        try {
            if (!props.contenedor) throw new Error("No hay contenedor seleccionado")

                const data = {
                    action: "crear_lista_empaque",
                    data:{
                        contenedor: props.contenedor,
                        proveedores: props.proveedores
                    }
                }
                window.api.crearDocumento(data)

        } catch (err) {
            console.error('Error al generar PDF:', err);
            messageModal("error", "Error al generar el PDF");
        }
    };

    const generar_informe_reporte_predios =  (): void => {
        try {
            if (!props.contenedor) throw new Error("No hay contenedor seleccionado")

            const data = {
                action: "crear_resporte_predios_lista_empaque",
                data:{
                    contenedor: props.contenedor,
                    tabla: dataToExcel
                }
            }
            window.api.crearDocumento(data)

        } catch (err) {
            if (err instanceof Error) {
                console.error('Error al generar PDF:', err);
                messageModal("error", `Error ${err.message}`);
            }
        }
    }



    if (props.contenedor === undefined) {
        return (
            <div>Contenedor no seleccionado...</div>
        )
    }
    if (props.proveedores === undefined) {
        return (
            <div>Cargando datos...</div>
        )
    }
    return (
        <div>
            <div className="historiales-listaempaque-info-container-filtros">
                <button className="defaulButtonAgree" onClick={props.handleVolverTabla}>Regresar</button>
                <div>
                    <p>Local/Cliente</p>
                    <label className="switch">
                        <input type="checkbox" onChange={(e): void => setFinal(e.target.checked)} />
                        <span className="slider round"></span>
                    </label>
                </div>
                <div>
                    <p>Reporte de predios</p>
                    <label className="switch">
                        <input type="checkbox" onChange={(e): void => setReportePredios(e.target.checked)} />
                        <span className="slider round"></span>
                    </label>
                </div>
            </div>
            <div>
                {reportePredios ?
                    <InformeReportePredios
                        setDataToExcel={setDataToExcel}
                        proveedores={props.proveedores}
                        final={final}
                        contenedor={props.contenedor} />
                    :
                    <InformeListaEmpaque
                        proveedores={props.proveedores}
                        tipoFruta={tipoFruta}
                        final={final}
                        contenedor={props.contenedor} />
                }
            </div>
            <div className='informe-calidad-lote-div'>
                <button onClick={(): void => {
                    if (reportePredios) {
                        generar_informe_reporte_predios()
                    } else {
                        generar_informe()
                    }
                }} className='defaulButtonAgree' >Generar informe</button>
            </div>
        </div>
    )
}
