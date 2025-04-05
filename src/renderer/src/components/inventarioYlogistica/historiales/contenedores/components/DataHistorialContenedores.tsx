/* eslint-disable prettier/prettier */

import { contenedoresType } from "@renderer/types/contenedoresType"
import { useEffect, useState } from "react"
import { obtenerResumen, obtenerResumenPredios, resultadoObtenerresumenContenedores } from "@renderer/functions/resumenContenedores"

type propsType = {
    setShowData: (e: boolean) => void
    dataContenedores: contenedoresType[] | undefined
}

type PredioDatosType = {
    [key: string]: {
        enf: string;
        predio: string;
        cont: contType,
        tipoFruta: string,
        calibres: calibreType
    }
};
type contType = {
    [key: string]: {
        numero: number,
        cajas: number,
        kilos: number
    }
}
type calibreType = {
    [key: string]: {
        cajas: number,
        kilos: number
    }
}

export default function DataHistorialContenedores(props: propsType): JSX.Element {
    const [fecha, setFecha] = useState<string>('');
    const [showCalibeCalidad, setShowCalibreCalidad] = useState<boolean>(false)
    const [verKilos, setVerKilos] = useState<boolean>(true)
    const [verCajas, setVerCajas] = useState<boolean>(true)
    const [verPorcentaje, setVerPorcentaje] = useState<boolean>(true)
    const [verPorcentajeCajas, setVerPorcentajeCajas] = useState<boolean>(true)
    const [numeroPallets, setNumeroPallets] = useState<boolean>(true)
    const [arrayCont, setArrayCont] = useState<string[]>([])
    const [dataContenedores, setDataContenedores] = useState<contenedoresType[]>();

    const [resumen, setResumen] = useState<resultadoObtenerresumenContenedores>();
    const [showPredios, setShowPredios] = useState<boolean>(false)
    const [predios, setPredios] = useState<PredioDatosType>()
    const [filtro, setFiltro] = useState<string>('')

    useEffect(() => {
        if (props.dataContenedores !== undefined) {
            setDataContenedores(props.dataContenedores);
            const resumenv = obtenerResumen(props.dataContenedores, fecha)
            if (resumenv)
                setResumen(resumenv);
        }
    }, [props.dataContenedores, fecha]);
    const handleClickContenedores = (e: string): void => {
        if (arrayCont.includes(e)) {
            const newArr = arrayCont.filter(id => !(id === e));
            setArrayCont(newArr)
        } else {
            const newArr = [...arrayCont, e];
            setArrayCont(newArr)
        }
    }

    useEffect(() => {
        if (dataContenedores !== undefined) {

            const contenedoresFiltrados = dataContenedores
                .filter(item => arrayCont.includes(item._id as string))

            const resumenv = obtenerResumen(contenedoresFiltrados, fecha)
            if (resumenv)
                setResumen(resumenv);

        }
    }, [arrayCont])

    useEffect(() => {
        if (dataContenedores !== undefined) {

            const contenedoresFiltrados = dataContenedores
                .filter(item => arrayCont.includes(item._id as string))
            const data = obtenerResumenPredios(contenedoresFiltrados, false)
            setPredios(data);
        }
    }, [props.dataContenedores, arrayCont])

    if (props.dataContenedores === undefined) {
        return (
            <div>
                <div className="historial-listasempaque-busqueda">
                    <button onClick={(): void => props.setShowData(false)} className="defaulButtonAgree">Volver a buscar</button>
                </div>
                <h2>Cargando contenedores...</h2>
            </div>
        )
    }

    return (
        <div>
            <div className="historial-listasempaque-busqueda">
                <button onClick={(): void => props.setShowData(false)} className="defaulButtonAgree">Volver a buscar</button>
                <button
                    className="defaulButtonAgree"
                    onClick={(): void => setShowPredios(!showPredios)}>
                    {showPredios ? "Calidades/Calibre" : "Predios"}
                </button>
            </div>
            {showPredios ?
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
                            <p>Cajas/Calibres</p>
                            <label className="switch">
                                <input type="checkbox" checked={showCalibeCalidad} onChange={(e): void => setShowCalibreCalidad(e.target.checked)} />
                                <span className="slider round"></span>
                            </label>
                        </section>
                    </div>
                </div>
                :
                <div className="proceso-listaempaque-resumen-container">
                    <div className="resumen-container-buttons-div">
                        <section className="proceso-listaempaque-resumen-filtro-button-fecha">
                            <p>Fecha</p>
                            <label>
                                <input type="date" onChange={(e): void => setFecha(e.target.value)} />
                            </label>
                        </section>
                        <section className="proceso-listaempaque-resumen-filtro-button-hoy">
                            <p>Calibre/Calidad</p>
                            <label className="switch">
                                <input type="checkbox" checked={showCalibeCalidad} onChange={(e): void => setShowCalibreCalidad(e.target.checked)} />
                                <span className="slider round"></span>
                            </label>
                        </section>
                        <section className="proceso-listaempaque-resumen-filtro-button-hoy">
                            <p>Kilos</p>
                            <label className="switch">
                                <input type="checkbox" checked={verKilos} onChange={(e): void => setVerKilos(e.target.checked)} />
                                <span className="slider round"></span>
                            </label>
                        </section>
                        <section className="proceso-listaempaque-resumen-filtro-button-hoy">
                            <p>N° Cajas</p>
                            <label className="switch">
                                <input type="checkbox" checked={verCajas} onChange={(e): void => setVerCajas(e.target.checked)} />
                                <span className="slider round"></span>
                            </label>
                        </section>
                        <section className="proceso-listaempaque-resumen-filtro-button-hoy">
                            <p>Kilos %</p>
                            <label className="switch">
                                <input type="checkbox" checked={verPorcentaje} onChange={(e): void => setVerPorcentaje(e.target.checked)} />
                                <span className="slider round"></span>
                            </label>
                        </section>
                        <section className="proceso-listaempaque-resumen-filtro-button-hoy">
                            <p>Cajas %</p>
                            <label className="switch">
                                <input type="checkbox" checked={verPorcentajeCajas} onChange={(e): void => setVerPorcentajeCajas(e.target.checked)} />
                                <span className="slider round"></span>
                            </label>
                        </section>
                        <section className="proceso-listaempaque-resumen-filtro-button-hoy">
                            <p>N° Pallets</p>
                            <label className="switch">
                                <input type="checkbox" checked={numeroPallets} onChange={(e): void => setNumeroPallets(e.target.checked)} />
                                <span className="slider round"></span>
                            </label>
                        </section>

                    </div>
                </div>
            }
            <section className="historial-contenedores-mostrar-numero-contenedor">
                Contenedores:
                {props.dataContenedores.map(cont => (
                    <button
                        className={arrayCont.includes(cont._id as string)
                            ? 'historial-contenedores-contenedor-select' : ''}
                        key={cont._id}
                        onClick={(): void => handleClickContenedores(cont._id as string)}
                    >
                        {cont.numeroContenedor}
                    </button>
                ))}
            </section>
            <section className="historial-contenedores-mostrar-total-cajas-kilos-section">
                <h3>Total:</h3>
                {<h4>{
                    resumen && Object.values(resumen).reduce((acu, item) => acu += item.totalCajas, 0).toLocaleString('es-CO')
                } cajas</h4>}
                {resumen && <h4>{Object.values(resumen).reduce((acu, item) => acu += item.totalKilos, 0).toLocaleString('es-CO')} Kg</h4>}
            </section>
            {showPredios ?
                <section>
                    <div className="table-container">
                        <table className="table-main">
                            <thead>
                                <tr>
                                    <th>Predio</th>
                                    <th>Contenedores</th>
                                </tr>
                            </thead>
                            {predios && !showCalibeCalidad ?
                                <tbody>
                                    {predios && Object.values(predios).map((lote, index) => {
                                        if (
                                            lote.predio.toLowerCase().startsWith(filtro.toLowerCase()) ||
                                            lote.enf.toLocaleLowerCase().startsWith(filtro.toLocaleLowerCase())
                                        ) {
                                            return (
                                                <tr key={lote.enf} className={`${index % 2 === 0 ? 'fondo-par' : 'fondo-impar'}`}>
                                                    <td>{lote.enf} - {lote.predio}</td>
                                                    <td>{Object.entries(lote.cont).map(([key, value]) => (
                                                        <div key={key}>
                                                            <div>{value.numero}: {value.cajas} Cajas - {value.kilos}Kg</div>
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
                                :
                                <tbody>
                                    {predios && Object.values(predios).map((lote, index) => {
                                        if (
                                            lote.predio.toLowerCase().startsWith(filtro.toLowerCase()) ||
                                            lote.enf.toLocaleLowerCase().startsWith(filtro.toLocaleLowerCase())
                                        ) {
                                            return(<tr key={lote.enf} className={`${index % 2 === 0 ? 'fondo-par' : 'fondo-impar'}`}>
                                                <td>{lote.enf} - {lote.predio}</td>
                                                <td>{Object.entries(lote.calibres).map(([key, value]) => (
                                                    <div key={key}>
                                                        <div>{key}: {value.cajas} Cajas - {value.kilos}Kg</div>
                                                        <div>{lote.tipoFruta}</div>
                                                    </div>
                                                ))}</td>
                                            </tr>)
                                        }
                                        else {
                                            return null
                                        }
                                    })}

                                </tbody>
                            }

                        </table>
                    </div>
                </section>
                :
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
                                            {numeroPallets && <th>N° Pallets</th>}
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
                                                    {numeroPallets &&
                                                        <td>{value.pallet.toLocaleString('es-CO')}</td>}
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
                                                    {numeroPallets &&
                                                        <td>{value.pallet.toLocaleString('es-CO')}</td>}
                                                </tr>
                                            ))}
                                        </tbody>}
                                </table>
                            </div>
                        </div>
                    ))}

                </section>
            }
        </div>
    )
}