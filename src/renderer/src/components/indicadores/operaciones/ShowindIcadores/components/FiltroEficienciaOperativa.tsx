/* eslint-disable prettier/prettier */

import useAppContext from "@renderer/hooks/useAppContext";
import { useEffect, useState } from "react";
import { CiSearch } from "react-icons/ci";
import { filtroType } from "../ShowIndicadores";

type propsType = {
    setFiltro: (e) => void
    filtro: filtroType | undefined
    obtenerRegistros: () => void
    setAgrupado: (e) => void
    agrupado: string
}

export default function FiltroEficienciaOperativa(props: propsType): JSX.Element {
    const { messageModal } = useAppContext();
    const [tipoFrutas, setTipoFrutas] = useState<string[]>();

    const obtenerTiposDeFrua = async (): Promise<void> => {
        try {
            const request = {
                action: "get_constantes_sistema_tipo_frutas"
            }
            const response = await window.api.server2(request);
            if (response.status !== 200) {
                throw new Error(`Code ${response.status}: ${response.message}`)
            }
            setTipoFrutas(response.data)
        } catch (err) {
            if (err instanceof Error) {
                messageModal("error", err.message);
            }
        }
    }
    useEffect(() => {
        obtenerTiposDeFrua();
    }, [])

    const handleChange = (e): void => {
        const { value, name } = e.target

        props.setFiltro({
            ...props.filtro,
            [name]: value,
        });
    };
    const handleTipoFruta = (e: React.ChangeEvent<HTMLSelectElement>): void => {

        if (!props.filtro?.[e.target.name]) {
            props.setFiltro({ ...props.filtro, [e.target.name]: [e.target.value] })
        } else {
            if (props.filtro[e.target.name].includes(e.target.value)) {
                const newFilter = props.filtro[e.target.name].filter(item => item !== e.target.value)
                console.log(newFilter)
                props.setFiltro({ ...props.filtro, [e.target.name]: newFilter })
            } else {
                props.setFiltro({ ...props.filtro, [e.target.name]: [...props.filtro[e.target.name], e.target.value] })
            }
        }
    };
    const handleBuscar = (): void => {
        props.obtenerRegistros();
    }
    return (
        <div className="filtro_proveedores-div">
            <div>
            <label className="tool-select-label" >
                Agrupar por:
            </label>
            <select
                onChange={(e):void => props.setAgrupado(e.target.value)}
                value={props.agrupado}
                name="agrupado"
                data-testid="indicadores_operaciones_eficiencia_operativa_agrupado"
                className="tool-select">
                <option value="dia">Día</option>
                <option value="semana">Semana</option>
                <option value="mes">Mes</option>
            </select>
            </div>

            <div>
                <label className="search-label">
                    Fecha Inicio:
                </label>
                <div className="search-container">
                    <input
                        onChange={handleChange}
                        type="date"
                        name="fechaInicio"
                        className="search-input"
                        data-testid="indicadores_operaciones_eficiencia_operativa_fecha_inicio"
                        value={
                            props.filtro?.fechaInicio
                                ? props.filtro.fechaInicio.substring(0, 10)
                                : ''
                        }
                    />
                </div>
            </div>
            <div>
                <label className="search-label">
                    Fecha Fin:
                </label>
                <div className="search-container">
                    <input
                        onChange={handleChange}
                        type="date"
                        name="fechaFin"
                        className="search-input"
                        data-testid="indicadores_operaciones_eficiencia_operativa_fecha_fin"
                        value={
                            props.filtro?.fechaFin
                                ? props.filtro.fechaFin.substring(0, 10)
                                : ''
                        }
                    />
                </div>
            </div>
            <label className="tool-select-label">
                Tipo fruta:
            </label>
            <select
                multiple
                name="tipoFruta"
                onChange={handleTipoFruta}
                data-testid="indicadores_operaciones_eficiencia_operativa_tipo_fruta"
                className="tool-select"
                value={props.filtro?.tipoFruta ?? []}
                >
                <option value=""></option>
                {tipoFrutas && tipoFrutas.map(item => <option key={item} value={item}>{item}</option>)}
            </select>

            <button
                className="add-record"
                onClick={handleBuscar}
            >
                Buscar
                <CiSearch />
            </button>
        </div >
    )
}
