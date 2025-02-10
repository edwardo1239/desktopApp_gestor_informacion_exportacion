/* eslint-disable prettier/prettier */
import { format } from "date-fns";
import { es } from 'date-fns/locale';
import { headers } from "../functions/constants";
import { lotesType } from "@renderer/types/lotesType";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileAlt } from '@fortawesome/free-solid-svg-icons';

type propsType = {
    datosFiltrados: lotesType[]
    handleAccederDocumento: (data: lotesType) => void
}
export default function TablaInformeCalidad(props: propsType): JSX.Element {
    return (
        <div className="table-container">

        <table className="table-main">
            <thead>
                <tr>
                    {headers.map(item => (
                        <th key={item}>{item}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {props.datosFiltrados.map((item, index) => (
                    <tr className={`${index % 2 === 0 ? 'fondo-par' : 'fondo-impar'}`} key={index}>
                        <td>
                            {item.enf}
                        </td>
                        <td>{item.predio && item.predio.PREDIO}</td>
                        <td>{item.tipoFruta}</td>
                        <td>{format(item.fechaIngreso ? new Date(item.fechaIngreso) : new Date(), 'dd/MM/yyyy HH:mm', { locale: es })}</td>
                        <td>{item.observaciones}</td>
                        <td >
                            <button
                                onClick={(): void => props.handleAccederDocumento(item)}>
                                <FontAwesomeIcon icon={faFileAlt} />
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
        </div>
    )
}