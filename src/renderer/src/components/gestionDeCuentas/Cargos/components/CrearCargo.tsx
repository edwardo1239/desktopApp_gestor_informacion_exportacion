/* eslint-disable prettier/prettier */

import { cargoType } from "@renderer/types/cargos"
import { useEffect, useState } from "react";
import { IoArrowDownCircle } from "react-icons/io5";
import { IoArrowUpCircle } from "react-icons/io5";
import { IoMdArrowDropdown } from "react-icons/io";
import { IoMdArrowDropup } from "react-icons/io";
import ModalConfirmacionCrearcargo from "./ModalConfirmacionCrearcargo";
import useAppContext from "@renderer/hooks/useAppContext";
type propsType = {
    data: cargoType | undefined
    getCargos: () => void
    handleChange: (tipo:string) => void
}
let newCargo = {};

export default function CrearCargo(props: propsType): JSX.Element {
    const { messageModal } = useAppContext();
    const [seccionSelect, setSeccionSelect] = useState<string[]>([]);
    const [tipoSelect, setTipoSelect] = useState<string[]>([]);
    const [nombre, setNombre] = useState<string>('');
    const [showModal, setShowModal] = useState<boolean>(false);
    useEffect(() => { newCargo = {} }, [])
    const handleSeccion = (select: string): void => {
        setSeccionSelect((prevState) => {
            if (prevState.includes(select)) {
                const index = prevState.findIndex(item => item === select);
                prevState.splice(index, 1);
                return [...prevState]
            } else {
                return [...prevState, select]
            }
        })
    }
    const handleTipo = (select: string): void => {
        setTipoSelect((prevState) => {
            if (prevState.includes(select)) {
                const index = prevState.findIndex(item => item === select);
                prevState.splice(index, 1);
                return [...prevState]
            } else {
                return [...prevState, select]
            }
        })
    }
    const handleSelectPermiso = (key, tipo, item, permiso): void => {
        if (props.data === undefined) return
        if (newCargo[key] &&
            newCargo[key][tipo] &&
            newCargo[key][tipo][item] &&
            newCargo[key][tipo][item].permisos[permiso]
        ) {
            delete newCargo[key][tipo][item].permisos[permiso]
            if (Object.keys(newCargo[key][tipo][item].permisos).length === 0) {
                delete newCargo[key][tipo][item]
            }
            if (Object.keys(newCargo[key][tipo]).length === 0) {
                delete newCargo[key][tipo]
            }
            if (Object.keys(newCargo[key]).length === 0) {
                delete newCargo[key]
            }
        } else {
            if (!newCargo[key]) {
                newCargo[key] = {}
            }
            if (!newCargo[key][tipo]) {
                newCargo[key][tipo] = {}
            }
            if (!newCargo[key][tipo][item]) {
                newCargo[key][tipo][item] = {}
                newCargo[key][tipo][item].permisos = {}
                newCargo[key][tipo][item]._id= props.data[key][tipo][item]._id
            }
            if (!newCargo[key][tipo][item].permisos[permiso]) {
                newCargo[key][tipo][item].permisos[permiso] = props.data[key][tipo][item].permisos[permiso]
            }
        }
        console.log(newCargo)
    }
    const handleGuardar = (): void => {
        if (nombre === '') {
            messageModal("error", "Ingrese el nombre del cargo")
        } else {
            setShowModal(true)
        }
    }
    const handleCloseModal = (): void => {
        setShowModal(false)
    }
    const reiniciarCargo = (): void => {
        newCargo = {};
        setNombre('');
    }
    if (props.data === undefined) {
        return (
            <div>No se cargo los datos...</div>
        )
    }
    return (
        <div className="cargos-crear-cargo-container">
            <label>
                <h3>Nombre del cargo</h3>
                <input type="text" className="defaultSelect" onChange={(e): void => setNombre(e.target.value)} value={nombre} />
            </label>
            {Object.keys(props.data).map(key => {
                if (!["_id", "createdAt", "Cargo", "Rol", "__v"].includes(key) && props.data !== undefined) {
                    return (
                        <div key={key} >
                            <div className="cargos-crear-cargos-seccion" onClick={(): void => handleSeccion(key)}>
                                <h3>{key}</h3>
                                {seccionSelect.includes(key) ?
                                    <IoArrowUpCircle />
                                    :
                                    <IoArrowDownCircle />
                                }
                            </div>
                            <div>
                                {seccionSelect.includes(key) && Object.keys(props.data[key]).map(tipo => (
                                    <div key={key + tipo}>
                                        <div className="cargos-crear-cargos-seccion-tipos" onClick={(): void => handleTipo(tipo)}>
                                            <h3>{tipo}</h3>
                                            {tipoSelect.includes(tipo) ?
                                                <IoMdArrowDropup />
                                                :
                                                <IoMdArrowDropdown />
                                            }
                                        </div>
                                        <div >
                                            {tipoSelect.includes(tipo) &&
                                                props.data &&
                                                Object.keys(props.data[key][tipo]).map(item => (
                                                    <div key={key + tipo + item}>
                                                        <div className="cargos-crear-cargos-seccion-item">
                                                            <h3>Permisos {item}:</h3>
                                                            <hr />
                                                            <div className="cargos-crear-cargos-seccion-permiso-container">
                                                                {props.data &&
                                                                    Object.keys(props.data[key][tipo][item].permisos).map(permiso => (
                                                                        <div key={key + tipo + item + permiso} className="cargos-crear-cargos-seccion-permiso">
                                                                            <h4>{permiso}</h4>
                                                                            <input
                                                                                type="checkBox"
                                                                                onChange={(): void => handleSelectPermiso(key, tipo, item, permiso)}
                                                                                checked={
                                                                                    newCargo?.[key]?.[tipo]?.[item]?.["permisos"]?.[permiso]
                                                                                }
                                                                            />
                                                                        </div>
                                                                    ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )
                } else {
                    return null
                }
            })}
            <div className="cargos-crear-cargos-container-button">
                <button className="defaulButtonAgree" onClick={handleGuardar}>Crear</button>
            </div>
            {showModal &&
                <ModalConfirmacionCrearcargo
                    getCargos={props.getCargos}
                    handleChange={props.handleChange}
                    reiniciarCargo={reiniciarCargo}
                    cargo={nombre}
                    newCargo={newCargo}
                    handleCloseModal={handleCloseModal}
                />
            }
        </div>
    )
}
