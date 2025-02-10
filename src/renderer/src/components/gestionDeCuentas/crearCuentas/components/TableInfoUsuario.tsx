/* eslint-disable prettier/prettier */
import { userType } from "@renderer/types/cuentas"

type propsType = {
    usuario: userType 
}
export default function TableInfoUsuario (props:propsType) :JSX.Element {
    const headers = ["Fecha ingreso", "Fecha nacimiento","Dirección","Email","Genero","Telefono"]
    const keys = ["createdAt","fechaNacimiento","direccion","email","genero","telefono"]
    return(
        <div className="contenedores-infoContenedor-container">
        {headers.map((item, index) => (
            <div key={item} className="contenedores-infoContenedor-div-datos">
                <div className="contenedores-infoContenedor-div-datos-header">{item}</div>
                <div className="contenedores-infoContenedor-div-datos-info">
                {props.usuario && props.usuario[keys[index]]}
                </div>
            </div>
        ))}
    </div>
    )
}