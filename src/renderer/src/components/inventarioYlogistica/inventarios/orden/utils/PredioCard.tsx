/* eslint-disable prettier/prettier */
import { lotesType } from "@renderer/types/lotesType"
import { BsArrowRightSquareFill } from "react-icons/bs";
import { formatearFecha } from "@renderer/functions/fechas";
import { useEffect, useState } from "react";

type propsType = {
    lote: lotesType
    handleAddOrdenVaceo: (_id) => void
}

export default function PredioCard(props: propsType): JSX.Element {
    const [exportacion, setExportacion] = useState<number>()
    const [descarte, setDescarte] = useState<number>()
    useEffect(() => {
        if (props.lote.calidad && props.lote.calidad.inspeccionIngreso) {
            let des = 0;
            let exp = 0;
            for (const [key, value] of Object.entries(props.lote.calidad?.inspeccionIngreso)) {
                if(key === 'exportacion1' || key === 'exportacion15' || key === 'exportacion2'){
                    exp += Number(value)
                } else if(key !== 'fecha') {
                    des += Number(value)
                }
            }
            setExportacion(exp * 100)
            setDescarte(des * 100)
        }
    }, [props.lote])
    return (
        <div className="orden-vaciado-tarjeta-container">
            <div className="div1">
                <div className="orden-vaciado-tarjeta-nombre-predio-div">
                    <p>{props.lote.enf}</p>
                    <p>{props.lote.predio?.PREDIO}</p>
                    <p>{formatearFecha(props.lote.fecha_ingreso_inventario)}</p>
                    <p>{props.lote.tipoFruta}</p>
                    {Object.prototype.hasOwnProperty.call(props.lote, "desverdizado") ?
                        <p> Canastillas: {Number(props.lote?.inventario)}</p> :
                        <p>Canastillas: {Number(props.lote?.inventario)}</p>
                    }

                </div>
                <div className="orden-vaciado-tarjeta-nombre-predio-div">
                    {Object.prototype.hasOwnProperty.call(props.lote, "desverdizado") ?
                        <p>Canastillas:
                            {(Number(props.lote?.inventario) *
                                Number(props.lote.promedio)).toLocaleString('es-CO')} Kg</p> :
                        <p> Canastillas:
                            {(Number(props.lote?.inventario) *
                                Number(props.lote.promedio)).toLocaleString('es-CO')} Kg</p>
                    }
                    {Object.prototype.hasOwnProperty.call(props.lote, "desverdizado") &&
                        <p>Desverdizado</p>
                    }
                    <p>Exportacion: {exportacion?.toFixed(2)} %</p>
                    <p>Descarte: {descarte?.toFixed(2)} %</p>
                    {/* <p>{props.lote._id}</p> */}
                </div>
            </div>
            <div className="div2">


                <button onClick={(): void => props.handleAddOrdenVaceo(props.lote._id)}>
                    <BsArrowRightSquareFill />
                </button>

            </div>
        </div>
    )
}
