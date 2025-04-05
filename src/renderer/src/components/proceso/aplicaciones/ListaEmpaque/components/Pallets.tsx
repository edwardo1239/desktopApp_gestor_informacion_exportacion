/* eslint-disable prettier/prettier */

import { useContext, useEffect, useState } from "react"
import { contenedoresContext, contenedorSeleccionadoContext, loteselectedContext } from "../ProcesoListaEmpaque"
import { contenedoresType } from "@renderer/types/contenedoresType"
import { formatearFecha } from "@renderer/functions/fechas"
import { BiSolidMessageSquareAdd } from "react-icons/bi";
import useAppContext from "@renderer/hooks/useAppContext";
import { IoSaveSharp } from "react-icons/io5";
import { GiCancel } from "react-icons/gi";
import ConfirmacionModal from "@renderer/messages/ConfirmacionModal";
import BotonesSeleccionarItemTabla from "@renderer/components/UI/BotonesSeleccionarItemTabla";
import { RiDeleteBack2Fill } from "react-icons/ri";

const headers = [
    "Pallet",
    "Lote",
    "Predio",
    "Calidad",
    "T. Caja",
    "Calibre",
    "Cajas",
    "Fecha",
    "",
    ""

]

export default function Pallets(): JSX.Element {
    const { messageModal } = useAppContext();
    const contenedores = useContext(contenedoresContext)
    const contenedorSeleccionado = useContext(contenedorSeleccionadoContext)
    const loteSeleccionado = useContext(loteselectedContext)
    const [contenedor, setContenedor] = useState<contenedoresType>()
    const [isAdd, setIsAdd] = useState<number>(-1)

    const [indexItem, setIndexItem] = useState<number>(-1)
    const [index2Item, setIndex2Item] = useState<number>(-1)

    const [indexItemDel, setIndexItemDel] = useState<number>(-1)
    const [index2ItemDel, setIndex2ItemDel] = useState<number>(-1)

    const [calidad, setCalidad] = useState<string>()
    const [calibre, setCalibre] = useState<string>()
    const [tipoCaja, setTipoCaja] = useState<string>()
    const [cajas, setCajas] = useState<string>()

    const [showConfirmacion, setShowConfirmacion] = useState<boolean>(false)
    const [confirm, setConfirm] = useState<boolean>(false)
    const [message, setMessage] = useState<string>('')

    const [requestType, setRequestType] = useState<string>()

    useEffect(() => {
        if (contenedorSeleccionado !== undefined && contenedores !== undefined) {
            const cont = contenedores.find(c => c._id === contenedorSeleccionado)
            setContenedor(cont)
        }
    }, [contenedores, contenedorSeleccionado, contenedor]);

    useEffect(() => {
        if (confirm) {
            if (requestType === 'newItem')
                guardarNewItem()
            else if (requestType === "modificarItem")
                modificarItem()
            else if (requestType === "delItem")
                eliminarItem()
            setConfirm(false)

        }
    }, [confirm])

    const handleAddItem = (index): void => {
        if (loteSeleccionado === undefined) return messageModal("error", "Seleccione un lote")

        setIsAdd(index)
    }
    const handleCancel = (): void => {
        resetStates()
    }

    const resetStates = (): void => {
        setCajas(undefined)
        setTipoCaja(undefined)
        setCalibre(undefined)
        setCalidad(undefined)
        setIsAdd(-1)
        setIndexItem(-1)
        setIndex2Item(-1)
        setIndexItemDel(-1)
        setIndex2ItemDel(-1)
    }

    const handleModificar = (index, index2): void => {
        setIndex2Item(index2)
        setIndexItem(index)
    }

    const handleEliminar = (index, index2): void => {
        setIndex2ItemDel(index2)
        setIndexItemDel(index)
        setShowConfirmacion(true)
        setMessage("¿Desea eliminar el elemento?")
        setRequestType("delItem")
    }
    const handleAceptar = (): void => {
        setShowConfirmacion(true)
        setMessage("¿Desea modificar el item?")
        setRequestType("modificarItem")
    }
    const handleGuardar = (): void => {
        setShowConfirmacion(true)
        setMessage("¿Desea agregar las cajas?")
        setRequestType("newItem")
    }


    const guardarNewItem = async (): Promise<void> => {
        try {
            if (contenedor === undefined) throw new Error("Selecciones un contenedor")
            if (loteSeleccionado === undefined) throw new Error("Selecciones un lote")
            if (cajas === undefined) throw new Error("Ingresar el numero de cajas")
            if (isNaN(Number(cajas)) || cajas.trim() === "") throw new Error("El valor debe ser numero")
            if (tipoCaja === undefined) throw new Error("Ingresar el tipo de caja")
            if (calibre === undefined) throw new Error("Ingresar el calibre")
            if (calidad === undefined) throw new Error("Ingresar la calidad")

            const item = {
                lote: loteSeleccionado?.documento._id,
                cajas: Number(cajas),
                tipoCaja: tipoCaja,
                calibre: calibre,
                calidad: calidad,
                tipoFruta: loteSeleccionado.documento.tipoFruta,
                fecha: new Date()
            }

            const request = {
                action: "put_proceso_aplicaciones_listaEmpaque_agregarItem",
                _id: contenedor._id,
                pallet: isAdd,
                item: item
            }

            const response = await window.api.server2(request)
            if (response.status !== 200)
                throw new Error(`Code ${response.status}: ${response.message}`)
            messageModal("success", "Guardado con exito")
            resetStates()
        } catch (err) {
            if (err instanceof Error) {
                messageModal("error", err.message)
            }
        }
    }
    const modificarItem = async (): Promise<void> => {
        try {
            if (contenedor === undefined) throw new Error("Selecciones un contenedor")
            if (cajas === undefined) throw new Error("Ingresar el numero de cajas")
            if (isNaN(Number(cajas)) || cajas.trim() === "") throw new Error("El valor debe ser numero")
            if (tipoCaja === undefined) throw new Error("Ingresar el tipo de caja")
            if (calibre === undefined) throw new Error("Ingresar el calibre")
            if (calidad === undefined) throw new Error("Ingresar la calidad")

            const request = {
                action: "put_proceso_aplicaciones_listaEmpaque_modificarItem_desktop",
                _id: contenedor?._id,
                pallet: indexItem,
                seleccion: index2Item,
                data: {
                    calidad, calibre, tipoCaja,
                    cajas: Number(cajas)
                }
            }
            const response = await window.api.server2(request)
            if (response.status !== 200)
                throw new Error(`Code ${response.status}: ${response.message}`)
            messageModal("succes", "Modificado con exito")
            resetStates()

        } catch (err) {
            if (err instanceof Error) {
                messageModal("error", err.message)
            }
        }
    }
    const eliminarItem = async (): Promise<void> => {
        try {
            if(indexItemDel === -1) throw new Error("Seleccione un item")
            if(index2ItemDel === -1) throw new Error("Seleccione un item")

            const request = {
                action:"put_proceso_aplicaciones_listaEmpaque_eliminarItem_desktop",
                _id: contenedor?._id,
                pallet: indexItemDel,
                seleccion: index2ItemDel
            }
            const response = await window.api.server2(request)
            if(response.status !== 200)
                throw new Error(`Code ${response.status}: ${response.message}`)
            messageModal("succes", "Dato eliminado con exito")
            resetStates()
        } catch (err) {
            if (err instanceof Error) {
                messageModal("error", err.message)
            }
        }
    }

    if (contenedor === undefined) {
        return (
            <div className="proceso-lista-empaque-pallets-sin-contenedor">
                <hr />
                Seleccione contenedor...
            </div>
        )
    }
    return (
        <div>
            <div className="table-container">
                <table className='table-main'>
                    <thead>
                        <tr >
                            {headers.map(item => (
                                <th key={item}>{item}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {contenedor &&
                            contenedor.pallets.map((_, index) => (
                                <>
                                    {contenedor.pallets[index].EF1.map((item, index2) => (
                                        <tr className={`${index % 2 === 0 ? 'fondo-par' : 'fondo-impar'}`} key={index + item.fecha}>
                                            <td>{index2 === 0 ? index + 1 : ''}</td>
                                            <td>{item.lote?.enf}</td>
                                            <td>{item.lote?.predio}</td>

                                            {(indexItem === index && index2Item === index2 && ![indexItem, index2Item].includes(-1)) ?
                                                <td>
                                                    <select onChange={(e): void => setCalidad(e.target.value)}>
                                                        <option value=""></option>
                                                        {contenedor.infoContenedor.calidad.map(caItem => (
                                                            <option value={caItem} key={caItem}>{caItem}</option>
                                                        ))}
                                                    </select>
                                                </td>
                                                :
                                                <td>{item.calidad || 'N/A'}</td>
                                            }
                                            {(indexItem === index && index2Item === index2 && ![indexItem, index2Item].includes(-1)) ?
                                                <td>
                                                    <select onChange={(e): void => setTipoCaja(e.target.value)}>
                                                        <option value=""></option>
                                                        {contenedor.infoContenedor.tipoCaja.map(caItem => (
                                                            <option value={caItem} key={caItem}>{caItem}</option>
                                                        ))}
                                                    </select>
                                                </td>
                                                :
                                                <td>{item.tipoCaja || 'N/A'}</td>
                                            }
                                            {(indexItem === index && index2Item === index2 && ![indexItem, index2Item].includes(-1)) ?
                                                <td>
                                                    <select onChange={(e): void => setCalibre(e.target.value)}>
                                                        <option value=""></option>
                                                        {contenedor.infoContenedor.calibres.map(caItem => (
                                                            <option value={caItem} key={caItem}>{caItem}</option>
                                                        ))}
                                                    </select>
                                                </td>
                                                :
                                                <td>{item.calibre || 'N/A'}</td>
                                            }
                                            {(indexItem === index && index2Item === index2 && ![indexItem, index2Item].includes(-1)) ?
                                                <td>
                                                    <input
                                                        type="text"
                                                        value={cajas ?? item.cajas}
                                                        onChange={(e): void => setCajas(e.target.value)} />
                                                </td>
                                                :
                                                <td>{item.cajas || 'N/A'}</td>
                                            }
                                            <td>{formatearFecha(item.fecha, true)}</td>


                                            <BotonesSeleccionarItemTabla
                                                itemId={index + "-" + index2}
                                                itemSeleccionadoID={indexItem + "-" + index2Item}
                                                handleAceptar={handleAceptar}
                                                handleCancelar={handleCancel}
                                                handleModificar={(): void => handleModificar(index, index2)}
                                            />
                                            <td>

                                                <button onClick={():void => handleEliminar(index,index2)}>
                                                    <RiDeleteBack2Fill color="red" />
                                                </button>
                                            </td>

                                        </tr>
                                    ))}
                                    {isAdd !== -1 && isAdd === index &&
                                        <tr>
                                            <td></td>
                                            <td>{loteSeleccionado?.documento.enf}</td>
                                            <td>{loteSeleccionado?.documento.predio.PREDIO}</td>
                                            <td>
                                                <select onChange={(e): void => setCalidad(e.target.value)}>
                                                    <option value=""></option>
                                                    {contenedor.infoContenedor.calidad.map(caItem => (
                                                        <option value={caItem} key={caItem}>{caItem}</option>
                                                    ))}
                                                </select>
                                            </td>

                                            <td>
                                                <select onChange={(e): void => setTipoCaja(e.target.value)}>
                                                    <option value=""></option>
                                                    {contenedor.infoContenedor.tipoCaja.map(caItem => (
                                                        <option value={caItem} key={caItem}>{caItem}</option>
                                                    ))}
                                                </select>
                                            </td>
                                            <td>
                                                <select onChange={(e): void => setCalibre(e.target.value)}>
                                                    <option value=""></option>
                                                    {contenedor.infoContenedor.calibres.map(caItem => (
                                                        <option value={caItem} key={caItem}>{caItem}</option>
                                                    ))}
                                                </select>
                                            </td>

                                            <td><input
                                                onChange={(e): void => setCajas(e.target.value)}
                                                value={cajas ?? ''}
                                                type="text"
                                                placeholder="Cajas" />
                                            </td>
                                            <td></td>
                                            <td>

                                                <button style={{ color: 'green' }} onClick={handleGuardar} >
                                                    <IoSaveSharp />
                                                </button>

                                                <button style={{ color: 'red' }} onClick={resetStates} >
                                                    <GiCancel />
                                                </button>
                                            </td>
                                        </tr>
                                    }
                                    <tr className="total_row">
                                        <td>Total</td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td>{contenedor.pallets[index].EF1.reduce(
                                            (acu, item) => acu += item.cajas, 0
                                        )}</td>
                                        <td></td>
                                        <td>
                                            <button onClick={(): void => handleAddItem(index)}>
                                                <BiSolidMessageSquareAdd />
                                            </button>
                                        </td>
                                        <td></td>
                                    </tr>
                                </>
                            ))
                        }
                    </tbody>
                </table>
            </div>

            {showConfirmacion &&
                <ConfirmacionModal
                    message={message}
                    setConfirmation={setConfirm}
                    setShowConfirmationModal={setShowConfirmacion} />}
        </div>
    )
}
