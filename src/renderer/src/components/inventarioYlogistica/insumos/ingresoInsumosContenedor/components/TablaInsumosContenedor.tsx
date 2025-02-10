/* eslint-disable prettier/prettier */

import { contenedoresType } from "@renderer/types/contenedoresType"
import { insumosType } from "@renderer/types/insumos"

type propsType = {
    insumosCont: insumosType[] | undefined
    contenedor: contenedoresType | undefined
}

export default function TablaInsumosContenedor(props: propsType): JSX.Element {
    const header = ["Codigo", "Insumo", "Cantidad", "Medida"]

    if (props.insumosCont === undefined) {
        return (
            <div>
                Seleccione el contenedor...
            </div>
        )
    }


    return (
        <div className="table-container">
            <table className="table-main">
                <thead>
                    <tr>
                        {header.map(item => (
                            <th key={item}>{item}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {props.insumosCont.map((insumo, index) => (
                        <tr className={`${index % 2 === 0 ? 'fondo-par' : 'fondo-impar'}`} key={insumo._id}>
                            <td>{insumo.codigo ? insumo.codigo : 'N/A'}</td>
                            <td>{insumo.insumo ? insumo.insumo : 'N/A'}</td>
                            <td>{props.contenedor && props.contenedor.insumosData && props.contenedor.insumosData[insumo._id] ?
                                props.contenedor.insumosData[insumo._id].toLocaleString('es-CO')
                                : 'N/A'
                            }

                            </td>
                            <td>{insumo.medida ? insumo.medida : 'N/A'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}