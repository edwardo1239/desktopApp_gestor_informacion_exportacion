/* eslint-disable prettier/prettier */
import BotonesPasarPaginas from "@renderer/components/UI/BotonesPasarPaginas";
import BotonesSeleccionarItemTabla from "@renderer/components/UI/BotonesSeleccionarItemTabla";
import { formatearFecha } from "@renderer/functions/fechas";
import useAppContext from "@renderer/hooks/useAppContext"
import { indicadoresType } from "@renderer/types/indicadoresType";
import { useEffect, useState } from "react"

const headers = [
    "Fecha",
    "Tipo de fruta procesada",
    "Kilos procesados",
    "Horas hombre",
    "Meta kilos procesados",
    ""
]

type formStateType = {
    total_horas_hombre?: string
    meta_kilos_procesados?: string
}
export default function RegistrosEficienciaOperativa(): JSX.Element {
    const { messageModal } = useAppContext();
    const [data, setData] = useState<indicadoresType[]>();
    const [itemSeleccionado, setItemSeleccionado] = useState<indicadoresType>()
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

    const obtenerRegistros = async (): Promise<void> => {
        try {
            const request = {
                action: "get_indicadores_eficiencia_operativa_elementos",
                page: page
            }
            const response = await window.api.server2(request);
            if (response.status !== 200) {
                throw new Error(`Code ${response.status}: ${response.message}`)
            }
            setData(response.data)
        } catch (err) {
            if (err instanceof Error) {
                messageModal("error", err.message)
            }
        }
    }
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
    const modificarDataServidor = async (): Promise<void> => {
        try {
            if (formState?.total_horas_hombre) {
                if (formState.total_horas_hombre && isNaN(Number(formState.total_horas_hombre))) {
                    throw new Error("Horas hombre debe ser un número");
                }
            }
            if (formState?.meta_kilos_procesados) {
                if (formState.meta_kilos_procesados && isNaN(Number(formState.meta_kilos_procesados))) {
                    throw new Error("Meta kilos procesados debe ser un número");
                }
            }
            const query = {
                action: "put_indicadores_eficiencia_operativa_modificar",
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
    if (!data) {
        return (
            <div>Cargando datos...</div>
        )
    }
    return (
        <div>
            <div className="navBar"></div>
            <h2>Registros indicadores eficiencia operativa</h2>
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
                                <td>{formatearFecha(registro.fecha_creacion)}</td>
                                <td>{registro.tipo_fruta.reduce((acu, item) => acu += item + ', ', '')}</td>
                                <td>{registro.kilos_procesador?.toFixed(2) ?? 0}</td>
                                {itemSeleccionado && (itemSeleccionado._id === registro._id) && modificando ?
                                    <td>
                                        <input
                                            onChange={handleChange}
                                            name="total_horas_hombre"
                                            value={formState?.total_horas_hombre ?? registro.total_horas_hombre}
                                        />

                                    </td>
                                    :
                                    <td>{registro.total_horas_hombre}</td>
                                }
                                {itemSeleccionado && (itemSeleccionado._id === registro._id) && modificando ?
                                    <td>
                                        <input
                                            onChange={handleChange}
                                            name="meta_kilos_procesados"
                                            value={formState?.meta_kilos_procesados ?? registro.meta_kilos_procesados}
                                        />

                                    </td>
                                    :
                                    <td>{registro.meta_kilos_procesados}</td>
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
    )
}