/* eslint-disable prettier/prettier */

import useAppContext from "@renderer/hooks/useAppContext";
import { useEffect, useState } from "react";
import { proveedoresType } from "@renderer/types/proveedoresType";
import './styles.css'
import BotonesPasarPaginas from "@renderer/components/UI/BotonesPasarPaginas";
import { FaSearch } from "react-icons/fa";
import FiltrosProveedores from "./components/FiltrosProveedores";
import ModalProveedores from "./components/ModalProveedores";
import { FcCancel } from "react-icons/fc";
import { FcOk } from "react-icons/fc";

const headers = [
    "Codigo interno",
    "Predio",
    "ICA",
    "GGN",
    "SISPAP",
    "Estado",
    ""
]

export type filtroType = {
    SISPAP?: boolean
    PREDIO?: string
    "GGN.code"?: string
}


export default function Proveedores(): JSX.Element {
    const { messageModal, user, setLoading } = useAppContext()
    const [data, setData] = useState<proveedoresType[]>([])
    const [page, setPage] = useState<number>(1);
    const [numRows, setNumRows] = useState<number>(0);
    const [filtro, setFiltro] = useState<filtroType>()
    const [proveedor, setProveedor] = useState<proveedoresType>()


    useEffect(() => {
        const fetachData = async (): Promise<void> => {
            try {
                setLoading(true)
                await obtenerRegistros(filtro)
                await numeroRegistros(filtro)
                await obtenerRegistros(filtro)
            } catch (err) {
                if (err instanceof Error) {
                    messageModal("error", err.message)
                }
            } finally {
                setLoading(false)
            }
        }

        fetachData()
    }, [page])
    const handleObtenerData = async (): Promise<void> => {
        try {
            obtenerRegistros(filtro)
            numeroRegistros(filtro)
        } catch (err) {
            if (err instanceof Error) {
                messageModal("error", err.message)
            }
        }
    }
    const obtenerRegistros = async (filtro = {}): Promise<void> => {
        const request = {
            action: "get_comercial_proveedores_elementos",
            page: page,
            filtro: filtro
        }
        const response = await window.api.server2(request);
        if (response.status !== 200) {
            throw new Error(`Code ${response.status}: ${response.message}`)
        }
        setData(response.data)
    }
    const numeroRegistros = async (filtro = {}): Promise<void> => {
        const request = {
            action: "get_comercial_proveedores_numero_elementos",
            filtro: filtro
        }
        const response = await window.api.server2(request);
        if (response.status !== 200) {
            throw new Error(`Code ${response.status}: ${response.message}`);
        }
        setNumRows(response.data);
    };
    const handleVerInfoProveedor = (_id): void => {
        const dialogINfo = document.getElementById("ingresar_proveedor_modal") as HTMLDialogElement;
        if (dialogINfo) {
            dialogINfo.showModal();
        }
        if (data) {
            const predio = data.find(item => item._id === _id)
            if (predio) {
                setProveedor(predio)
            }
        }
    }

    if (!data || !user) {
        return (
            <div>Cargando...</div>
        )
    }
    return (
        <div>
            <div className="navBar"></div>
            <h2>Proveedores</h2>
            <hr />
            <FiltrosProveedores
                setFiltro={setFiltro}
                filtro={filtro}
                obtenerRegistros={obtenerRegistros}
                numeroRegistros={numeroRegistros} />
            <div className="table-container">
                <table className="table-main">
                    <thead>
                        <tr>
                            {headers
                                .filter(item => user.rol >= 2 ? item !== "Estado" : true) // Filtrar "Estado" solo si user.rol >= 2
                                .map(item => <th key={item}>{item}</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item, index) => (
                            <tr key={item._id} className={`${index % 2 === 0 ? 'fondo-par' : 'fondo-impar'}`}>
                                <td>{item["CODIGO INTERNO"] ?? ''}</td>
                                <td>{item.PREDIO ?? ''}</td>
                                <td>{item.ICA?.code ?? ''}</td>
                                <td>{item.GGN?.code ?? ''}</td>
                                <td><div>{item.SISPAP ? <FcOk /> : <FcCancel />}</div></td>
                                {user.rol < 2 &&
                                    <td>{item.activo ? "Activo" : "Inactivo"}</td>
                                }
                                <td>
                                    <button
                                        data-testid={`comercial-proveedores-button-ver-info-${index}`}
                                        className="table-row-button"
                                        onClick={(): void => handleVerInfoProveedor(item._id)}>
                                        <FaSearch color="blue" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <ModalProveedores
                handleObtenerData={handleObtenerData}
                setProveedor={setProveedor}
                proveedor={proveedor} />
            <BotonesPasarPaginas
                division={25}
                page={page}
                numeroElementos={numRows}
                setPage={setPage} />
        </div>


    )
}
