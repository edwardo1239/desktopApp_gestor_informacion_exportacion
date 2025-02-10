/* eslint-disable prettier/prettier */
import { contenedoresType } from "@renderer/types/contenedoresType";
import { lotesType } from "@renderer/types/lotesType"
import '../css/informesDatosGeneral.css'
import { formatearFecha } from "@renderer/functions/fechas";
type propsType = {
    loteSeleccionado: lotesType
    contenedores: contenedoresType[]
    setDataInforme: (e) => void
}

export default function ViewInformeDatosGenerales(props: propsType): JSX.Element {
    return (
        <div className="view-informes-datos-general-container">
            <div>
                <p>Clase de Fruta: <span>{props.loteSeleccionado.tipoFruta}</span></p>
                <p>Variedad:</p>
            </div>
            <div>
                <p>Fecha de Ingreso:
                    <span>
                        {formatearFecha(props.loteSeleccionado.fecha_ingreso_patio)}
                    </span>
                </p>
                <p>Lugar: <span>{props.loteSeleccionado.predio?.DEPARTAMENTO}</span></p>
            </div>
            <div>
                <p>Predio: <span>{props.loteSeleccionado.predio?.PREDIO}</span></p>
                <p>Código ICA: <span>{props.loteSeleccionado.predio?.ICA.code}</span></p>
                <p>Código GGN: <span>{
                props.loteSeleccionado && props.loteSeleccionado.predio?.GGN && props.loteSeleccionado.predio?.GGN.code &&
                props.loteSeleccionado.predio?.GGN.code}</span></p>
            </div>
            <div>
                <p>Cantidad Ingreso Kg: <span>{props.loteSeleccionado.kilos}</span></p>
                <p>Orden de compra N° <span>{props.loteSeleccionado.enf}</span></p>
            </div>
            <div>
                <p>TRZ:
                    <span>
                        {
                            props.contenedores !== undefined &&
                            props.contenedores.reduce((acu, cont) => (acu += cont.numeroContenedor + "-"), ' ')
                        }
                    </span></p>
            </div>
        </div>
    )
}