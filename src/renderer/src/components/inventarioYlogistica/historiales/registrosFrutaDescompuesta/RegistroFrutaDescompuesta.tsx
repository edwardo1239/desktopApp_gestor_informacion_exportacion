/* eslint-disable prettier/prettier */

import BotonesPasarPaginas from "@renderer/components/UI/BotonesPasarPaginas";
import BotonesSeleccionarItemTabla from "@renderer/components/UI/BotonesSeleccionarItemTabla";
import { formatearFecha } from "@renderer/functions/fechas";
import useAppContext from "@renderer/hooks/useAppContext";
import { RegistroFrutaDescompuestaType } from "@renderer/types/frutaDescompuesta";
import { useEffect, useState } from "react";

const headers = [
    "Fecha",
    "Tipo de fruta",
    "Kilos",
    "Razón",
    "Comentario Adicional",
    ""
]

type formStateType = {
    tipo_fruta?: string
    kilos_total?: string
    razon?: string
    comentario_adicional?: string
}


export default function RegistroFrutaDescompuesta(): JSX.Element {
    const { messageModal, eventoServidor, triggerServer } = useAppContext();
    const [data, setData] = useState<RegistroFrutaDescompuestaType[]>();
    const [itemSeleccionado, setItemSeleccionado] = useState<RegistroFrutaDescompuestaType>()
    const [formState, setFormState] = useState<formStateType>()

    const [numRows, setNumRows] = useState<number>(0);
    const [page, setPage] = useState<number>(1);
    const [modificando, setModificando] = useState<boolean>(false)

    useEffect(() => {
        numeroRegistros()
    }, []);
    useEffect(() => {
        obtenerRegistros()
    }, [page])
    useEffect(() => {
        if (eventoServidor === 'registro_fruta_descompuesta') {
            obtenerRegistros()
        }
    }, [triggerServer])

    const obtenerRegistros = async (): Promise<void> => {
        try {
            const request = {
                action: "get_inventarios_registros_fruta_descompuesta",
                page: page
            }
            const response = await window.api.server2(request);
            if (response.status !== 200) {
                throw new Error(`Code ${response.status}: ${response.message}`);
            }
            setData(response.data);
        } catch (error) {
            if (error instanceof Error) {
                messageModal("error", error.message);
            }
        }
    };
    const numeroRegistros = async (): Promise<void> => {
        try {
            const request = {
                action: "get_inventarios_numero_registros_fruta_descompuesta"
            }
            const response = await window.api.server2(request);
            if (response.status !== 200) {
                throw new Error(`Code ${response.status}: ${response.message}`);
            }
            setNumRows(response.data);
        } catch (error) {
            if (error instanceof Error) {
                messageModal("error", error.message);
            }
        }
    };
    const handleModificar = (id: string): void => {
        setItemSeleccionado(data?.find(item => item._id === id))
        setModificando(true)
    };
    const handleCancelar = (): void => {
        setModificando(false)
        setItemSeleccionado(undefined)
        setFormState(undefined)
    }
    const modificarDataServidor = async (): Promise<void> => {
        try {
            if (formState?.kilos_total) {
                if (formState.kilos_total && isNaN(Number(formState.kilos_total))) {
                    throw new Error("Kilos debe ser un número");
                }
            }
            const query = {
                action: "put_inventarios_registros_fruta_descompuesta",
                data: formState,
                _id: itemSeleccionado?._id
            }
            const response = await window.api.server2(query);
            if (response.status !== 200) {
                throw new Error(`Code ${response.status}: ${response.message}`);
            }
            messageModal("success", "Registro modificado correctamente");
            await obtenerRegistros();
            setModificando(false);
            setFormState(undefined);
            setItemSeleccionado(undefined);
        } catch (error) {
            if (error instanceof Error) {
                messageModal("error", error.message);
            }
        }
    }
    const handleChange = (event): void => {
        const { name, value } = event.target;
        setFormState((prev) => {
            if (!prev) {
                return { [name]: value }
            } else {
                return { ...prev, [name]: value }
            }
        });
    };
    if (!data) return <div>Loading...</div>
    return (
        <div className="componentContainer">
            <div className="navBar"></div>
            <h2>Registros fruta descomuesta</h2>
            <hr />
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
                        {data.map((registro, index) => (
                            <tr key={registro._id} className={`${index % 2 === 0 ? 'fondo-par' : 'fondo-impar'}`}>
                                <td>{formatearFecha(registro.createdAt)}</td>
                                {itemSeleccionado && (itemSeleccionado._id === registro._id) && modificando ?
                                    <td>
                                        <select
                                            onChange={handleChange}
                                            name="tipo_fruta"
                                            value={formState?.tipo_fruta ?? registro.tipo_fruta}
                                        >
                                            <option value=""></option>
                                            <option value="Limon">Limon</option>
                                            <option value="Naranja">Naranja</option>
                                        </select>
                                    </td>
                                    :
                                    <td>{registro.tipo_fruta}</td>
                                }
                                {itemSeleccionado && (itemSeleccionado._id === registro._id) && modificando ?
                                    <td>
                                        <input
                                            name="kilos_total"
                                            type="text"
                                            value={formState?.kilos_total ?? registro.kilos_total}
                                            onChange={handleChange} />
                                    </td>
                                    :
                                    <td>{registro.kilos_total}</td>
                                }
                                {itemSeleccionado && (itemSeleccionado._id === registro._id) && modificando ?
                                    <td>
                                        <input
                                            name="razon"
                                            type="text"
                                            value={formState?.razon ?? registro.razon}
                                            onChange={handleChange} />
                                    </td>
                                    :
                                    <td>{registro.razon}</td>
                                }
                                {itemSeleccionado && (itemSeleccionado._id === registro._id) && modificando ?
                                    <td>
                                        <input
                                            name="comentario_adicional"
                                            type="text"
                                            value={formState?.comentario_adicional ?? registro.comentario_adicional}
                                            onChange={handleChange} />
                                    </td>
                                    :
                                    <td>{registro.comentario_adicional}</td>
                                }

                                <BotonesSeleccionarItemTabla
                                    itemSeleccionadoID={itemSeleccionado?._id ?? ''}
                                    itemId={registro._id}
                                    handleModificar={handleModificar}
                                    handleAceptar={modificarDataServidor}
                                    handleCancelar={handleCancelar}
                                />
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <BotonesPasarPaginas
                division={50}
                page={page}
                numeroElementos={numRows}
                setPage={setPage} />
        </div>
    );
}