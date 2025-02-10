/* eslint-disable prettier/prettier */

import { proveedoresType } from "@renderer/types/proveedoresType"
import { formType } from "../SistemaFormulariosCrearInformeProveedor"

type propsType = {
    proveedores: proveedoresType[] | undefined
    handleChange: (event) => void
    formState: formType | undefined
}

export default function InfoGeneral(props: propsType): JSX.Element {
    return (
        <div className="info-general">
            <label>
                <p>EF1</p>
                <input 
                    value={props.formState ? props.formState.enf : ''}
                    name="enf" 
                    type="text" 
                    required 
                    onChange={props.handleChange} />
            </label>
            <label>
                <p>Tipo de fruta</p>
                <select 
                    value={props.formState ? props.formState.tipoFruta : ''}
                    name="tipoFruta" 
                    required onChange={props.handleChange}>
                    <option value=""></option>
                    <option value="Limon">Limon</option>
                    <option value="Naranja">Naranja</option>
                </select>
            </label>
            <label>
                <p>Fecha ingreso</p>
                <input 
                    value={props.formState ? props.formState.fecha_ingreso_patio : ''}
                    type="date" 
                    name="fecha_ingreso_patio" 
                    required onChange={props.handleChange} />
            </label>
            <label>
                <p>Proveedores</p>
                <select 
                    value={props.formState ? props.formState.predio : ''}
                    name="predio" 
                    required 
                    onChange={props.handleChange}>
                    <option value=""></option>
                    {props.proveedores && props.proveedores.map(prov => (
                        <option value={prov._id} key={prov._id}>
                            {prov.PREDIO}
                        </option>
                    ))}
                </select>
            </label>
            <label>
                <p>Kilos ingresados</p>
                <input 
                    value={props.formState ? props.formState.kilos : ''}
                    type="text" 
                    name="kilos" 
                    required onChange={props.handleChange} />
            </label>
            <label>
                <p>Contenedores</p>
                <input 
                    value={props.formState ? props.formState.contenedores : ''}
                    type="text" 
                    name="contenedores" 
                    required onChange={props.handleChange} />
            </label>
        </div>
    )
}