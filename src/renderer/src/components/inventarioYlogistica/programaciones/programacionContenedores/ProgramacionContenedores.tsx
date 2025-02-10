/* eslint-disable prettier/prettier */
import { useEffect, useState } from 'react'
import './styles/styles.css'
import CardDiaCalendario from './components/CardDiaCalendario';
import useAppContext from '@renderer/hooks/useAppContext';
import { contenedoresType } from '@renderer/types/contenedoresType';
import { FaArrowCircleLeft } from "react-icons/fa";
import { FaArrowCircleRight } from "react-icons/fa";
import { clienteType } from '@renderer/types/clientesType';

export default function ProgramacionContenedores(): JSX.Element {
    const { messageModal } = useAppContext();
    const headers = ["Domingo", "Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado"]
    const [fecha, setFecha] = useState(new Date());
    const [dias, setDias] = useState<string[]>([]);
    const [mes, setMes] = useState<string>('');
    const [contenedores, setContenedores] = useState<contenedoresType[]>()
    const [clientes, setClientes] = useState<clienteType[]>()

    useEffect(() => {
        console.log(fecha)
        // Obtener el año y el mes actual
        const year = fecha.getFullYear();
        const month = fecha.getMonth();

        const mesData = fecha.toLocaleString('default', { month: 'long' });
        const mesDataMayuscula = mesData.charAt(0).toUpperCase() + mesData.slice(1);
        setMes(mesDataMayuscula);

        // Crear una lista de días del mes actual
        const primerDia = new Date(year, month, 1, -1).getDay();
        const ultimoDia = new Date(year, month + 1, 0).getDate();
        const diasDelMes: string[] = [];
        for (let i = 0; i < primerDia; i++) {
            diasDelMes.push('');
        }
        for (let i = 1; i <= ultimoDia; i++) {
            diasDelMes.push(String(i));
        }
        setDias(diasDelMes);

        obtenerData()
        obtenerClientes()

    }, [fecha]);


    // Función para cambiar el mes
    const mesAnterior = (): void => {
        const newMonth = fecha.getMonth() - 1;
        const nuevaFecha = new Date(fecha.getFullYear(), newMonth, 1, 1);
        setFecha(nuevaFecha)
    }

    const mesSiguiente = (): void => {
        const newMonth = fecha.getMonth() + 1;
        const nuevaFecha = new Date(fecha.getFullYear(), newMonth, 1, 1);
        setFecha(nuevaFecha)
    }

    const obtenerData = async (): Promise<void> => {
        try {
            console.log(fecha)
            const request = {
                action: "obtener_contenedores_programacion",
                fecha: fecha
            }
            const response = await window.api.server2(request);
            if (response.status !== 200)
                throw new Error(`Code ${response.status}: ${response.message}`);
            setContenedores(response.data)
        } catch (err) {
            if (err instanceof Error) {
                messageModal('error', err.message)
            }
        }
    }
    const obtenerClientes = async (): Promise<void> => {
        try {
            const request = {
                action: 'getClientes',
            }
            const response = await window.api.server2(request);
            if (response.status !== 200)
                throw new Error(`Code ${response.status}: ${response.message}`)
            setClientes(response.data)
        } catch (err) {
            if (err instanceof Error) {
                messageModal("error", err.message)
            }
        }
    }

    return (
        <div className="componentContainer">
            <div className="navBar"></div>
            <h2>Programación contenedores</h2>
            <hr />
            <div className='programacion-cont-semaforo-container'>
                <div className='programacion-cont-semaforo-item-container'>
                    <div className='red'></div>
                    <p>No empezado</p>
                </div>
                <div className='programacion-cont-semaforo-item-container'>
                    <div className='orange'></div>
                    <p>En proceso</p>
                </div>
                <div className='programacion-cont-semaforo-item-container'>
                    <div className='blue'></div>
                    <p>Finalizado</p>
                </div>
                <div className='programacion-cont-semaforo-item-container'>
                    <div className='green'></div>
                    <p>Despachado</p>
                </div>
            </div>
            <div className="calendario-container">
                <div className='calendario-div-cambiar-mes'>
                    <button onClick={mesAnterior}><FaArrowCircleLeft /></button>
                    <h2>{mes}</h2>
                    <button onClick={mesSiguiente}><FaArrowCircleRight /></button>

                </div>
                <div className='calendario-grid'>
                    {headers.map(item => (
                        <div className='calendario-header' key={item}>{item}</div>
                    ))}
                    {dias.map((dia, index) => {
                        const inicioContenedor: contenedoresType[] = []
                        if (contenedores !== undefined) {
                            contenedores?.forEach(contenedor => {
                                const date = new Date(contenedor.infoContenedor.fechaInicio)
                                date.setHours(date.getHours() + 5);

                                const day = String(date.getDate());
                                if (day === dia) {
                                    inicioContenedor.push(contenedor)
                                }
                            })
                        }
                        return (
                            <CardDiaCalendario
                                clientes={clientes}
                                obtenerData={obtenerData}
                                contenedor={inicioContenedor}
                                key={index}
                                dia={dia}
                            />
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
