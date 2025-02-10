/* eslint-disable prettier/prettier */

import { recordLotesType } from "@renderer/types/recorLotesType"

type propsType = {
    data: recordLotesType[]
}

export default function TablaEnceradoHistorial(props: propsType): JSX.Element {
    const header =
        ["enf", "Predio", "General", "Pareja", "Balin", " Extra", "Descompuesta", "Suelo", "Nacional", "Usuario", "Fecha"];
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
                            <td>{item.documento.descartes["descarteEncerado.descarteGeneral"]} Kg</td>
                            <td>{item.documento.descartes["descarteEncerado.pareja"]} Kg</td>
                            <td>{item.documento.descartes["descarteEncerado.balin"]} Kg</td>
                            <td>{item.documento.descartes["descarteEncerado.extra"]} Kg</td>
                            <td>{item.documento.descartes["descarteEncerado.descompuesta"]} Kg</td>
                            <td>{item.documento.descartes["descarteEncerado.suelo"]} Kg</td>
                            <td>{item.documento.descartes["descarteEncerado.frutaNacional"]} Kg</td>
                            <td>{item.user}</td>
                            <td>{new Date(item.fecha).toLocaleDateString('es-CO')}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}