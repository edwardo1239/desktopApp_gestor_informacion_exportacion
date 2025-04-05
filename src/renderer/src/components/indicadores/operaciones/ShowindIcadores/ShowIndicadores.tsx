/* eslint-disable prettier/prettier */

import useAppContext from "@renderer/hooks/useAppContext";
import { indicadoresType } from "@renderer/types/indicadoresType"
import { useEffect, useState } from "react"
import './styles.css'
import FiltroEficienciaOperativa from "./components/FiltroEficienciaOperativa";
import { agrupar_lotes, agrupar_volante_calidad, agruparRegistros, outTypeLoteIndicadores } from "./function";
import EficienciaOperativaComponent from "./components/EficienciaOperativaComponent";
import EficienciaFrutaComponent from "./components/EficienciaFrutaComponent";
import { lotesType } from "@renderer/types/lotesType";
import TiempoCicloPredios from "./components/TiempoCicloPredios";
import { volanteCalidadType } from "@renderer/types/formulariosCalidad";
import NoCalidad from "./components/NoCalidad";

export type filtroType = {
    fechaInicio?: string
    fechaFin?: string
    tipoFruta?: string[]
}



export default function ShowIndicadores(): JSX.Element {
    const { messageModal } = useAppContext();
    const [data, setData] = useState<indicadoresType[]>();
    const [dataLotes, setDataLotes] = useState<outTypeLoteIndicadores[]>()
    const [lotes, setLotes] = useState<lotesType[]>()
    const [dataOriginal, setDataOriginal] = useState<indicadoresType[]>();
    const [volanteCalidad, setVolanteCalidad] = useState<volanteCalidadType[]>()
    const [volanteCalidadOriginal, setVolanteCalidadOriginal] = useState<volanteCalidadType[]>()

    const [filtro, setFiltro] = useState<filtroType>();
    const [agrupado, setAgrupado] = useState<string>("dia");
    const [indicador, setIndicador] = useState<string>('')

    const obtenerRegistros = async (): Promise<void> => {
        try {
            const request = {
                action: "get_indicadores_operaciones_registrosDiarios",
                filtro: filtro
            }
            const response = await window.api.server2(request);
            if (response.status !== 200) {
                throw new Error(`Code ${response.status}: ${response.message}`);
            }
            const dataFiltrada = agruparRegistros(response.data, agrupado);
            setData(JSON.parse(JSON.stringify(dataFiltrada)));
            setDataOriginal(JSON.parse(JSON.stringify(response.data)));
        } catch (err) {
            if (err instanceof Error) {
                messageModal("error", err.message);
            }
        }
    }
    const obtenerLotes = async (): Promise<void> => {
        try {
            const request = {
                action: "get_indicadores_operaciones_lotes",
                filtro: filtro
            }
            const response = await window.api.server2(request);
            if (response.status !== 200) {
                throw new Error(`Code ${response.status}: ${response.message}`);
            }
            const datalotes = agrupar_lotes(response.data, agrupado)
            setDataLotes(JSON.parse(JSON.stringify(datalotes)));
            // setDataLotesOriginales(JSON.parse(JSON.stringify(response.data)));
            setLotes(response.data)

        } catch (err) {
            if (err instanceof Error) {
                messageModal("error", err.message)
            }
        }
    }
    const obtenerDatosVolanteCalidad = async (): Promise<void> => {
        try {
            const request = {
                action: "get_indicadores_operaciones_noCalidad",
                filtro: filtro
            }
            const response = await window.api.server2(request)
            if (response.status !== 200) {
                throw new Error(`Code ${response.status}: ${response.message}`)
            }
            const dataFiltrada = agrupar_volante_calidad(response.data, agrupado);
            setVolanteCalidad(JSON.parse(JSON.stringify(dataFiltrada)));
            setVolanteCalidadOriginal(JSON.parse(JSON.stringify(response.data)));
            
        } catch (err) {
            if (err instanceof Error) {
                messageModal("error", err.message)
            }
        }
    }
    const obtenerDataHandler = (): void => {
        if (indicador === "EficienciaOperativa" || indicador === 'EficienciaFruta') {
            obtenerRegistros()
        } else if (indicador === 'tiempoCicloPredios') {
            obtenerLotes()
        } else if (indicador === 'NoCalidad') {
            obtenerDatosVolanteCalidad()
        }
    }

    // useEffect(() => {
    //     obtenerRegistros();
    //     obtenerLotes();
    // }, [])

    useEffect(() => {
        const dataFiltrada = agruparRegistros(dataOriginal, agrupado);
        setData([...dataFiltrada])
        const dataLotesFiltrados = agrupar_lotes(lotes, agrupado);
        setDataLotes([...dataLotesFiltrados])
        const dataVolanteCalidad = agrupar_volante_calidad(volanteCalidadOriginal, agrupado);
        setVolanteCalidad([...dataVolanteCalidad])


    }, [agrupado])
    return (
        <div>
            <div className="navBar"></div>
            <h2>Eficiencia Operativa</h2>
            <hr />
            <FiltroEficienciaOperativa
                setIndicador={setIndicador}
                indicador={indicador}
                setAgrupado={setAgrupado}
                agrupado={agrupado}
                setFiltro={setFiltro}
                filtro={filtro}
                obtenerRegistros={obtenerDataHandler} />
            {(data === undefined) ||
                (volanteCalidad === undefined) ||
                (dataLotes === undefined) ?
                <div>Loading...</div> :

                <>
                    {indicador === 'EficienciaOperativa' &&
                        <EficienciaOperativaComponent data={data} agrupado={agrupado} />}
                    {indicador === 'EficienciaFruta' &&
                        <EficienciaFrutaComponent data={data} agrupado={agrupado} />}
                    {indicador === 'tiempoCicloPredios' &&
                        <TiempoCicloPredios data={dataLotes} agrupado={agrupado} />}
                    {indicador === 'NoCalidad' &&
                        <NoCalidad data={volanteCalidad} agrupado={agrupado} />}
                </>
            }


        </div>
    )
}
