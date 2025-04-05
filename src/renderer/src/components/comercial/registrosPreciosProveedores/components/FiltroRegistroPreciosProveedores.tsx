/* eslint-disable prettier/prettier */
import { proveedoresType } from "@renderer/types/proveedoresType";
import { CiSearch } from "react-icons/ci";
import { filtroType } from "../RegistrosPreciosProveedores";


type propsType = {
    tipoFruta: string[] | undefined
    proveedores: proveedoresType[] | undefined
    obtenerPrecios: () => void
    filtro: filtroType | undefined
    setFiltro: (e) => void

}

export default function FiltroRegistroPreciosProveedores(props: propsType): JSX.Element {
    const handleChange = (e): void => {
        const { value, name } = e.target

        props.setFiltro({
            ...props.filtro,
            [name]: value,
        });
    };
    const handleObtenerData = (): void => {
        props.obtenerPrecios()
    }
    return (
        <div className="filtro_proveedores-div">
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
                        value={
                            props.filtro?.fechaFin
                                ? props.filtro.fechaFin.substring(0, 10)
                                : ''
                        }
                    />
                </div>
            </div>
            <div>
                <label className="tool-select-label">
                    Tipo fruta:
                </label>
                <select
                    name="tipoFruta"
                    className="tool-select"
                    onChange={handleChange}
                    value={props.filtro?.tipoFruta ?? ''}
                >
                    <option value=""></option>
                    {props.tipoFruta &&
                        props.tipoFruta.map(item =>
                            <option key={item} value={item}>{item}</option>
                        )}

                </select>
            </div>
            <div>
                <label className="tool-select-label">
                    Predio:
                </label>
                <select
                    name="proveedor"
                    className="tool-select"
                    onChange={handleChange}
                    value={props.filtro?.proveedor ?? ''}
                >
                    <option value=""></option>
                    {props.proveedores && props.proveedores.map(item =>
                        <option key={item._id} value={item._id}>{item.PREDIO}</option>
                    )}

                </select>
            </div>
            <button
                onClick={handleObtenerData}
                className="add-record"
            >
                Buscar
                <CiSearch />
            </button>
        </div>
    )
}