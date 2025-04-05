/* eslint-disable prettier/prettier */

import { proveedoresType } from "@renderer/types/proveedoresType"
import { useEffect, useState } from "react"
import useAppContext from "@renderer/hooks/useAppContext"
import { listaProveedortype } from "../PrediccionesExportacion"
import ProveedorComponente from "./ProveedorComponente"

type propsType = {
    proveedores: proveedoresType[] | undefined
    setProveedoresLista: (e) => void
    proveedoresLista: listaProveedortype[]
}

export default function ListaProveedores(props: propsType): JSX.Element {
    const { messageModal } = useAppContext();
    const [tipoFruta, setTipoFruta] = useState<string[]>([])
    const [proveedorSelect, setProveedorSelect] = useState<string>()
    const [kilos, setKilos] = useState<string>()
    const [tipoFrutaSelect, setTipoFrutaSelect] = useState<string>()

    useEffect(() => {
        obtenerFruta()
    }, [])

    const obtenerFruta = async (): Promise<void> => {
        try {
            const response = await window.api.obtenerFruta()
            setTipoFruta(response)
        } catch (err) {
            if (err instanceof Error)
                messageModal("error", `Error obteniendo fruta ${err.message}`)
        }
    }
    const addProveedor = (): void => {
        if (!proveedorSelect && !kilos && !tipoFrutaSelect) return
        if (!props.proveedores) return
        const prov = props.proveedores.find(prov => prov._id === proveedorSelect)
        if (!prov) return
        props.setProveedoresLista((prev) => {
            return [...prev, {
                _id: prov._id,
                predio: prov.PREDIO,
                codigo: prov["CODIGO INTERNO"],
                kilos: kilos,
                tipoFruta: tipoFrutaSelect
            }]
        })
    }
    const deleteProveedor = (_id):void => {
        const newArr = props.proveedoresLista.filter(item => item._id !== _id)
        props.setProveedoresLista(newArr)
    }

    return (
        <>
            <div className='filtroContainer'>
                <div className='div-filter-actions'>
                    <label>Proveedores</label>
                    <select onChange={(e): void => setProveedorSelect(e.target.value)}>
                        <option value=""></option>
                        {props.proveedores && props.proveedores.map(item => (
                            <option value={item._id} key={item._id}>
                                {item["CODIGO INTERNO"]} - {item.PREDIO}
                            </option>
                        ))}
                    </select>
                    <label>Kilos</label>
                    <input type="text" onChange={(e): void => setKilos(e.target.value)} />

                    <label>Tipo de fruta</label>
                    <select onChange={(e): void => setTipoFrutaSelect(e.target.value)}>
                        <option value=""></option>
                        {tipoFruta && tipoFruta.map(item => (
                            <option value={item} key={item}>
                                {item}
                            </option>
                        ))}
                    </select>

                    <button onClick={addProveedor}>Add</button>
                </div>
            </div>
            <div className="comercial-precios-proveedores-lista" >
                {props.proveedoresLista.map(proveedor => (
                    <ProveedorComponente
                        key={proveedor._id}
                        proveedor={proveedor}
                        deleteProveedor={deleteProveedor}
                    />
                ))}
            </div>
        </>
    )
}