/* eslint-disable prettier/prettier */

import { clienteType } from "@renderer/types/clientesType";
import { useState } from "react";
import ClientesComponent from "./ClientesComponent";

type propsType = {
    clientes: clienteType[] | undefined
    setSelectedClientes: (cliente) => void
    selectedClientes: string[]
}

export default function ListaClientes(props: propsType): JSX.Element {
    const [clienteSelect, setClienteSelect] = useState<string>()
    const [listaClientesSelect, setListaClientesSelect] = useState<clienteType[]>([])

    const addCliente = (): void => {
        if (!clienteSelect) return
        if (!props.clientes) return
        const arr = [...props.selectedClientes]
        arr.push(clienteSelect)
        props.setSelectedClientes(arr)
        const cliente = props.clientes.find(cliente => cliente._id === clienteSelect)
        if (cliente) {
            setListaClientesSelect((prev) => {
                return [...prev, cliente]
            })
        }
    }

    const deleteCliente = (_id): void => {
        const newArr = listaClientesSelect.filter(item => item._id !== _id)
        setListaClientesSelect(newArr)
        const newArrSelect = props.selectedClientes.filter(item => item !== _id)
        props.setSelectedClientes(newArrSelect)
    }
    return (
        <>
            <div className='filtroContainer'>
                <div className='div-filter-actions'>
                    <label>Cliente</label>
                    <select onChange={(e): void => setClienteSelect(e.target.value)}>
                        <option value=""></option>
                        {props.clientes && props.clientes.map(item => (
                            <option value={item._id} key={item._id}>
                                {item.CODIGO} - {item.CLIENTE}
                            </option>
                        ))}
                    </select>

                    <button onClick={addCliente}>Add</button>
                </div>
            </div>
            <div className="comercial-precios-proveedores-lista" >
                {listaClientesSelect.map(cliente => (
                    <ClientesComponent
                        key={cliente._id}
                        cliente={cliente}
                        deleteCliente={deleteCliente}
                    />
                ))}
            </div>
        </>
    )
}
