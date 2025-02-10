/* eslint-disable prettier/prettier */
import useAppContext from "@renderer/hooks/useAppContext";
import { AiFillFileAdd } from "react-icons/ai";
import { CiSearch } from "react-icons/ci";
import { filtroType } from "../Proveedores";


type propsType = {
    obtenerRegistros: (e) => Promise<void>
    numeroRegistros: (e) => Promise<void>
    setFiltro: (e) => void
    filtro: filtroType | undefined
}

export default function FiltrosProveedores(props:propsType): JSX.Element {
    const { messageModal } = useAppContext();
    const handleAddProveedor = (): void => {
        const dialogINfo = document.getElementById("ingresar_proveedor_modal") as HTMLDialogElement;
        if (dialogINfo) {
            dialogINfo.showModal();
        }
    }
    const handleSispap = (e): void => {
        props.setFiltro(prev => {
            if (prev) {
                return {
                    ...prev,
                    SISPAP: e.target.value === 'activo' ? true : false
                }
            } else {
                return {
                    SISPAP: e.target.value === 'activo' ? true : false
                }
            }
        })
    }
    const handleChange = (e): void => {
        const {value, name} = e.target

        props.setFiltro({
            ...props.filtro,
            [name]: value,
        });
    };
    const handleBuscar = async (): Promise<void> => {
        try {
            await props.numeroRegistros(props.filtro)
            await props.obtenerRegistros(props.filtro)
        } catch(err){
            if(err instanceof Error){
                messageModal("error", err.message)
            }
        }
    }

    return (
        <div className="filtros-add-proveedores-container">
            <div>
                <button 
                    onClick={handleAddProveedor} 
                    data-testid="comercial-proveedores-button-add-proveedor"
                    className="add-record">
                    Agregar Proveedor
                    <AiFillFileAdd />
                </button>
            </div>
            <hr />
            <div className="filtro_proveedores-div">
                <div>
                    <label className="tool-select-label">
                        SISPAP:
                    </label>
                    <select
                        value={props.filtro?.SISPAP ? "activo" : "inactivo"}
                        className="tool-select"
                        data-testid="comercial-proveedores-input-SISPAP"
                        onChange={handleSispap}>
                        <option value="activo">Activo</option>
                        <option value="inactivo">Inactivo</option>
                    </select>
                </div>
                <div>
                    <label  className="search-label">
                        PREDIO:
                    </label>
                    <div className="search-container">
                        <input
                            value={props.filtro?.PREDIO ?? ''}
                            type="text"
                            name="PREDIO"
                            onChange={handleChange}
                            className="search-input"
                            placeholder="Busca aquí..."
                            data-testid="comercial-proveedores-input-predio"
                        />
                    </div>
                </div>
                <div>
                    <label className="search-label">
                        GGN:
                    </label>
                    <div className="search-container">
                        <input
                            value={props.filtro?.["GGN.code"] ?? ''}
                            name="GGN.code"
                            onChange={handleChange}
                            type="text"
                            className="search-input"
                            placeholder="Busca aquí..."
                            data-testid="comercial-proveedores-input-ggn"

                        />
                    </div>
                </div>
                <button 
                    data-testid="comercial-proveedores-button-buscar"
                    className="add-record" 
                    onClick={handleBuscar}>
                    Buscar
                    <CiSearch />
                </button>
            </div>
        </div>

    )
}