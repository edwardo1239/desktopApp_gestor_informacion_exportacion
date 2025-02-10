/* eslint-disable prettier/prettier */

import { formType } from "../SistemaFormulariosCrearInformeProveedor"


type propsType = {
    handleChange: (event) => void
    observacionesCalidad: {[key:string]:string} | undefined
    formState: formType | undefined
}
export default function ObservacionesCalidad(props: propsType): JSX.Element {
    return (
        <div className="info-general">
            <label>
                <p>Observacion calidad 1</p>
                <select 
                    value={props.formState ? props.formState.observacion1 : ''}
                    onChange={props.handleChange} name="observacion1" required>
                    <option value=""></option>
                    {props.observacionesCalidad &&
                        Object.entries(props.observacionesCalidad).map(([key, value]) => (
                            <option value={value} key={key}>
                                {value as string}
                            </option>
                        ))
                    }
                </select>
            </label>
            <label>
                <p>Observacion calidad 2</p>
                <select 
                    value={props.formState ? props.formState.observacion2 : ''}
                    onChange={props.handleChange} name="observacion2" required>
                    <option value=""></option>
                    {props.observacionesCalidad &&
                        Object.entries(props.observacionesCalidad).map(([key, value]) => (
                            <option value={value} key={key}>
                                {value as string}
                            </option>
                        ))
                    }
                </select>
            </label>
            <label>
                <p>Observacion calidad 3</p>
                <select 
                    value={props.formState ? props.formState.observacion3 : ''}
                    onChange={props.handleChange} name="observacion3" required>
                    <option value=""></option>
                    {props.observacionesCalidad &&
                        Object.entries(props.observacionesCalidad).map(([key, value]) => (
                            <option value={value} key={key}>
                                {value as string}
                            </option>
                        ))
                    }
                </select>
            </label>
            <label>
                <p>Observacion calidad 4</p>
                <select 
                    value={props.formState ? props.formState.observacion4 : ''}
                    onChange={props.handleChange} name="observacion4" required>
                    <option value=""></option>
                    {props.observacionesCalidad &&
                        Object.entries(props.observacionesCalidad).map(([key, value]) => (
                            <option value={value} key={key}>
                                {value as string}
                            </option>
                        ))
                    }
                </select>
            </label>
        </div>
    )
}