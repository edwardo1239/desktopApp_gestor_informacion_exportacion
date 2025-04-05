/* eslint-disable prettier/prettier */
import { userType } from "@renderer/types/cuentas"
import { useEffect, useState } from "react"
import { formStateChangeType, initFormChangeState } from "../functions/functions";
import useAppContext from "@renderer/hooks/useAppContext";
import { cargoType } from "@renderer/types/cargos";

type propsType = {
    cargos: cargoType[] | undefined
    setOpciones: (e:string) => void
    usuario: userType | undefined
    obtenerData: () => void
}

export default function ModificarUsuario(props: propsType): JSX.Element {
    const { messageModal } = useAppContext();
    const [formState, setFormState] = useState<formStateChangeType>(initFormChangeState);

    useEffect(() => {
        datos_usuario()
    }, [])
    const handleChange = (event): void => {
        const { name, value } = event.target;
        setFormState({
            ...formState,
            [name]: value,
        });
    };
    const datos_usuario = (): void => {
        if ( props.usuario !== undefined) {
            const formData = { ...formState };
            formData.usuario = props.usuario.usuario
            formData.nombre = props.usuario.nombre !== undefined ? props.usuario.nombre : ''
            formData.apellido = props.usuario.apellido !== undefined ? props.usuario.apellido : ''
            formData.genero = props.usuario.genero !== undefined ? props.usuario.genero : ''
            formData.direccion = props.usuario.direccion !== undefined ? props.usuario.direccion : ''
            formData.telefono = props.usuario.telefono !== undefined ? props.usuario.telefono : ''
            formData.email = props.usuario.email !== undefined ? props.usuario.email : ''

            formData.fechaNacimiento = props.usuario.fechaNacimiento !== undefined ? new Date(props.usuario.fechaNacimiento).toISOString().substr(0, 10) : ''
            formData.cargo = props.usuario.cargo._id
            formData.cargoName = props.usuario.cargo.Cargo
            setFormState(formData);

        }
    }

    const handleModificar = async (): Promise<void> => {
        try {
            if (formState.usuario === ""  || formState.cargo === '') {
                throw new Error("Necesita llenar los datos requeridos")
            }
            const request = {
                action: 'put_gestionCuentas_usuario',
                data: formState,
                _id: props.usuario?._id,
                __v: props.usuario?.__v

            }
            const response = await window.api.server2(request)
            if (response.status !== 200)
                throw new Error(response.message)
            messageModal("success", "Usuario modificado con exito")
            props.setOpciones("inicio")
            props.obtenerData()

        } catch (e) {
            if (e instanceof Error)
                messageModal("error", e.message)
        }
    }
    return (
        <div className="componentContainer">
                        <div className='filtroContainer'>
                <div className='div-filter-actions'>
                    <button onClick={(): void => props.setOpciones("inicio")}>
                        {"Usuarios"}
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" ><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12 3c7.2 0 9 1.8 9 9s-1.8 9 -9 9s-9 -1.8 -9 -9s1.8 -9 9 -9z" /><path d="M15 12h-6" /><path d="M12 9v6" /></svg>
                    </button>
                </div>
            </div>
            <form className="form-container" >
                <h2>{"Modificar cuenta"}</h2>
                <div>
                    <label>Usuario</label>
                    <input type="text" onChange={handleChange} name="usuario" value={formState.usuario} required />
                </div>

                <div>
                    <label> Cargos</label>
                    <select
                        className='defaultSelect usuario-ingresar-cuenta-cargo-select'
                        onChange={handleChange}
                        value={formState.cargo}
                        required
                        name='cargo'>
                        <option value="">Cargos</option>
                        {props.cargos && props.cargos.map((item) => (
                            <option key={item._id} value={item._id}>{item.Cargo}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label>Nombre</label>
                    <input type="text" onChange={handleChange} name="nombre" value={formState.nombre} required />
                </div>
                <div>
                    <label>Apellido</label>
                    <input type="text" onChange={handleChange} name="apellido" value={formState.apellido} required />
                </div>
                <div>
                    <label>Genero</label>
                    <input type="text" onChange={handleChange} name="genero" value={formState.genero} required />
                </div>
                <div>
                    <label>Fecha nacimiento</label>
                    <input type="date" onChange={handleChange} name="fechaNacimiento" value={formState.fechaNacimiento} required />
                </div>
                <div>
                    <label>Dirección</label>
                    <input type="text" onChange={handleChange} name="direccion" value={formState.direccion} required />
                </div>
                <div>
                    <label>Telefono</label>
                    <input type="tel" onChange={handleChange} name="telefono" value={formState.telefono} required />
                </div>
                <div>
                    <label>Email</label>
                    <input type="email" onChange={handleChange} name="email" value={formState.email} required />
                </div>
            </form>

            <div className="agregar-usuario-guardar-boton-div">
                <button onClick={handleModificar} className="defaulButtonAgree">Modificar</button>

            </div>
        </div>
    )
}
