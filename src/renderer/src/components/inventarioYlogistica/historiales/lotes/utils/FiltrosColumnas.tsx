/* eslint-disable prettier/prettier */
import { filtroColumnasType } from "../type/types";
import { KEYS_FILTROS_COL } from "../functions/constantes";
import { useEffect } from "react";

type propsType = {
    columnVisibility: filtroColumnasType
    handleChange: (e) => void
}

export default function FiltrosColumnas(props:propsType): JSX.Element {
    
    useEffect(() => {
        console.log("render componente ",props.columnVisibility)
        console.log("############",KEYS_FILTROS_COL)
    }, [])
    return (
        <div className="lotes-filtros-columnas-div">
            {Object.keys(props.columnVisibility).map(item => (
                <label key={item} className="lotes-filtros-columnas-label">
                    <input 
                        type="checkbox" 
                        value={item} 
                        onClick={props.handleChange} 
                        checked={props.columnVisibility[item]} 
                    />
                    <p>{KEYS_FILTROS_COL[item]}</p>
                </label>
            ))}
        </div>
    )
}
