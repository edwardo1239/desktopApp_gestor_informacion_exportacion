/* eslint-disable prettier/prettier */

import { formularios } from "../functions/constants";
import "../css/formulario.css"

type propsType = {
    handleChangeCheckBoxk: (e) => void
    handleChangeObservaciones: (e) => void
    formState
}

export default function FormularioInspeccion(props:propsType): JSX.Element {
    return (
        <div className="formulario-inspeccion-mula-titulo-div" >
            {Object.keys(formularios).map(key => (
                <div key={key} className="formulario-inspeccion-mula-titulo-div-action">
                    <div>
                        <h4 >{formularios[key].titulo}</h4>
                    </div>
                    {Object.keys(formularios[key].formularios).map(item => (
                        <fieldset key={item}  className="formulario-inspeccion-mula-fieldset">
                            <div className="formulario-inspeccion-mula-titulo-div-label">
                                <label >
                                    {formularios[key].formularios[item]}{"  "}
                                    <input 
                                        type="checkbox"
                                        name={item} 
                                        checked={props.formState[item].cumple}
                                        className="formulario-inspeccion-mula-titulo-div-label-checkbox" 
                                        onChange={props.handleChangeCheckBoxk}/>
                                </label>
                            </div>

                            <div>
                                <label htmlFor="">Observaciones:</label>
                                <input 
                                    type="text" 
                                    value={props.formState[item].observaciones}
                                    name={item}
                                    onChange={props.handleChangeObservaciones}
                                    className="formulario-inspeccion-mula-container-input"/>
                            </div>
                        </fieldset>
                    ))}
                </div>
            ))}
        </div>
    )
}
