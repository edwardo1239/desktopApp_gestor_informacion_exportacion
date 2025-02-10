/* eslint-disable prettier/prettier */

import { useContext, useEffect, useState } from "react"
import { contenedoresContext, contenedorSeleccionadoContext } from "../ProcesoListaEmpaque"
import { contenedoresType } from "@renderer/types/contenedoresType"
import TarjetaPallet from "./TarjetaPallet"
import ConfigurarPallet from "./ConfigurarPallet"
import InfoPallet from "./InfoPallet"
import AddCajasPallet from "./AddCajasPallet"
import EliminarItems from "./EliminarItems"
import AddPalletElement from "./AddPalletElement"
import LiberarPallet from "./LiberarPallet"

type propsType = {
    setPalletSeleccionado: (e:number) => void
    obtenerDataContenedores: () => void
}

export default function Pallets(props:propsType): JSX.Element {
    const contenedores = useContext(contenedoresContext)
    const contenedorSeleccionado = useContext(contenedorSeleccionadoContext)
    const [contenedor, setContenedor] = useState<contenedoresType>()
    useEffect(() => {
        if (contenedorSeleccionado !== undefined && contenedores !== undefined) {
            const cont = contenedores.find(c => c._id === contenedorSeleccionado)
            setContenedor(cont)
        }
    }, [contenedores, contenedorSeleccionado, contenedor]);

    const handlePalletSelect = (e):void => {
        props.setPalletSeleccionado(e)
    }

    if (contenedor === undefined) {
        return (
            <div className="proceso-lista-empaque-pallets-sin-contenedor">
                <hr />
                Seleccione contenedor...
            </div>
        )
    }
    return (
        <div>
            <div className="proceso-lista-empaque-pallets">
                {contenedor.pallets?.map((_, index) => (
                    <div key={index}>
                        <TarjetaPallet
                            handlePalletSelect={handlePalletSelect}
                            contenedor={contenedor}
                            pallet={index}
                        />
                    </div>
                ))}
                <AddPalletElement obtenerDataContenedores={props.obtenerDataContenedores} contenedor={contenedor}/>
            </div>
            <ConfigurarPallet contenedor={contenedor} />
            <InfoPallet contenedor={contenedor} />
            <AddCajasPallet contenedor={contenedor} />
            <EliminarItems contenedor={contenedor} />
            <LiberarPallet contenedor={contenedor} />
        </div>
    )
}
