/* eslint-disable prettier/prettier */
import { contenedoresType } from "@renderer/types/contenedoresType"

type propsTypes = {
    contenedorSelect: contenedoresType;
}

export default function ShowDataContenedores(props:propsTypes): JSX.Element {
  return(
    <div className="formulario-inspeccion-mulas-programacion">
        <p><span>Placa:</span> {props.contenedorSelect.infoTractoMula?.placa}</p>
        <p><span>Conductor:</span> {props.contenedorSelect.infoTractoMula?.conductor}</p>
        <p><span>Cedula:</span>{props.contenedorSelect.infoTractoMula?.cedula}</p>
        <p><span>Trailer:</span> {props.contenedorSelect.infoTractoMula?.trailer}</p>
    </div>
  )
}
