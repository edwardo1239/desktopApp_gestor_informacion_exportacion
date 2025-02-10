/* eslint-disable prettier/prettier */

import { recordLotesType } from "@renderer/types/recorLotesType"

type propsType = {
    data: recordLotesType[]
}

export default function Tabla(props: propsType): JSX.Element {
    const header =
        ["enf", "Predio", "General", "Pareja", "Balin", "descompuesta", "Piel", "Hojas", "Usuario", "Fecha"];
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
                    {props.data.map((item, index) => (
                        <tr className={`${index % 2 === 0 ? 'fondo-par' : 'fondo-impar'}`} key={item._id}>
                            <td>{item.documento.enf}</td>
                            <td>{item.documento.predio.PREDIO}</td>
                            <td>{item.documento.descartes["descarteLavado.descarteGeneral"]} Kg</td>
                            <td>{item.documento.descartes["descarteLavado.pareja"]} Kg</td>
                            <td>{item.documento.descartes["descarteLavado.balin"]} Kg</td>
                            <td>{item.documento.descartes["descarteLavado.descompuesta"]} Kg</td>
                            <td>{item.documento.descartes["descarteLavado.piel"]} Kg</td>
                            <td>{item.documento.descartes["descarteLavado.hojas"]} Kg</td>
                            <td>{item.user}</td>
                            <td>{new Date(item.fecha).toLocaleDateString('es-CO')}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}