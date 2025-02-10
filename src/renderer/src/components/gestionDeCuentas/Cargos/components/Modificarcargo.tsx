/* eslint-disable prettier/prettier */
import { cargoType } from "@renderer/types/cargos"
import { MdSubdirectoryArrowRight } from "react-icons/md";
import { RiDeleteBack2Fill } from "react-icons/ri";
import '../styles/modificarStyles.css'
import { useEffect, useState } from "react";
import ModalAddFunciones from "./ModalAddFunciones";
import useAppContext from "@renderer/hooks/useAppContext";

type propsType = {
    cargoSeleccionado: cargoType | undefined
    dev: cargoType | undefined
    buttonHandle: () => void
    getCargos()
}

export default function ModificarCargo(props: propsType): JSX.Element {
    const { messageModal } = useAppContext();
    const [copiaCargo, setCopiaCargo] = useState<cargoType>();
    const [addPermiso, setAddPermiso] = useState<boolean>(false);
    useEffect(() => {
        if (props.cargoSeleccionado !== undefined) {
            const copiaCargos = JSON.parse(JSON.stringify(props.cargoSeleccionado));
            setCopiaCargo(copiaCargos)
        }
    }, [])
    const eliminarItem = (seccion, tipo, ventana, permiso): void => {
        if (copiaCargo !== undefined) {
            setCopiaCargo(cargoAnterior => {
                if (cargoAnterior !== undefined) {
                    const nuevoCargo = JSON.parse(JSON.stringify(cargoAnterior));

                    if (nuevoCargo[seccion] &&
                        nuevoCargo[seccion][tipo] &&
                        nuevoCargo[seccion][tipo][ventana] &&
                        nuevoCargo[seccion][tipo][ventana].permisos[permiso]
                    ) {
                        delete nuevoCargo[seccion][tipo][ventana].permisos[permiso]
                        if (Object.keys(nuevoCargo[seccion][tipo][ventana].permisos).length === 0) {
                            delete nuevoCargo[seccion][tipo][ventana]
                        }
                        if (Object.keys(nuevoCargo[seccion][tipo]).length === 0) {
                            delete nuevoCargo[seccion][tipo]
                        }
                        if (Object.keys(nuevoCargo[seccion]).length === 0) {
                            delete nuevoCargo[seccion]
                        }
                    }
                    return nuevoCargo;
                } else  return undefined
            })
        }

    }
    const clickAddPermiso = ():void => {
        setAddPermiso(!addPermiso)
    }
    const modificarPermisos = (nuevosPermisos: string[][]): void => {
        const copiaCargos = JSON.parse(JSON.stringify(copiaCargo));
        for(const key of nuevosPermisos) {
            if(!copiaCargos[key[0]]){
                copiaCargos[key[0]] = {}
            }
            if(!copiaCargos[key[0]][key[1]]){
                copiaCargos[key[0]][key[1]] = {}
            }
            if(!copiaCargos[key[0]][key[1]][key[2]]){
                copiaCargos[key[0]][key[1]][key[2]] = {}
                copiaCargos[key[0]][key[1]][key[2]]._id = props.dev && props.dev[key[0]][key[1]][key[2]]._id
            }
            if(!copiaCargos[key[0]][key[1]][key[2]].permisos){
                copiaCargos[key[0]][key[1]][key[2]].permisos = {}
            }
            if(!copiaCargos[key[0]][key[1]][key[2]].permisos[key[3]]){
                copiaCargos[key[0]][key[1]][key[2]].permisos[key[3]] = props.dev && props.dev[key[0]][key[1]][key[2]].permisos[key[3]]

            }
        }
        setCopiaCargo(copiaCargos)
        clickAddPermiso()

    }
    const guardarCambios = async (): Promise<void> => {
        try {
            const request = {
                action: 'modificar_cargo',
                cargo: copiaCargo
            }
            console.log(request)
            const response = await window.api.server2(request);
            if(response.status !== 200) 
                throw new Error(`Code ${response.status}: ${response.message}`)
            messageModal("success", "Cargo modificado con exito")
            props.buttonHandle()
            props.getCargos()
        } catch (err){
            if(err instanceof Error){
                messageModal("error", err.message)
            }
        }
    }
    if (props.cargoSeleccionado === undefined) {
        return (
            <div>No se ha seleccionado cargo...</div>
        )
    }
    return (
        <>
            <div className="cargo-modificar-container">
                <ol>
                    {copiaCargo && Object.keys(copiaCargo).map(seccion => {
                        if (seccion === 'Cargo') {
                            return (
                                <div key={"cargo"}>
                                    <h2>Cargo: {copiaCargo?.Cargo}</h2>
                                    <button onClick={clickAddPermiso} className="defaulButtonAgree">Ingresar</button>
                                </div>
                            )
                        }
                        if (!['_id', 'createdAt', '__v', 'Rol'].includes(seccion)) {
                            return (
                                <li key={seccion} className="cargo-modificar-lista1">
                                    <div>
                                        <h3> {seccion}</h3>
                                    </div>
                                    <hr />
                                    <ol>
                                        {copiaCargo && Object.keys(copiaCargo[seccion]).map(tipo => (
                                            <li key={seccion + tipo} className="cargo-modificar-lista2">
                                                <div>
                                                    <h3> <MdSubdirectoryArrowRight />  {tipo}</h3>
                                                </div>
                                                <hr />
                                                <ol>
                                                    {copiaCargo && Object.keys(copiaCargo[seccion][tipo]).map(ventana => (
                                                        <li key={seccion + tipo + ventana} className="cargo-modificar-lista3">
                                                            <div>
                                                                <h3> <MdSubdirectoryArrowRight />  {ventana}</h3>
                                                            </div>
                                                            <ol>
                                                                {copiaCargo && Object.keys(copiaCargo[seccion][tipo][ventana].permisos).map((permiso, index) => (
                                                                    <li key={permiso + index} className="cargo-modificar-lista4">
                                                                        <div>
                                                                            <h3> <MdSubdirectoryArrowRight />{permiso}</h3>
                                                                            <button onClick={(): void => eliminarItem(seccion, tipo, ventana, permiso)}><RiDeleteBack2Fill /></button>
                                                                        </div>
                                                                        <hr />
                                                                    </li>
                                                                ))}
                                                            </ol>
                                                        </li>
                                                    ))}

                                                </ol>
                                            </li>
                                        ))}
                                    </ol>
                                </li>
                            )
                        } else {
                            return null
                        }
                    })}
                </ol>
            </div>
            <div className="cargo-modificar-button-div">
                <button className="defaulButtonAgree" onClick={guardarCambios}>Guardar</button>
            </div>
            {addPermiso && 
                <ModalAddFunciones 
                    modificarPermisos={modificarPermisos} 
                    dev={props.dev} 
                    clickAddPermiso={clickAddPermiso} 
                    cargo={copiaCargo} 
                />}
            
        </>
    )
}
