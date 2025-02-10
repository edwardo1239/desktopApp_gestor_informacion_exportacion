/* eslint-disable prettier/prettier */
import { useContext, useEffect, useState } from "react"
import { contenedoresContext, contenedorSeleccionadoContext } from "../ProcesoListaEmpaque"
import { obtenerResumenPredios } from "@renderer/functions/resumenContenedores";

type PredioDatosType = {
    [key: string]: {
        enf: string;
        predio: string;
        cont: contType
        tipoFruta: string

    }
};

type contType = {
    [key: string]: {
        numero: number,
        cajas: number,
        kilos: number
    }
}

export default function ListaEmpaquePredios(): JSX.Element {
    const contenedores = useContext(contenedoresContext)
    const contenedorID = useContext(contenedorSeleccionadoContext)
    const [soloHoy, setSoloHoy] = useState<boolean>(false)
    const [predios, setPredios] = useState<PredioDatosType>()
    const [filtro, setFiltro] = useState<string>('')

    useEffect(() => {
        let cont
        if (contenedorID === undefined || contenedorID === '') {
            cont = contenedores
        } else {
            const contenedor = contenedores?.find(c => c._id === contenedorID);
            cont = [contenedor]
        }
        const data = obtenerResumenPredios(cont, soloHoy)
        setPredios(data);
    }, [soloHoy, contenedorID])



    if (predios === undefined) {
        return (
            <div>Cargando datos...</div>
        )
    }
    return (
        <div className="proceso-listaempaque-resumen-container">
            <div className="resumen-container-buttons-div">
                <section >
                    <div>
                        <label>Filtro predio</label>
                        <input
                            type="text"
                            className="defaultSelect"
                            onChange={(e): void => setFiltro(e.target.value)}
                        />
                    </div>
                </section>
                <section className="proceso-listaempaque-resumen-filtro-button-hoy">
                    <p>Solo Hoy</p>
                    <label className="switch">
                        <input type="checkbox" onChange={(e): void => setSoloHoy(e.target.checked)} />
                        <span className="slider round"></span>
                    </label>
                </section>
            </div>
            <section>
                <div className="table-container">
                    <table className="table-main">
                        <thead>
                            <tr>
                                <th>Predio</th>
                                <th>Contenedores</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.values(predios).map((lote, index) => {
                                if (
                                    lote.predio.toLowerCase().startsWith(filtro.toLowerCase()) ||
                                    lote.enf.toLocaleLowerCase().startsWith(filtro.toLocaleLowerCase())
                                ) {
                                    return (
                                        <tr key={lote.enf} className={`${index % 2 === 0 ? 'fondo-par' : 'fondo-impar'}`}>
                                            <td>{lote.enf} - {lote.predio}</td>
                                            <td>{Object.entries(lote.cont).map(([key, value]) => (
                                                <div key={key}>
                                                    <div>{value.numero}: {value.cajas} Cajas - {value.kilos.toFixed(2)}Kg</div>
                                                    <div>{lote.tipoFruta}</div>
                                                </div>
                                            ))}</td>
                                        </tr>
                                    )
                                } else {
                                    return
                                }
                            })}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    )
}
