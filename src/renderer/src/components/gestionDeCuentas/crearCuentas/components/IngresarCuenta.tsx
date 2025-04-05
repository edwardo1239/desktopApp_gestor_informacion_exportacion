/* eslint-disable prettier/prettier */
import useAppContext from "@renderer/hooks/useAppContext";
import { useState } from "react";
import { formStateType, initFormState } from "../functions/functions";
import { cargoType } from "@renderer/types/cargos";

type propsType = {
    cargos: cargoType[] | undefined
    setOpciones: (e:string) => void
}

export default function IngresarCuentas(props: propsType): JSX.Element {
    const { messageModal } = useAppContext();
    const [formState, setFormState] = useState<formStateType>(initFormState);

    const handleChange = (event): void => {
        const { name, value } = event.target;
        setFormState({
            ...formState,
            [name]: value,
        });
    };
    const handleGuardar = async (): Promise<void> => {
        try {
            if (formState.usuario === "" || formState.password === '' || formState.cargo === '') {
                throw new Error("Necesita llenar los datos requeridos")
            }
            const request = {
                action: 'post_gestionCuentas_usuario',
                data: formState
            }
            const response = await window.api.server2(request)
            if (response.status !== 200)
                throw new Error(response.message)
            messageModal("success", "Usuario guardado con exito")
            props.setOpciones("inicio")
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
            <form className="form-container" style={{ zIndex: 20 }}>
                <h2>{"Ingresar cuenta"}</h2>
                <div>
                    <label>Usuario</label>
                    <input type="text" onChange={handleChange} name="usuario" value={formState.usuario} required />
                </div>
                <div>
                    <label>Contraseña</label>
                    <input type="text" onChange={handleChange} name="password" value={formState.password} required />
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

                <button onClick={handleGuardar} className="defaulButtonAgree">Guardar</button>

            </div>
        </div>
    )
}