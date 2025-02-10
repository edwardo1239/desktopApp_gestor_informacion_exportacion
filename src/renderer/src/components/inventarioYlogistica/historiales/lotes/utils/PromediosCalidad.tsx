/* eslint-disable prettier/prettier */

import { filtroColumnasCalidadType } from "../type/types"
import {  KEY_FILTRO_COL_CALIDAD } from "../functions/constantes"
import { promedioCalidad } from "../functions/functions"
import { lotesType } from "@renderer/types/lotesType"

type propsType = {
    columnVisibility: filtroColumnasCalidadType
    data: lotesType[]
}

export default function PromediosCalidad(props: propsType): JSX.Element {
    return (
        <div className="componentContainer">
            <div className="lotes-proceso-promedios-div">
                <h3>Promedios</h3>
                <div className="lotes-proceso-promedios-div2">
                    {Object.keys(props.columnVisibility).map((item, index) => {
                        if (props.columnVisibility[item] && item) {
                            return (<p key={index}>{KEY_FILTRO_COL_CALIDAD[item]}: {promedioCalidad(props.data, item).toFixed(2)}</p>)
                        } else {
                            return null
                        }
                    })}
                </div>
            </div>
        </div>
    )
}