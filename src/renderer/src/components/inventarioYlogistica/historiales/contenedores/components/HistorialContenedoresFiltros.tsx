/* eslint-disable prettier/prettier */
import useAppContext from "@renderer/hooks/useAppContext";
import { clienteType } from "@renderer/types/clientesType";
import { useEffect, useState } from "react";
import { IoAddCircleSharp } from "react-icons/io5";

type propsType = {
    handlebuscar: (
        numeroContenedor: string[],
        fechainicio:string | undefined,
        fechaFin:string | undefined,
        clientes: string[],
        tipoFruta:string
    ) => void;
}

export default function HistorialContenedoresFiltros(props:propsType): JSX.Element {
    const { messageModal } = useAppContext();
    const [inputNumeroContenedor, setInputNumeroContenedor] = useState<string>()
    const [arrContenedores, setArrContenedores] = useState<string[]>([]);
    const [fechaInicio, setFechaInicio] = useState<string>();
    const [fechaFin, setFechaFin] = useState<string>();
    const [clientes, setClientes] = useState<clienteType[]>();
    const [clientesCheck, setClientesCheck] = useState<string[]>([]);
    const [tipoFruta, settipoFruta] = useState<string>("");
    useEffect(() => {
        obtenerClientes()
    }, [])
    const addNumeroContenedor = (): void => {
        if (inputNumeroContenedor !== undefined)
            setArrContenedores([...arrContenedores, inputNumeroContenedor])
    }
    const eliminarNumeroContenedor = (cont: string): void => {
        setArrContenedores(prev => {
            const newArr = prev.filter(item => !(item === cont))
            return newArr
        })
    }
    const handleClientesCheck = (e): void => {
        setClientesCheck([...clientesCheck, e])
    }
    const handleEliminarClientesCheck = (cliente:string): void => {
        setClientesCheck(prev => {
            const newArr = prev.filter(item => !(item === cliente))
            return newArr
        })
    }
    const handleBuscar = ():void => {
        props.handlebuscar(
            arrContenedores,
            fechaInicio,
            fechaFin,
            clientesCheck,
            tipoFruta
        )
    }
    const obtenerClientes = async (): Promise<void> => {
        try {
            const request = { action: "obtener_clientes_historial_contenedores" }
            const response = await window.api.server2(request);
            if (response.status !== 200)
                throw new Error(`Code ${response.status}: ${response.message}`);
            setClientes(response.data)
        } catch (err) {
            if (err instanceof Error) {
                messageModal("error", err.message)
            }
        }
    }
    return (
        <section className="historial-contenedores-filtros-container">
            <div className="historial-contenedores-filtros-seccion">
                <h3>Busqueda por numero de contenedor</h3>
                <hr />
                <div className="busqueda-contenedor">
                    <div className="busqueda-contenedor-div1">
                        <input
                            onChange={(e): void => setInputNumeroContenedor(e.target.value)}
                            className="defaultSelect"
                            type="text" />
                        <button onClick={addNumeroContenedor} className="defaulButtonAgree">
                            <IoAddCircleSharp />
                        </button>
                    </div>
                    <div className="busqueda-contenedor-div3">
                        {arrContenedores.map(cont => (
                            <button
                                onClick={(): void => eliminarNumeroContenedor(cont)}
                                key={cont} className="defaultSelect"
                            >
                                {cont}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
            <div className="historial-contenedores-filtros-seccion">
                <h3>Busqueda por fecha</h3>
                <hr />
                <div className="busqueda-contenedor">
                    <div className="busqueda-contenedor-div1">
                        <label>
                            Fecha Inicio
                            <input onChange={(e): void => setFechaInicio(e.target.value)} type="date" className="defaultSelect" />
                        </label>
                    </div>
                    <div className="busqueda-contenedor-div1">
                        <label>
                            Fecha Fin
                            <input onChange={(e): void => setFechaFin(e.target.value)} type="date" className="defaultSelect" />
                        </label>
                    </div>
                </div>
            </div>
            <div className="historial-contenedores-filtros-seccion">
                <h3>Busqueda por cliente</h3>
                <hr />
                <div className="busqueda-contenedor">
                    <div className="busqueda-contenedor-div1">
                        <select multiple onChange={(e): void => handleClientesCheck(e.target.value)}>
                            {clientes && clientes.map(item => (
                                <option value={item._id} key={item._id}>
                                    {item.CLIENTE}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="busqueda-contenedor-div2">
                        {clientes && clientesCheck.map(cont => (
                            <button
                                onClick={(): void => handleEliminarClientesCheck(cont)}
                                key={cont} className="defaultSelect"
                            >
                                {clientes.find(cliente => cliente._id === cont)?.CLIENTE}
                            </button>
                        ))}
                    </div>
                </div>

            </div>
            <div className="historial-contenedores-filtros-seccion">
                <h3>Tipo de fruta</h3>
                <hr />
                <select className="defaultSelect" onChange={(e):void => settipoFruta(e.target.value)}>
                    <option value=""></option>
                    <option value="Naranja">Naranja</option>
                    <option value="Limon">Limon</option>
                    <option value="Mixto">Mixto</option>
                </select>
            </div>

            <div className="div-botonoes-busqueda">
                <button onClick={handleBuscar} className="defaulButtonAgree">Buscar</button>
            </div>
        </section>
    )
}
