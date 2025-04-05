/* eslint-disable prettier/prettier */

import { proveedoresType } from "@renderer/types/proveedoresType"
import ProveedorComponente from "./ProveedorComponente"
import { useEffect, useState } from "react"
import useAppContext from "@renderer/hooks/useAppContext"

type propsType = {
    proveedores: proveedoresType[] | undefined
    setProveedores: (e) => void
    tipoFruta: string[] | undefined
    setSelectedProveedores: (proveedor) => void
    selectedProveedores: proveedoresType[] | undefined
}

type filtroType = {
    tipoFruta: string
    predio: string
}

export default function ListaProveedores(props: propsType): JSX.Element {
    const { messageModal, setLoading } = useAppContext();
    const [filtro, setFiltro] = useState<filtroType>({
        tipoFruta: '',
        predio: ''
    })
    const [data, setData] = useState<proveedoresType[]>()

    useEffect(() => {
        if (props.proveedores) {
            setData(props.proveedores)
        }
    }, [props.proveedores])

    useEffect(() => {
        if (props.proveedores) {
            let new_data = props.proveedores

            if (filtro.tipoFruta !== '') {
                new_data = new_data.filter(proveedor => (
                    proveedor.tipo_fruta && Object.keys(proveedor.tipo_fruta).length > 0 ?
                        Object.keys(proveedor.tipo_fruta).some(
                            fruta => String(fruta).toLowerCase().includes(filtro.tipoFruta.toLowerCase())
                        )
                        : false
                ))
            }
            if (filtro.predio !== '') {
                new_data = new_data.filter(proveedor => (
                    proveedor.PREDIO.toLowerCase().includes(filtro.predio.toLowerCase())
                ))
            }
            setData(new_data)

        }
    }, [filtro])

    const handleChange = (event): void => {
        const { name, value } = event.target;
        setFiltro((prev) => {
            return { ...prev, [name]: value }
        });
    };

    const precioFijo = async (): Promise<void> => {
        try{
            setLoading(true)
            if(!props.selectedProveedores) throw new Error("Seleccione un proveedor")
            if(!props.proveedores) throw new Error("No hay proveedores")
            const request = {
                action: "put_comercial_precios_proveedores_precioFijo",
                data:props.selectedProveedores.map(item => item._id)
            }
            const response = await window.api.server2(request)
            if(response.status !== 200)
                throw new Error(`Code ${response.status}: ${response.message}`)
            messageModal("success", "Modificado con exito")

            const newProveedores = props.proveedores.map(prov => {
                if(props.selectedProveedores?.findIndex(item => item._id === prov._id) !== -1){
                    prov.precioFijo = !prov.precioFijo
                    return prov
                } else {
                    return prov
                } 
            })
            props.setProveedores([...newProveedores])
        } catch(err){
            if(err instanceof Error){
                messageModal("error", err.message)
            }
        } finally {
            setLoading(false)
        }
    }

    const handleCheckAll = (): void => {
        if(data){
            const dataFilter = data.filter(item => !item.precioFijo)
            props.setSelectedProveedores(dataFilter)
        }
    }

    return (
        <>
            <div className="filtro_proveedores-div">
                <div>
                    <label className="search-label">
                        Predio:
                    </label>
                    <div className="search-container">
                        <input
                            value={filtro.predio}
                            onChange={handleChange}
                            type="text"
                            name="predio"
                            className="search-input"
                        />
                    </div>
                </div>
                <div>
                    <label className="tool-select-label" >
                        Tipo de fruta:
                    </label>
                    <select
                        data-testid="conercial-precios-proveedores-select-tipo-fruta"
                        value={filtro.tipoFruta}
                        onChange={handleChange}
                        name="tipoFruta"
                        className="tool-select">
                        <option value=""></option>
                        {props.tipoFruta && props.tipoFruta.map(fruta =>
                            <option value={fruta} key={fruta}>{fruta}</option>
                        )}
                    </select>
                </div>
                <button
                    onClick={precioFijo}
                    className="add-record">
                    Precio fijo
                </button>
                <button
                    onClick={handleCheckAll}
                    className="add-record">
                    Seleccionar todo
                </button>
            </div>

            {props.proveedores === undefined ?

                <div>Cargando...</div>
                :
                <div className="comercial-precios-proveedores-lista" >
                    {data && data.map(proveedor => (
                        <ProveedorComponente
                            selectedProveedores={props.selectedProveedores}
                            setSelectedProveedores={props.setSelectedProveedores}
                            proveedor={proveedor}
                            key={proveedor._id} />
                    ))}
                </div>
            }
        </>
    )
}