/* eslint-disable prettier/prettier */

import { useState } from "react"

type propsType = {
    handleChangeDescarte: (event) => void
    itemsClasifiacionDescarte: { [key: string]: string } | undefined
    clasificacionDescarte: { [key: string]: string } | undefined
    setClasificacionDescarte: (e) => void

}

export default function ClasificacionDescarte(props: propsType): JSX.Element {
    const [itemSeleccionado, setItemSeleccionado] = useState<string>()
    const [porcentage, setporcentage] = useState<string>('')

    const eliminarItem = (key): void => {
        console.log(props.clasificacionDescarte)
        const newObject = JSON.parse(JSON.stringify(props.clasificacionDescarte))
        delete newObject[key]
        props.setClasificacionDescarte(newObject)
    }
    return (
        <div className="info-general">
            <label>
                <p>Tipo descarte</p>
                <select onChange={(e): void => setItemSeleccionado(e.target.value)}>
                    <option value=""></option>
                    {props.itemsClasifiacionDescarte &&
                        Object.entries(props.itemsClasifiacionDescarte).map(([key, value]) => (
                            <option value={key} key={key}>
                                {value as string}
                            </option>
                        ))
                    }
                </select>
            </label>
            <div>
                <label>
                    <p>porcentage</p>
                    <input type="text" onChange={(e): void => setporcentage(e.target.value)} />
                </label>
            </div>

            <button
                className="button-add"
                onClick={(): void =>
                    props.handleChangeDescarte({ name: itemSeleccionado, value: porcentage })}>
                Añadir
            </button>

            <div>
                {props.clasificacionDescarte &&
                    Object.entries(props.clasificacionDescarte).map(([key, value]) => (
                        <button 
                            onClick={():void => eliminarItem(key)}
                            key={key} className="button-item-descarte">
                            <p >{props.itemsClasifiacionDescarte && props.itemsClasifiacionDescarte[key]}</p>
                            <p >{value}</p>
                        </button>
                    ))
                }
            </div>
        </div>
    )
}