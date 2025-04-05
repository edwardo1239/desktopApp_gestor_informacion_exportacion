/* eslint-disable prettier/prettier */

import { obtener_proveedores } from "@renderer/functions/SystemRequest";
import useAppContext from "@renderer/hooks/useAppContext";
import { inventarioCanastillasType } from "@renderer/types/inventarioCanastillas";
import { proveedoresType } from "@renderer/types/proveedoresType";
import { useEffect, useState } from "react"
import { PiNotePencilDuotone } from "react-icons/pi";
import { GiCancel } from "react-icons/gi";
import { IoSaveSharp } from "react-icons/io5";
import ConfirmacionModal from "@renderer/messages/ConfirmacionModal";

export default function InventarioCanastillas(): JSX.Element {
    const { messageModal, setLoading } = useAppContext();
    const [accion, setAccion] = useState<string>("")
    const [proveedores, setProveedores] = useState<proveedoresType[]>([]);
    const [proveedorOrigen, setProveedorOrigen] = useState<proveedoresType>()
    const [inventarioCanastillas, setInventarioCanastillas] = useState<inventarioCanastillasType>()
    const [modificandoCanastillas, setModificandoCanastillas] = useState<boolean>(false)
    const [modificarPrestadas, setModificarPrestadas] = useState<boolean>(false)

    const [canastillas, setCanastillas] = useState<number>()
    const [canastillasPrestadas, setCanastillasPrestadas] = useState<number>()
    const [destino, setDestino] = useState<string>();
    const [origen, setOrigen] = useState<string>();
    const [fecha, setFecha] = useState<string>();
    const [observaciones, setObservaciones] = useState<string>();
    const [canastillasInv, setCanastillasInv] = useState<number>()
    const [prestadasInv, setPrestadasInv] = useState<number>();

    //modal para confirmar
    const [confirm, setConfirm] = useState<boolean>(false)
    const [showConfirmation, setShowConfirmation] = useState<boolean>(false)
    const [message, setMessage] = useState<string>('')
    useEffect(() => {
        const fetchData = async (): Promise<void> => {
            try {
                setLoading(true)
                await obtenerProveedores();
                await obtenerInventarioCanastillas();
            } catch (err) {
                if (err instanceof Error)
                    messageModal("error", err.message)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    useEffect(() => {
        if (confirm) {
            modificarInventario()
            setConfirm(false)
        }
    }, [confirm]);

    const obtenerProveedores = async (): Promise<void> => {
        const response = await obtener_proveedores("activos")
        if (response instanceof Error) {
            throw response
        }
        setProveedores(response)
    }

    const obtenerInventarioCanastillas = async (): Promise<void> => {
        const request = {
            action: "get_inventarios_canastillas_canastillasCelifrut"
        }
        const response = await window.api.server2(request)
        if (response.status !== 200) {
            throw new Error(`Code ${response.status}: ${response.message}`)
        }
        setInventarioCanastillas(response.data)
    }

    const handleOrigen = (e): void => {
        setOrigen(e)
        const proveedor = proveedores.find(item => item.PREDIO === e)
        if (proveedor) setProveedorOrigen(proveedor)
    }

    const hanldeGuardar = async (): Promise<void> => {
        try {
            setLoading(true)
            const finalDestino = accion === "ingreso" ? "celifrut" : destino;
            const finalOrigen = accion === "salida" ? "celifrut" : origen;
            const canastillaFinal = canastillas === undefined ? 0 : canastillas
            const canastillaPrestadasFinal = canastillasPrestadas === undefined ? 0 : canastillasPrestadas

            const request = {
                action: "post_inventarios_canastillas_registro",
                data: {
                    destino: finalDestino,
                    origen: finalOrigen,
                    observaciones,
                    fecha,
                    canastillas: canastillaFinal,
                    canastillasPrestadas: canastillaPrestadasFinal,
                    accion
                }
            }
            const response = await window.api.server2(request)
            if (response.status !== 200)
                throw new Error(`Code ${response.status}: ${response.message}`)
            messageModal("success", "Canastillas movidas con exito")
            setDestino(undefined)
            setObservaciones(undefined)
            setOrigen(undefined)
            setFecha(undefined)
            setCanastillas(undefined)
        } catch (err) {
            if (err instanceof Error) {
                messageModal("error", err.message)
            }
        } finally {
            setLoading(false)
        }
    }

    const handleModificarInventario = (): void => {
        setMessage("¿Seguro desea modificar el inventario de canastillas?")
        setShowConfirmation(true)

    }

    const modificarInventario = async (): Promise<void> => {
        try{
            setLoading(true)
            const request:{
                action:string,
                canastillas?:number,
                canastillasPrestadas?:number
            } = {
                action:"put_inventarios_canastillas_celifrut"
            }
            if(modificandoCanastillas){
                request.canastillas = canastillasInv
            } else {
                request.canastillasPrestadas = prestadasInv
            }
            const response = await window.api.server2(request)
            if (response.status !== 200) {
                throw new Error(`Code ${response.status}: ${response.message}`)
            }
            messageModal("success", "Inventario actualizado con exito")
            setModificandoCanastillas(false)
            setModificarPrestadas(false)
        } catch (err) {
            if(err instanceof Error)
                messageModal("error", err.message)
        } finally {
            await obtenerInventarioCanastillas();
            setLoading(false)
        }
    }

    return (
        <div>
            <div className="navBar"></div>
            <h2>Inventario canastillas</h2>
            <hr />

            <div className='filtroContainer'>
                <div>
                    {modificandoCanastillas ?
                        <h3>
                            Canastillas:
                            <input type="text" onChange={(e): void => setCanastillasInv(Number(e.target.value))} value={canastillasInv ??
                                (inventarioCanastillas && inventarioCanastillas?.canastillas)} />
                        </h3>

                        :
                        <h3>
                            Canastillas: {inventarioCanastillas && inventarioCanastillas.canastillas}
                        </h3>
                    }
                    {modificandoCanastillas ?
                        <>
                            <div onClick={handleModificarInventario}>
                                <IoSaveSharp />
                            </div>
                            <div onClick={(): void => setModificandoCanastillas(!modificandoCanastillas)}>
                                <GiCancel />
                            </div>
                        </>
                        :
                        <div onClick={(): void => setModificandoCanastillas(!modificandoCanastillas)}>
                            <PiNotePencilDuotone />
                        </div>
                    }
                </div>

                <div>

                    {modificarPrestadas ?
                        <h3>
                            Canastillas prestadas:
                            <input type="text" onChange={(e): void => setPrestadasInv(Number(e.target.value))} value={prestadasInv ??
                                (inventarioCanastillas && inventarioCanastillas?.canastillasPrestadas)} />
                        </h3>

                        :
                        <h3>
                            Canastillas prestadas: {inventarioCanastillas && inventarioCanastillas.canastillasPrestadas}
                        </h3>
                    }
                    {modificarPrestadas ?
                        <>
                            <div onClick={handleModificarInventario}>
                                <IoSaveSharp />

                            </div>
                            <div onClick={(): void => setModificarPrestadas(!modificarPrestadas)}>
                                <GiCancel />
                            </div>
                        </>
                        :
                        <div onClick={(): void => setModificarPrestadas(!modificarPrestadas)}>
                            <PiNotePencilDuotone />
                        </div>
                    }

                </div>
            </div>
            <div>
                <div className='filtroContainer'>
                    <div className='div-filter-actions'>
                        <label>Tipo de Acción</label>
                        <select onChange={(e): void => setAccion(e.target.value)}>
                            <option value=""></option>
                            <option value="ingreso">Ingreso</option>
                            <option value="salida">Salida</option>
                            <option value="traslado">Traslado</option>
                        </select>
                    </div>
                </div>

                <div className='filtroContainer'>
                    <div className='div-filter-actions'>

                        <label>Cantidad</label>
                        <input
                            type="number"
                            placeholder="Numero canastillas"
                            onChange={(e): void => setCanastillas(Number(e.target.value))}
                            value={canastillas ?? ''}
                        />
                        <label>Cantidad Prestadas</label>
                        <input
                            type="number"
                            placeholder="Numero canastillas"
                            onChange={(e): void => setCanastillasPrestadas(Number(e.target.value))}
                            value={canastillasPrestadas ?? ''}
                        />
                        {(accion === 'traslado' || accion === 'ingreso') &&
                            <>
                                <label>Origen</label>
                                <input
                                    type="text"
                                    list="destino-canastillas-datalist"
                                    placeholder="Elige un destino"
                                    onChange={(e): void => handleOrigen(e.target.value)}
                                    value={origen ?? ''}
                                />
                                <datalist id="destino-canastillas-datalist">
                                    {proveedores && proveedores.map(proveedor => (
                                        <option key={proveedor._id + "inventario-canastillas"} value={proveedor.PREDIO} />
                                    ))}
                                </datalist>
                                <p>{(proveedores && proveedorOrigen &&
                                    proveedores.find(proveedor => proveedor._id === proveedorOrigen._id)) ?
                                    proveedorOrigen?.canastillas
                                    :
                                    ""
                                }</p>
                            </>
                        }
                        {(accion === 'traslado' || accion === 'salida') &&
                            <>
                                <label>Destino</label>
                                <input
                                    onChange={(e): void => setDestino(e.target.value)}
                                    value={destino ?? ''}
                                    type="text" list="destino-canastillas-datalist"
                                    placeholder="Elige un destino" />
                                <datalist id="destino-canastillas-datalist">
                                    {proveedores && proveedores.map(proveedor => (
                                        <option key={proveedor._id + "inventario-canastillas"} value={proveedor.PREDIO} />
                                    ))}
                                </datalist>
                            </>
                        }

                    </div>
                </div>


                <div className='filtroContainer'>
                    <div className='div-filter-actions'>
                        <label>Fecha</label>
                        <input type="date" onChange={(e): void => setFecha(e.target.value)} />
                    </div>
                </div>


                <div className='filtroContainer'>
                    <div className='div-filter-actions'>
                        <label>Observaciones</label>
                        <textarea value={observaciones ?? ''} onChange={(e): void => setObservaciones(e.target.value)} />
                    </div>
                </div>


                <div className='filtroContainer'>
                    <button onClick={hanldeGuardar}>Guardar</button>
                </div>
            </div>

            {showConfirmation &&
                <ConfirmacionModal
                    message={message}
                    setConfirmation={setConfirm}
                    setShowConfirmationModal={setShowConfirmation} />}

        </div>
    )
}
