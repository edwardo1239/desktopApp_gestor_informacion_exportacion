/* eslint-disable prettier/prettier */
import { lotesType } from "@renderer/types/lotesType"
import "../css/prediosEnInventario.css"
import PredioCard from "../utils/PredioCard"
import BuscadorListaPredios from "../utils/BuscadorListaPredios"
import { useEffect, useState } from "react"

type propsType = {
    lotes: lotesType[]
    lotesOriginal: lotesType[]
    handleAddOrdenVaceo: (_id) => void
    setLotes: (e) => void
}

export default function PrediosEnInventario(props:propsType):JSX.Element {
    const [filtro, setFiltro] = useState<string>('');
    const [filtroSelect, setFiltroSelect] = useState<string>('');

    useEffect(() => {
        let data = props.lotesOriginal.filter(item => item.predio?.PREDIO?.toLocaleLowerCase().startsWith(filtro));
        if(filtroSelect !== "")
            data = data.filter(item => item.tipoFruta === filtroSelect);
        props.setLotes(data);
    }, [filtro, filtroSelect, props.lotes, props.lotesOriginal])

    const handleFiltro = (e): void => {
        const data = e.target.value
        setFiltro(String(data).toLowerCase())
    }
    
  return (
    <div className="predios-en-inventario-container">
        <h3>Lista de Predios</h3>
        <BuscadorListaPredios handleFiltro={handleFiltro} setFiltroSelect={setFiltroSelect}/>
        {props.lotes.map(lote => (
            <div key={lote._id} className="predios-en-inventario-card-div">
                <PredioCard lote={lote} handleAddOrdenVaceo={props.handleAddOrdenVaceo}/>
            </div>
        ))}
    </div>
  )
}
