/* eslint-disable prettier/prettier */
import imgPerfilDefault from "@renderer/assets/perfil.webp"
import useAppContext from "@renderer/hooks/useAppContext";
import { userType } from "@renderer/types/cuentas"
import { useEffect, useState } from "react"
import { FcOk } from "react-icons/fc";
import { FcHighPriority } from "react-icons/fc";
import './style.css'
import ConfirmacionModal from "@renderer/messages/ConfirmacionModal";
export default function MiCuenta(): JSX.Element {
    const { messageModal } = useAppContext();
    const [info, setInfo] = useState<userType>();
    const [newPassword, setNewPassword] = useState<string>()
    const [newPassOk, setNewPassOk] = useState<boolean>(false)
    const [comparePass, setComaprePass] = useState<boolean>(false)
    const [showConfirmacion, setShowConfirmacion] = useState<boolean>(false)
    const [confirm, setConfirm] = useState<boolean>(false)
    const [message, setMessage] = useState<string>('')
    useEffect(() => {
        obtenerInfoCuenta()
    }, [])
    useEffect(() => {
        if (confirm) {
            modificarContraseña()
            setConfirm(false)
        }
    }, [confirm]);
    const obtenerInfoCuenta = async (): Promise<void> => {
        try {
            const request = { action: "obtener_info_mi_cuenta" }
            const response = await window.api.server2(request);
            if (response.status !== 200)
                throw new Error(`Code ${response.status}: ${response.message}`)
            console.log(response)
            setInfo(response.data)
        } catch (err) {
            if (err instanceof Error) {
                messageModal("success", err.message)
            }
        }
    }
    const modificarContraseña = async (): Promise<void> => {
        try {
            if(!newPassOk) throw new Error("Error: la contraseña no cumple con los requisitos")
            if(!newPassOk) throw new Error("Error: la dos contraseñas no son iguales")
            const request = {
                action:"modificar_mi_password",
                data:newPassword
            };
            const response = await window.api.server2(request);
            if(response.status !== 200)
                throw new Error(`Code ${response.status}: ${response.message}`)
            messageModal("success", "Contraseña modificada con exito")
        } catch (err) {
            if (err instanceof Error) {
                messageModal("error", err.message)
            }
        }
    }

    const handleNewPass = (): void => {
        setShowConfirmacion(true)
        setMessage("¿Desea cambiar su contraseña?")
    }
    const handleNewPassword = (e:string):void =>{
        if(e !== '')  setNewPassOk(true)
        else   setNewPassOk(false)
        setNewPassword(e)
    }
    const handleCompare = (e:string):void =>{
        if(e === newPassword) setComaprePass(true)
        else setComaprePass(false)
    }
    if (info === undefined) {
        return (
            <div>Cargando datos...</div>
        )
    }
    return (
        <div className="componentContainer">
            <div className="navBar"></div>
            <h2>Información de la cuenta</h2>
            <hr />
            <div className="micuenta-container">
                <div className="micuenta-infogeneral">
                    <div className="micuenta-infogeneral-imagen">
                        <img src={imgPerfilDefault} alt="imagen de perfil default" />
                    </div>
                    <div className="micuenta-infogeneral-datos">
                        <div>
                            <h3>Nombre:</h3>
                            <p>{info.nombre}</p>
                        </div>
                        <div>
                            <h3>Apellido:</h3>
                            <p>{info.apellido}</p>
                        </div>
                        <div>
                            <h3>Usuario:</h3>
                            <p>{info.usuario}</p>
                        </div>
                        <div>
                            <h3>Cargo:</h3>
                            <p>{info.cargo.Cargo}</p>
                        </div>
                        <div>
                            <h3>Email:</h3>
                            <p>{info.email}</p>
                        </div>
                        <div>
                            <h3>Sexo:</h3>
                            <p>{info.genero}</p>
                        </div>
                        <div>
                            <h3>Fecha nacimiento:</h3>
                            <p>{
                                info.fechaNacimiento ?
                                    new Date(info.fechaNacimiento).toLocaleDateString()
                                    : 'N/A'
                            }</p>
                        </div>
                        <div>
                            <h3>Direccion:</h3>
                            <p>{info.direccion}</p>
                        </div>
                        <div></div>
                    </div>
                </div>
                <div className="micuenta-acciones-container">
                    <div className="micuenta-nuevacontra-container">
                        <h2>Cambiar contraseña</h2>
                        <hr />
                        <div className="micuenta-nuevacontra-inputs">
                            <label>
                                <p>Nueva contraseña:</p>
                                <input 
                                    className="defaultSelect"
                                    type="password" 
                                    onChange={(e):void => handleNewPassword(e.target.value)} 
                                />
                                {newPassOk && <FcOk fontSize={24} />}
                                {!newPassOk && <FcHighPriority fontSize={24} />}
                            </label>
                            <label>
                                <p>Repetir contraseña:</p>
                                <input
                                    className="defaultSelect"
                                    type="password"
                                    onChange={(e):void => handleCompare(e.target.value)} 
                                />
                                {comparePass && <FcOk fontSize={24} />}
                                {!comparePass && <FcHighPriority fontSize={24} />}
                            </label>
                            <button onClick={handleNewPass} className="defaulButtonAgree">Modificar</button>
                        </div>
                    </div>
                </div>
            </div>
            {showConfirmacion &&
                <ConfirmacionModal
                    message={message}
                    setConfirmation={setConfirm}
                    setShowConfirmationModal={setShowConfirmacion} />}
        </div>
    )
}
