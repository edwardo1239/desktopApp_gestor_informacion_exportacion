/* eslint-disable prettier/prettier */

import { useEffect, useState } from "react"
import { elementoDefectoType, elementoPorcentajeType } from "../types/clasificacionTypes"
import { dataDefectos } from "../functions/data"

type propsType = {
    dataArray: elementoDefectoType[]
    eliminarItem: (index:number) => void
}
export default function ShowData(props: propsType): JSX.Element {
    const [data, setData] = useState<elementoPorcentajeType[]>([])
    useEffect(() => {
        const total = props.dataArray.reduce((acu, item) => acu += item.lavado + item.encerado, 0);
        if (total === 0) {
            setData([])
            return;
        }
        const porcentages: elementoPorcentajeType[] = props.dataArray.map(item => {
            const totalDefecto = item.encerado + item.lavado;
            const porcentage = (totalDefecto * 100) / total;
            return { defecto: item.defecto, porcentage: porcentage }
        });
        setData(porcentages)
    }, [props.dataArray]);

    return (
        <div className="container-clasificacion-calidad-show-info">
            {data.map((item, index) => (
                <div key={index} className="container-clasificacion-calidad-show-info-item">
                    <div className="container-clasificacion-calidad-show-info-item-defecto">
                        <p>{dataDefectos[item.defecto]}</p>
                        <p>{item.porcentage.toFixed(2)}%</p>
                    </div>
                    <button onClick={():void => props.eliminarItem(index)}>
                    <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor" ><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" /><path d="M18.364 5.636l-12.728 12.728" /></svg>
                    </button>
                </div>
            ))}
        </div>
    )
}