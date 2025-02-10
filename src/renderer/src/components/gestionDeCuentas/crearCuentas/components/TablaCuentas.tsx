/* eslint-disable prettier/prettier */
import { userType } from "@renderer/types/cuentas"
import { Fragment, useEffect, useState } from "react";
import { PiNotePencilDuotone } from "react-icons/pi";
import { FaArrowCircleDown } from "react-icons/fa";
import { FaArrowCircleUp } from "react-icons/fa";
import TableInfoUsuario from "./TableInfoUsuario";
import useAppContext from "@renderer/hooks/useAppContext";
import ConfirmacionModal from "@renderer/messages/ConfirmacionModal";
import { GrLinkNext } from "react-icons/gr";
import { GrLinkPrevious } from "react-icons/gr";
import { cargoType } from "@renderer/types/cargos";

type propsType = {
    handleModificar: (usuario, tipo) => void
    setOpciones: (e: string) => void
    cargos: cargoType[] | undefined
}
export default function TablaCuentas(props: propsType): JSX.Element {

    const { messageModal } = useAppContext()
    const [opcion, setOpcion] = useState<string>("")
    const [usuarioSeleccionado, setUsuarioSeleccionado] = useState<string>("");
    const [usuarioDataSeleccionado, setUsuarioDataSeleccionado] = useState<userType>()
    const headers = ["Usuario", "Nombre", "Apellido", "Info Usuario", "Cargo", "Estado", "Modificar"]
    const [showConfirmacion, setShowConfirmacion] = useState<boolean>(false)
    const [confirm, setConfirm] = useState<boolean>(false)
    const [message, setMessage] = useState<string>('')
    const [dataOriginal, setDataOriginal] = useState<userType[]>([])
    const [verPorEstado, setVerPorEstado] = useState<string>('')
    const [data, setData] = useState<userType[]>();

    const [cargoSelect, setCargoSelect] = useState<cargoType>()
    const [countPage, setCountPage] = useState<number>(1);
    const [numeroDoc, setNumeroDoc] = useState<number>();

    const obtenerData = async (): Promise<void> => {
        try {
            const request = {
                action: 'get_users',
                page: countPage,
                cargoFilter: cargoSelect ? cargoSelect._id : ""
            }
            const response = await window.api.server2(request);
            if (response.status !== 200)
                throw new Error(response.message)
            setData(response.data)
            setDataOriginal(response.data)
        } catch (e) {
            if (e instanceof Error)
                messageModal("error", e.message);
        }
    }

    const obtener_numero_elementos = async (): Promise<void> => {
        try {
            const request = { action: "obtener_cantidad_usuarios" }
            const response = await window.api.server2(request)
            if (response.status !== 200)
                throw new Error(`Code ${response.status}: ${response.message}`)
            setNumeroDoc(response.data)
            console.log(response)
        } catch (err) {
            if (err instanceof Error) {
                messageModal("error", "Error obteniendo el numero de elementos")
            }
        }
    }
    useEffect(() => {
        obtener_numero_elementos();

    }, [])

    useEffect(() => {
        obtenerData();
    }, [countPage, cargoSelect])

    useEffect(() => {
        let estado;
        let dataFilter = dataOriginal
        if (verPorEstado === '' || verPorEstado === 'activos') {
            estado = true;
        } else if (verPorEstado === 'inactivos') {
            estado = false
        }
        if (verPorEstado !== 'todos') {
            dataFilter = dataFilter.filter(item => item.estado === estado);
        }

        setData(dataFilter)

    }, [verPorEstado])

    useEffect(() => {
        if (confirm) {
            eliminar()
            setConfirm(false)
        }
    }, [confirm]);

    if (!data) {
        return <div>Cargando...</div>; // O cualquier otro indicador de carga que prefieras
    }

    const handleClick = (e, id): void => {
        if (opcion !== "") {
            setOpcion("")
            setUsuarioSeleccionado("")
        }
        else {
            setOpcion(e)
            setUsuarioSeleccionado(id)
        }
    }
    const handleEliminar = (usuario): void => {
        setShowConfirmacion(true)
        if (usuario.estado) {
            setMessage("¿Desea desactivar el Usuario seleccionado?")
        } else {
            setMessage("¿Desea activar el Usuario seleccionado?")
        }
        setUsuarioDataSeleccionado(usuario)
    }
    const eliminar = async (): Promise<void> => {
        try {
            const request = {
                action: 'desactivar_user',
                _id: usuarioDataSeleccionado?._id,
                __v: usuarioDataSeleccionado?.__v
            }
            const response = await window.api.server2(request);
            if (response.status !== 200)
                throw new Error(response.message)
            if (usuarioDataSeleccionado?.estado) {
                messageModal("success", "Usuario desactivado con exito")
            } else {
                messageModal("success", "Usuario activado con exito")
            }

            obtenerData();
        } catch (e) {
            if (e instanceof Error)
                messageModal("error", e.message)
        }
    }
    const handleChangeCargo = (_id): void => {
        if (!props.cargos) return messageModal("error", "Error no hay cargos")
        if (_id === "") setCargoSelect(undefined)
        const cargo = props.cargos.find(cargo => cargo._id === _id)
        if (cargo) {
            setCargoSelect(cargo)
        }
    }

    return (
        <>
            <div className='filtroContainer'>
                <div className='div-filter-actions'>
                    <button onClick={(): void => props.setOpciones("agregar")}>
                        {"Agregar cuenta"}
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" ><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12 3c7.2 0 9 1.8 9 9s-1.8 9 -9 9s-9 -1.8 -9 -9s1.8 -9 9 -9z" /><path d="M15 12h-6" /><path d="M12 9v6" /></svg>
                    </button>
                    <select onChange={(e): void => setVerPorEstado(e.target.value)} >
                        <option value="">Ver usuarios por:</option>
                        <option value="activos">Activos</option>
                        <option value="inactivos">Inactivos</option>
                        <option value="todos">Todos</option>
                    </select>
                    <select onChange={(e): void => handleChangeCargo(e.target.value)}>
                        <option value="">Cargos</option>
                        {props.cargos && props.cargos.map(cargo => (
                            <option value={cargo._id} key={cargo._id}>{cargo.Cargo}</option>
                        ))}
                    </select>
                </div>
            </div>
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
                        {data.map(usuario => (
                            <Fragment key={usuario._id}>
                                <tr >
                                    <td>{usuario.usuario}</td>
                                    <td>{usuario.nombre}</td>
                                    <td>{usuario.apellido}</td>
                                    <td>
                                        <div onClick={(): void => handleClick("info-usuario", usuario._id)}>
                                            <p>Info Usuario</p>
                                            {opcion === "info-usuario" && usuarioSeleccionado === usuario._id ?
                                                <FaArrowCircleUp /> :
                                                <FaArrowCircleDown />
                                            }
                                        </div>
                                    </td>
                                    <td>{usuario.cargo.Cargo}</td>
                                    <td>
                                        <button style={{ color: "red" }} onClick={(): void => handleEliminar(usuario)}>
                                            {usuario.estado ?
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="green" ><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M7 3.34a10 10 0 1 1 -4.995 8.984l-.005 -.324l.005 -.324a10 10 0 0 1 4.995 -8.336z" /></svg>
                                                :
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="red" ><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M7 3.34a10 10 0 1 1 -4.995 8.984l-.005 -.324l.005 -.324a10 10 0 0 1 4.995 -8.336z" /></svg>
                                            }
                                        </button>

                                    </td>
                                    <td>
                                        <button onClick={(): void => props.handleModificar(usuario, 'modificar')} style={{ color: "blue" }}><PiNotePencilDuotone /></button>
                                    </td>
                                </tr>
                                {opcion !== '' && usuarioSeleccionado === usuario._id &&
                                    <tr>
                                        <td colSpan={7}>
                                            {opcion === "info-usuario" && <TableInfoUsuario usuario={usuario} />}
                                        </td>
                                    </tr>
                                }
                            </Fragment>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="informesCalidad-div-button">

                <button onClick={(): void => {
                    if (countPage > 1) {
                        setCountPage(countPage - 1)
                    }
                }}>
                    <GrLinkPrevious />
                </button>
                {countPage}
                <button onClick={(): void => {
                    if (numeroDoc) {
                        if (numeroDoc / (countPage * 50) > 1) {
                            setCountPage(countPage + 1)
                        }
                    }
                }}>
                    <GrLinkNext />
                </button>
            </div>

            {showConfirmacion &&
                <ConfirmacionModal
                    message={message}
                    setConfirmation={setConfirm}
                    setShowConfirmationModal={setShowConfirmacion} />}</>
    )
}