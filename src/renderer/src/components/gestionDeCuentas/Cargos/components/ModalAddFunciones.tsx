/* eslint-disable prettier/prettier */
import { cargoType } from "@renderer/types/cargos"
import { useState } from "react";
import { IoArrowDownCircle } from "react-icons/io5";
import { IoArrowUpCircle } from "react-icons/io5";
import { IoMdArrowDropdown } from "react-icons/io";
import { IoMdArrowDropup } from "react-icons/io";

type propsType = {
    cargo: cargoType | undefined
    clickAddPermiso: () => void
    dev: cargoType | undefined
    modificarPermisos: (datos:string[][]) => void
}

export default function ModalAddFunciones(props: propsType): JSX.Element {
    const [seccionSelect, setSeccionSelect] = useState<string[]>([]);
    const [tipoSelect, setTipoSelect] = useState<string[]>([]);
    const [filtro, setFiltro] = useState<string>('');
    const [nuevosPermisos, setNuevosPermisos] = useState<string[][]>();

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
    const handleSelectPermiso = (seccion, tipo, ventana, permiso): void => {
        setNuevosPermisos(permisos => {
            if (permisos === undefined) {
                return [[seccion, tipo, ventana, permiso]]
            } else {
                return [...permisos, [seccion, tipo, ventana, permiso]]

            }
        })
    }
    if (props.cargo === undefined || props.dev === undefined) {
        return (
            <div>No hay cargo seleccionado...</div>
        )
    }
    return (
        <div className="fondo-modal">
            <div className="modal-container">
                <div className='modal-header-agree'>
                    <h2>Seleccione los permisos que desea agregar</h2>
                </div>
                <div className='modal-container-body-cargo'>
                    <h2>Busqueda</h2>
                    <input onChange={(e): void => setFiltro(e.target.value)} type="text" className="defaultSelect" />
                    <div>
                        {Object.keys(props.dev).map(key => {
                            if (
                                !["_id", "createdAt", "Cargo", "Rol", "__v"].includes(key) &&
                                props.dev !== undefined &&
                                key.toLowerCase().startsWith(filtro.toLowerCase())
                            ) {
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
                                            {seccionSelect.includes(key) && Object.keys(props.dev[key]).map(tipo => (
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
                                                            props.dev &&
                                                            Object.keys(props.dev[key][tipo]).map(item => (
                                                                <div key={key + tipo + item}>
                                                                    <div className="cargos-crear-cargos-seccion-item">
                                                                        <h3>Permisos {item}:</h3>
                                                                        <hr />
                                                                        <div className="cargos-crear-cargos-seccion-permiso-container">
                                                                            {props.dev &&
                                                                                Object.keys(props.dev[key][tipo][item].permisos).map(permiso => {
                                                                                    if (
                                                                                        props.cargo?.[key]?.[tipo]?.[item]?.["permisos"]?.[permiso]

                                                                                    ) {
                                                                                        return (
                                                                                            null
                                                                                        )
                                                                                    } else return (
                                                                                        <div key={key + tipo + item + permiso} className="cargos-crear-cargos-seccion-permiso">
                                                                                            <h4>{permiso}</h4>
                                                                                            <input
                                                                                                type="checkBox"
                                                                                                onChange={(): void => handleSelectPermiso(key, tipo, item, permiso)}
                                                                                            />
                                                                                        </div>
                                                                                    )
                                                                                })}
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
                    </div>
                    <div className="modal-container-buttons">
                        <button className="agree" onClick={():void => nuevosPermisos && props.modificarPermisos(nuevosPermisos)}>Aceptar</button>
                        <button className="cancel" onClick={props.clickAddPermiso}>Cancelar</button>
                    </div>
                </div>

            </div>
        </div>
    )
}
