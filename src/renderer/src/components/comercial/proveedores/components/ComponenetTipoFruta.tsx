/* eslint-disable prettier/prettier */

import useAppContext from "@renderer/hooks/useAppContext"
import { proveedoresType } from "@renderer/types/proveedoresType"
import { useEffect } from "react"

type propsType = {
    proveedor: proveedoresType | undefined
    arreglo: string[] | undefined
    valor: string[] | undefined
    handleTipoFruta: (e: React.ChangeEvent<HTMLSelectElement>) => void
    nombre: string
}

export default function ComponenetTipoFruta(props: propsType): JSX.Element {
    const { user } = useAppContext();

    useEffect(() => { }, [props.proveedor]);

    const isDisabled = user && user.rol > 2;
    const value = Array.isArray(props.valor) ? props.valor : [];

    if (props.proveedor && isDisabled) {
        return (
            <select
                name={props.nombre}
                value={value}
                onChange={props.handleTipoFruta}
                disabled={isDisabled}
                multiple
                aria-label={props.nombre} // Asegura un nombre accesible
            >
                {props.valor ? (
                    props.valor.map((item) => (
                        <option value={item} key={item}>
                            {item}
                        </option>
                    ))
                ) : (
                    <option value="">Cargando...</option>
                )}
            </select>
        );
    }
    return (
        <select
            name={props.nombre}
            value={value}
            onChange={props.handleTipoFruta}
            disabled={isDisabled}
            multiple
            aria-label={props.nombre}
        >
            <option value=""></option>

            {props.arreglo ? props.arreglo.map(item => (
                <option value={item} key={item}>{item}</option>
            ))
                :
                <option value="">Cargando...</option>
            } :


        </select>
    )
}