/* eslint-disable prettier/prettier */
import useAppContext from "@renderer/hooks/useAppContext";
import { contenedoresType } from "@renderer/types/contenedoresType"
import { insumosType } from "@renderer/types/insumos";
import { useEffect, useState } from "react"
import TablaInsumosContenedor from "./components/TablaInsumosContenedor";

export default function IngresoInsumoContenedor(): JSX.Element {
    const { messageModal } = useAppContext();
    const [contenedores, setContenedores] = useState<contenedoresType[]>();
    const [insumos, setInsumos] = useState<insumosType[]>()
    const [insumo, setInsumo] = useState<insumosType>()
    const [contenedor, setContenedor] = useState<contenedoresType>()
    const [insumosCont, setInsumosCont] = useState<insumosType[]>()
    const [cantidad, setCantidad] = useState<string>('');

    useEffect(() => {
        if (insumos !== undefined && contenedor !== undefined) {
            const idsInsumos = Object.keys(contenedor.insumosData);
            const arrInsumos = insumos.filter(insumo => idsInsumos.includes(insumo._id));
            setInsumosCont(arrInsumos)
        }
    }, [contenedor])
    useEffect(()=>{
        const _id = localStorage.getItem("inventario-lista-insumos-contenedor")
        if (_id && contenedores !== undefined) {
            const contenedorSeleccionado = contenedores?.find(item => item._id === _id);
            setContenedor(contenedorSeleccionado)
            console.log(contenedorSeleccionado)

            localStorage.removeItem("inventario-lista-insumos-contenedor")
        }
    },[contenedores])
    useEffect(() => {
        obtenerContenedores()
        obtenerInsumos()
    }, [])
    const obtenerContenedores = async (): Promise<void> => {
        try {
            const request = { action: "get_inventarios_insumos_contenedores" }
            const response = await window.api.server2(request)
            if (response.status !== 200)
                throw new Error(`Code ${response.status}: ${response.message}`);
            setContenedores(response.data)
        } catch (err) {
            if (err instanceof Error) {
                messageModal("error", err.message)
            }
        }
    }
    const obtenerInsumos = async (): Promise<void> => {
        try {
            const request = { action: "get_inventarios_insumos" }
            const response = await window.api.server2(request)
            if (response.status !== 200)
                throw new Error(`Code ${response.status}: ${response.message}`)
            response.data.sort((a: insumosType, b: insumosType) => a.insumo.localeCompare(b.insumo));
            setInsumos(response.data)
        } catch (err) {
            if (err instanceof Error) {
                messageModal("error", err.message)
            }
        }
    }
    const handleContenedor = (e): void => {
        const id = e.target.value;
        const contenedorSeleccionado = contenedores?.find(item => item._id === id);
        setContenedor(contenedorSeleccionado)
    }
    const handleChooseInsumo = (e): void => {
        const id = e.target.value;
        const insumoSelect = insumos?.find(item => item._id === id)
        setInsumo(insumoSelect);
    }
    const handleAddItem = (): void => {
        if (contenedor === undefined) return messageModal("error", "Seleccione un contenedor")
        if (insumo === undefined) return messageModal("error", "Error: Seleccione un insumo")
        if (cantidad === '') return messageModal("error", "Ingrese la cantidad")
        if (insumo !== undefined) {
            setInsumosCont(prev => {
                if (prev !== undefined) {
                    return [...prev, insumo];
                } else {
                    return [insumo];
                }
            });
            setContenedor(() => {
                if (Object.prototype.hasOwnProperty.call(contenedor?.insumosData, insumo._id)) {
                    return {
                        ...contenedor,
                        insumosData: {
                            ...contenedor.insumosData,
                            [insumo._id]: Number(cantidad) + contenedor.insumosData[insumo._id],
                        }
                    }
                } else {
                    return {
                        ...contenedor,
                        insumosData: {
                            ...contenedor.insumosData,
                            [insumo._id]: Number(cantidad)
                        }
                    }
                }
            })
        }
    }
    const handleGuardar = async (): Promise<void> => {
        try {
            const info = {
                ...contenedor?.insumosData,
                flagInsumos: true
            }
            const request = {
                _id: contenedor?._id,
                action: "put_inventarios_insumos_contenedores",
                data: info
            }
            const response = await window.api.server2(request);
            if (response.status !== 200)
                throw new Error(`Code ${response.status}: ${response.message}`)
            messageModal("success", "Guardado con exito")
            obtenerContenedores()
        } catch (err) {
            if (err instanceof Error) {
                messageModal("error", err.message)
            }
        }
    }
    return (
        <div className="componentContainer">
            <div className="componentContainer">
                <div className="navBar"></div>
                <h2>Ingreso Insumo Contenedor</h2>
                <hr />
                <div className='filtroContainer' >
                    <select onChange={handleContenedor}>
                        <option value="">Contenedores</option>
                        {contenedores && contenedores.map(item => (
                            <option value={item._id} key={item._id}>
                                {item.numeroContenedor + " - " +
                                    (typeof item.infoContenedor.clienteInfo !== 'string'
                                        ? item.infoContenedor.clienteInfo.CLIENTE
                                        : 'Información no disponible')}
                            </option>
                        ))}
                    </select>
                    <select onChange={handleChooseInsumo} value={insumo?._id}>
                        <option value="">Insumo</option>
                        {insumos && insumos.map(item => (
                            <option value={item._id} key={item._id}>
                                {item.insumo}
                            </option>
                        ))}
                    </select>
                    <input type="text" onChange={(e): void => setCantidad(e.target.value)} />
                    <p>{insumo ? insumo.medida : ''}</p>

                    <button onClick={handleAddItem} style={{ marginLeft: "auto" }}>Agregar</button>
                    <button onClick={handleGuardar}>Guardar</button>

                </div>
            </div>
            <hr />
            <h2>{contenedor && contenedor.numeroContenedor}</h2>
            <TablaInsumosContenedor insumosCont={insumosCont} contenedor={contenedor} />
        </div>
    )
}
