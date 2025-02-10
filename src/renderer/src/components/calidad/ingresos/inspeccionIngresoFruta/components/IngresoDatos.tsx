/* eslint-disable prettier/prettier */
import { useState } from "react";
import { elementoDefectoType } from "../types/clasificacionTypes";

type propsType = {
    setDataArray: React.Dispatch<React.SetStateAction<elementoDefectoType[]>>
    dataFormulario: Record<string, {name:string}> | undefined
}

export default function IngresoDatos(props: propsType): JSX.Element {
    const [defecto, setDefecto] = useState<string>('');
    const [lavado, setLavado] = useState<string>('');
    const handleAgregar = (): void => {
        const newElement = {
            defecto: defecto,
            lavado: Number(lavado),
        }
        props.setDataArray(prev => {
            const newArray = [...prev];
            newArray.push(newElement);
            return newArray;
        })
        setLavado('')
    }
    if (!props.dataFormulario) {
        return (
            <div className="container-add-defecto">
            <select placeholder="Defecto" onChange={(e): void => setDefecto(e.target.value)} className="defaultSelect">
                <option value={''}>Cargando datos...</option>
            </select>
            <input className="defaultSelect" type="number" placeholder="Unidades" onChange={(e): void => setLavado(e.target.value)} value={lavado} />
            <button onClick={handleAgregar} className="defaulButtonAgree">Agregar</button>
        </div>
        )
    }
    return (
        <div className="container-add-defecto">
            <select placeholder="Defecto" onChange={(e): void => setDefecto(e.target.value)} className="defaultSelect">
                <option value={''}></option>
                {Object.keys(props.dataFormulario).map(key => (
                    <option key={key} value={key}>{
                        props.dataFormulario && props.dataFormulario[key as string].name}
                    </option>
                ))}
            </select>
            <input className="defaultSelect" type="number" placeholder="Unidades" onChange={(e): void => setLavado(e.target.value)} value={lavado} />
            <button onClick={handleAgregar} className="defaulButtonAgree">Agregar</button>
        </div>
    )
}
