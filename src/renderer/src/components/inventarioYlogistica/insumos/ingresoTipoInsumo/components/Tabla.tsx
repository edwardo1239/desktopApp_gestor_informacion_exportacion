/* eslint-disable prettier/prettier */
import { insumosType } from "@renderer/types/insumos"
import { useState } from "react";
import { PiNotePencilDuotone } from "react-icons/pi";
import { MdCancel } from "react-icons/md";
import { IoSaveSharp } from "react-icons/io5";
import useAppContext from "@renderer/hooks/useAppContext";
import { formatearFecha } from "@renderer/functions/fechas";

type propsType = {
    data: insumosType[] | undefined
    obtenerData: () => void
}

export default function Tabla(props: propsType): JSX.Element {
    const { messageModal } = useAppContext();
    const headers = ["Codigo", "Insumo", "alias", "Tipo", "Medida", "Fecha ingreso", ""]
    const [idEditando, setIdEditando] = useState<string[]>([])
    const [modifiedData, SetModifiedData] = useState<insumosType | undefined>()
    const handleEditar = (_id): void => {
        setIdEditando(prev => [...prev, _id])
    }
    const handleCancelar = (_id): void => {
        setIdEditando(prev => {
            const newArr = prev.filter(item => item !== _id)
            return newArr
        })
        SetModifiedData(undefined)
    }
    const handleInputs = (item, elemento, dato): void => {
        SetModifiedData({
            ...item,
            [elemento]: dato
        })
    }
    const handleGuardar = async (): Promise<void> => {
        try {
            const req = {
                data: modifiedData,
                action: "put_inventarios_insumos"
            }
            const response = await window.api.server2(req)
            if (response.status !== 200)
                throw new Error(`Code ${response.status}: ${response.message}`)
            messageModal("success", "Se modifico el insumo con exito")
            handleCancelar(modifiedData?._id)
            SetModifiedData(undefined)
            props.obtenerData()
        } catch (err) {
            if (err instanceof Error) {
                messageModal("error", err.message)
            }
        }
    }
    if (props.data === undefined) {
        return (
            <div>Cargando datos...</div>
        )
    }
    return (
        <div className="table-container">

        <table className="table-main">
            <thead>
                <tr>
                    {headers.map(item => (
                        <th key={item}>{item}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {props.data.map((item, index) => (
                    <tr className={`${index % 2 === 0 ? 'fondo-par' : 'fondo-impar'}`} key={item._id}>
                        <td>{idEditando.includes(item._id) ?
                            <input type="text"
                                value={modifiedData ? modifiedData["codigo"] : item.codigo}
                                onChange={(e): void =>
                                    handleInputs(
                                        item, "codigo", e.target.value
                                    )} />
                            : item.codigo}</td>
                        <td>{idEditando.includes(item._id) ?
                            <input type="text"
                                value={modifiedData ? modifiedData["insumo"] : item.insumo}
                                onChange={(e): void =>
                                    handleInputs(
                                        item, "insumo", e.target.value
                                    )} />
                            : item.insumo}</td>
                        <td>{idEditando.includes(item._id) ?
                            <input type="text"
                                value={modifiedData ? modifiedData["alias"] : item.alias}
                                onChange={(e): void =>
                                    handleInputs(
                                        item, "alias", e.target.value
                                    )} />
                            : item.alias}</td>
                        <td>{idEditando.includes(item._id) ?
                            <input type="text"
                                value={modifiedData ? modifiedData["tipo"] : item.tipo}
                                onChange={(e): void =>
                                    handleInputs(
                                        item, "tipo", e.target.value
                                    )} />
                            : item.tipo}</td>
                        <td>{idEditando.includes(item._id) ?
                            <input type="text"
                                value={modifiedData ? modifiedData["medida"] : item.medida}
                                onChange={(e): void =>
                                    handleInputs(
                                        item, "medida", e.target.value
                                    )} />
                            : item.medida}</td>
                        <td>{formatearFecha(item.createdAt)}</td>
                        <td>
                            {idEditando.includes(item._id) ?
                                <div>
                                    <button onClick={handleGuardar}><IoSaveSharp color="green" /></button>
                                    <button onClick={(): void => handleCancelar(item._id)} ><MdCancel color="red" /></button>
                                </div>
                                :
                                <button style={{ color: "blue" }} onClick={(): void => handleEditar(item._id)} ><PiNotePencilDuotone /></button>

                            }
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
        </div>
    )
}
