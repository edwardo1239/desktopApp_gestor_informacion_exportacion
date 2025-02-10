/* eslint-disable prettier/prettier */

import { useContext, useEffect, useState } from "react"
import { contenedoresContext, contenedorSeleccionadoContext } from "../ProcesoListaEmpaque"
import { obtenerResumen, resultadoObtenerresumenContenedores } from "@renderer/functions/resumenContenedores";




export default function Resumen(): JSX.Element {
    const contenedores = useContext(contenedoresContext)
    const contenedorID = useContext(contenedorSeleccionadoContext)

    const [resumen, setResumen] = useState<resultadoObtenerresumenContenedores>();
    const [soloHoy, setSoloHoy] = useState<string>('')
    const [verKilos, setVerKilos] = useState<boolean>(false)
    const [verCajas, setVerCajas] = useState<boolean>(false)
    const [verPorcentaje, setVerPorcentaje] = useState<boolean>(false)
    const [verPorcentajeCajas, setVerPorcentajeCajas] = useState<boolean>(false)
    const [showCalibeCalidad, setShowCalibreCalidad] = useState<boolean>(false)

    useEffect(() => {
        let cont
        if (contenedorID === undefined || contenedorID === '') {
            cont = contenedores
        } else {
            const contenedor = contenedores?.find(c => c._id === contenedorID);
            cont = [contenedor]
        }


        const resumenv = obtenerResumen(cont, soloHoy)
        if (resumenv)
            setResumen(resumenv);

    }, [contenedorID, contenedores, soloHoy])
    return (
        <div className="proceso-listaempaque-resumen-container">
            <div className="resumen-container-buttons-div">
                <section className="proceso-listaempaque-resumen-filtro-button-hoy">
                    <p>Calibre/Calidad</p>
                    <label className="switch">
                        <input type="checkbox" onChange={(e): void => setShowCalibreCalidad(e.target.checked)} />
                        <span className="slider round"></span>
                    </label>
                </section>
                <section className="proceso-listaempaque-resumen-filtro-button-hoy">
                    <p>Solo Hoy</p>
                    <label className="switch">
                        <input type="checkbox" 
                            onChange={(e): void => setSoloHoy(
                                e.target.checked ? new Date().toISOString().split('T')[0] : '')} />
                        <span className="slider round"></span>
                    </label>
                </section>
                <section className="proceso-listaempaque-resumen-filtro-button-hoy">
                    <p>Kilos</p>
                    <label className="switch">
                        <input type="checkbox" onChange={(e): void => setVerKilos(e.target.checked)} />
                        <span className="slider round"></span>
                    </label>
                </section>
                <section className="proceso-listaempaque-resumen-filtro-button-hoy">
                    <p>N° Cajas</p>
                    <label className="switch">
                        <input type="checkbox" onChange={(e): void => setVerCajas(e.target.checked)} />
                        <span className="slider round"></span>
                    </label>
                </section>
                <section className="proceso-listaempaque-resumen-filtro-button-hoy">
                    <p>Kilos %</p>
                    <label className="switch">
                        <input type="checkbox" onChange={(e): void => setVerPorcentaje(e.target.checked)} />
                        <span className="slider round"></span>
                    </label>
                </section>
                <section className="proceso-listaempaque-resumen-filtro-button-hoy">
                    <p>Cajas %</p>
                    <label className="switch">
                        <input type="checkbox" onChange={(e): void => setVerPorcentajeCajas(e.target.checked)} />
                        <span className="slider round"></span>
                    </label>
                </section>
            </div>

            <section>
                <h3>Total:</h3>
                <div>
                    {<h4>{
                        resumen && Object.values(resumen).reduce((acu, item) => acu += item.totalCajas, 0).toLocaleString('es-CO')
                    } cajas</h4>}
                    {resumen && <h4>{Object.values(resumen).reduce((acu, item) => acu += item.totalKilos, 0).toLocaleString('es-CO')} Kg</h4>}
                </div>
            </section>

            <section>
                {resumen && Object.keys(resumen).map(tipoFruta => (
                    <div key={tipoFruta}>
                        <h2>{tipoFruta}</h2>
                        <hr />
                        <div className="table-container">
                            <table className="table-main" >
                                <thead>
                                    <tr>
                                        <th>{showCalibeCalidad ? "Calidades" : "Calibres"}</th>
                                        {verKilos && <th>Kilos</th>}
                                        {verCajas && <th>Cajas</th>}
                                        {verPorcentaje && <th>% Kilos</th>}
                                        {verPorcentajeCajas && <th>% Cajas</th>}
                                    </tr>
                                </thead>
                                {showCalibeCalidad ?
                                    <tbody>
                                        {Object.entries(resumen[tipoFruta].calidad).map(([calidad, value], index) => (
                                            <tr className={`${index % 2 === 0 ? 'fondo-par' : 'fondo-impar'}`} key={calidad}>
                                                <td>{calidad}</td>
                                                {verKilos &&
                                                    <td>{value.kilos.toLocaleString('es-CO')} Kg</td>}
                                                {verCajas &&
                                                    <td>{value.cajas.toLocaleString('es-CO')} </td>}
                                                {verPorcentaje &&
                                                    <td>{value.kilosP.toLocaleString('es-CO')} %</td>}
                                                {verPorcentajeCajas &&
                                                    <td>{value.cajasP.toLocaleString('es-CO')} %</td>}

                                            </tr>
                                        ))}
                                    </tbody>
                                    :
                                    <tbody>
                                        {Object.entries(resumen[tipoFruta].calibre).map(([calibre, value], index) => (
                                            <tr className={`${index % 2 === 0 ? 'fondo-par' : 'fondo-impar'}`} key={calibre}>
                                                <td>{calibre}</td>
                                                {verKilos &&
                                                    <td>{value.kilos.toLocaleString('es-CO')} Kg</td>}
                                                {verCajas &&
                                                    <td>{value.cajas.toLocaleString('es-CO')} </td>}
                                                {verPorcentaje &&
                                                    <td>{value.cajasP.toLocaleString('es-CO')} %</td>}
                                                {verPorcentajeCajas &&
                                                    <td>{value.cajasP.toLocaleString('es-CO')} %</td>}

                                            </tr>
                                        ))}
                                    </tbody>}
                            </table>
                        </div>
                    </div>
                ))}

            </section>
        </div>
    )
}
