/* eslint-disable prettier/prettier */

import useAppContext from "@renderer/hooks/useAppContext";
import { indicadoresType } from "@renderer/types/indicadoresType"
import { useEffect, useState } from "react"
import './styles.css'
import FiltroEficienciaOperativa from "./components/FiltroEficienciaOperativa";
import { agruparRegistros, promedio, total_eficiencia_operativa } from "./function";
import GraficoBarrasEficienciaOperativa from "./components/GraficoBarrasEficienciaOperativa";
import TablaEficienciaOperativa from "./components/TablaEficienciaOperativa";

export type filtroType = {
    fechaInicio?: string
    fechaFin?: string
    tipoFruta?: string[]
}



export default function ShowIndicadores(): JSX.Element {
    const { messageModal } = useAppContext();
    const [data, setData] = useState<indicadoresType[]>();
    const [dataOriginal, setDataOriginal] = useState<indicadoresType[]>();
    const [filtro, setFiltro] = useState<filtroType>();
    const [agrupado, setAgrupado] = useState<string>("dia");

    const obtenerRegistros = async (): Promise<void> => {
        try {
            const request = {
                action: "get_indicadores_operaciones_eficiencia_operativa_registros",
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

    useEffect(() => {
        obtenerRegistros();
    }, [])
    useEffect(() => {
        const dataFiltrada = agruparRegistros(dataOriginal, agrupado);
        setData([...dataFiltrada])
    }, [agrupado])
    if (data === undefined) return <div>Loading...</div>
    return (
        <div>
            <div className="navBar"></div>
            <h2>Eficiencia Operativa</h2>
            <hr />
            <FiltroEficienciaOperativa
                setAgrupado={setAgrupado}
                agrupado={agrupado}
                setFiltro={setFiltro}
                filtro={filtro}
                obtenerRegistros={obtenerRegistros} />
            <div className="indicadores-opearciones-eficiencia_operativa-comntainer">
                <div className="item1">
                    <TablaEficienciaOperativa data={data} agrupado={agrupado} />
                </div>
                <div className="item2">
                    <div>
                        <h3>Sumatoria Kilos procesados:</h3>
                        <h3>{data.reduce((acu, item) => acu += item.kilos_procesador, 0).toFixed(2)}</h3>
                    </div>
                    <div>
                        <h3>Promedio kilos procesados</h3>
                        <h3>{promedio(data, "kilos_procesador").toFixed(2)}</h3>
                    </div>
                    <div>
                        <h3>Total eficiencia operativa</h3>
                        <h3>{total_eficiencia_operativa(data).toFixed(2)}%</h3>
                    </div>
                </div>
                <div className="item3">
                    <GraficoBarrasEficienciaOperativa agrupacion={agrupado} data={data} />
                </div>
            </div>

        </div>
    )
}
