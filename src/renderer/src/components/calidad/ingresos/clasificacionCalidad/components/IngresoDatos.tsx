/* eslint-disable prettier/prettier */
import { useEffect, useState } from "react";
// import { dataDefectos } from "../functions/data";
import { elementoDefectoType } from "../types/clasificacionTypes";
import useAppContext from "@renderer/hooks/useAppContext";

type propsType = {
    setDataArray: React.Dispatch<React.SetStateAction<elementoDefectoType[]>>
}

export default function IngresoDatos(props: propsType): JSX.Element {
    const { messageModal } = useAppContext();
    const [defecto, setDefecto] = useState<string>('');
    const [lavado, setLavado] = useState<string>('');
    const [encerado, setEncerado] = useState<string>('');
    const [dataDefectos, setDataDefectos] = useState<object>({})
    useEffect(()=>{
        obtenerDefectos()
    },[])
    const obtenerDefectos = async ():Promise<void> => {
        try{
            const request = {
                action:"get_constantes_sistema_clasificacion_descarte"
            }
            const response = await window.api.server2(request)
            if(response.status !== 200){
                throw new Error(`Code ${response.status}: ${response.message}`)
            }
            console.log(response.data)
            setDataDefectos(response.data)
        } catch (err){
            if(err instanceof Error){
                messageModal("error", err.message)
            }
        }
    }
    const handleAgregar = (): void => {
        const newElement = {
            defecto: defecto,
            lavado: Number(lavado),
            encerado: Number(encerado)
        }
        props.setDataArray(prev => {
            const newArray = [...prev];
            newArray.push(newElement);
            return newArray;
        })
        setLavado('')
        setEncerado('')
    }
    return (
        <div className="container-add-defecto">
            <select placeholder="Defecto" onChange={(e): void => setDefecto(e.target.value)} className="defaultSelect">
                <option value={''}>Defecto</option>
                {Object.keys(dataDefectos).map(key => (
                    <option key={key} value={key}>{dataDefectos[key]}</option>
                ))}
            </select>
            <input className="defaultSelect" type="number" placeholder="Lavado" onChange={(e): void => setLavado(e.target.value)} value={lavado} />
            <input className="defaultSelect" type="number" placeholder="Encerado" onChange={(e): void => setEncerado(e.target.value)} value={encerado} />
            <button  onClick={handleAgregar} className="defaulButtonAgree">Agregar</button>
        </div>
    )
}
