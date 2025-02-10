/* eslint-disable prettier/prettier */
import { useEffect, useState } from "react";
import TableListaClientes from "./tables/TableListaClientes";
import { clienteType } from "@renderer/types/clientesType";
import useAppContext from "@renderer/hooks/useAppContext";
import FormatoAgregarCliente from "./components/FormatoAgregarCliente";


export default function Clientes(): JSX.Element {
    const { messageModal } = useAppContext()
    const [data, setData] = useState<clienteType[]>([])
    const [filtro, setFiltro] = useState<string>('')
    const [dataOriginal, setDataOriginal] = useState<clienteType[]>([])
    const [opciones, setOpciones] = useState<string>('inicio')
    const [modificar, setModificar] = useState<boolean>(false)
    const [cliente, setCliente] = useState<clienteType>()
    useEffect(() => {
        obtenerClientes()
        window.api.reload(() => {
            obtenerClientes()
        });
        return () => {
            window.api.removeReload()
        }
    }, [])
    useEffect(() => {
        if (filtro !== '') {
            const dataFilter = dataOriginal.filter(
                item => item.CLIENTE?.toLowerCase().startsWith(filtro.toLowerCase()))
            setData(dataFilter)
        } else {
            setData(dataOriginal)
        }
    }, [filtro])
    const obtenerClientes = async (): Promise<void> => {
        try {
            const request = {
                action: 'get_clientes',
            };
            const response = await window.api.server2(request);
            if (response.status !== 200)
                throw new Error(response.message)
            setData(response.data)
            setDataOriginal(response.data)
        } catch (e) {
            if (e instanceof Error)
                messageModal("error", e.message)
        }
    }
 
    const handleChange = (): void => {
        if (opciones === "inicio") {
            setOpciones("agregar")
            setModificar(false)
        }
        else if (opciones === "agregar")
            setOpciones("inicio")
    }
    const handleModificar = (clienteInfo): void => {
        setOpciones("agregar")
        setModificar(true)
        setCliente(clienteInfo)
    }
    return (

        <div className="componentContainer">
            <div className="navBar"></div>
            <h2>Clientes</h2>
            <hr />
            <div className='filtroContainer'>
                <div className='div-filter-actions'>
                    <button onClick={handleChange}>
                        Agregar Cliente
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" ><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12 3c7.2 0 9 1.8 9 9s-1.8 9 -9 9s-9 -1.8 -9 -9s1.8 -9 9 -9z" /><path d="M15 12h-6" /><path d="M12 9v6" /></svg>
                    </button>
                    <input type="text" value={filtro} placeholder='Buscar...' onChange={(e): void => setFiltro(e.target.value)} />
                </div>
            </div>
            <div>
                {opciones === "inicio" &&
                    <TableListaClientes
                        obtenerClientes={obtenerClientes}
                        handleModificar={handleModificar}
                        clientes={data}
                    />}
                {opciones === "agregar" &&
                    <FormatoAgregarCliente
                        obtenerClientes={obtenerClientes}
                        cliente={cliente}
                        handleChange={handleChange}
                        modificar={modificar}
                    />
                }
            </div>
        </div>
    )
}
