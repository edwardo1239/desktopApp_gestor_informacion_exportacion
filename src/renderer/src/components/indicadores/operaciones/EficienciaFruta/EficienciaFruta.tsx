/* eslint-disable prettier/prettier */

import useAppContext from "@renderer/hooks/useAppContext"
import { useEffect, useRef, useState } from "react"
import { request_data } from "./services/request";
import { procesarData } from "./services/function";
import { datosExportacion } from "./types/type";
import TableInfo from "./components/TableInfo";
import './styles/styles.css'
import GaugeChart from "./components/GaugeChart";
import LinearChart from "./components/LinearChart";
import { saveStateToLocalStorage } from "./utils/functions";
import BarChart from "./components/BarChart";

type propsType = {
    widthBar: number
}

// const LOCAL_STORAGE_KEY = "eficienciaFrutaState";

export default function EficienciaFruta(props: propsType): JSX.Element {
    const { messageModal } = useAppContext();
    const [tipoFruta, setTipoFruta] = useState("")
    const [fechaInicio, SetFechaInicio] = useState("")
    const [fechaFin, SetFechaFin] = useState("")
    const [data, setData] = useState<datosExportacion>({})
    const isResizingRef = useRef(false)
    const isMoving = useRef(false)

    const [items, setItems] = useState([
        { id: "draggable-TablaInfo", component: TableInfo, show: false, name: "Tabla", styles: {} },
        { id: "draggable-BarChart", component: BarChart, show: false, name: "Grafica de barras", styles: {} },
        { id: "draggable-GaugeChart", component: GaugeChart, show: false, name: "Grafico de Gauge", styles: {} },
        { id: "draggable-LinearChart", component: LinearChart, show: false, name: "GrafSica Lineal", styles: {} },
    ]);

    useEffect(() => {
        const newItems = items.map(item => {
            const saved = localStorage.getItem(item.id)
            if (saved) {
                console.log(saved)
                const save = JSON.parse(saved)
                item.show = true;
                item.styles = save.styles
                return item;
            }
            return item;
        })
        setItems(newItems)
    }, [])
    const handleTipoFruta = (e): void => {
        setTipoFruta(e.target.value)
    }
    const handleBuscar = async (): Promise<void> => {
        try {
            const request = request_data(fechaInicio, fechaFin, tipoFruta)
            const response = await window.api.server2(request)
            if (response.status !== 200)
                throw new Error(`Error: ${response.message}`)
            console.log(response.data)
            const objectData = procesarData(fechaInicio, fechaFin, response.data)
            setData(objectData)
        } catch (e) {
            if (e instanceof Error)
                messageModal("error", e.message)
        }
    }
    const handleCheckComponent = (componentId): void => {
        const id = componentId.target.value
        setItems((prevItems) =>
            prevItems.map((item) =>
                item.id === id ? { ...item, show: !item.show } : item
            )
        );
        const component = items.find(item => item.id === id);
        if (!component?.show) {
            saveStateToLocalStorage(component?.id, { show: true, styles: {} });
        } else {
            localStorage.removeItem(component.id);
        }
    }
    const handleMouseDown = (e, lado, itemId): void => {
        const elemento_padre = e.currentTarget.parentElement
        e.stopPropagation();
        isResizingRef.current = true;

        let prevX = e.clientX;
        let prevY = e.clientY;

        let newLeft;
        let newTop;
        let newWidth;
        let newHeight;

        document.addEventListener('mouseup', handleMouseUp);
        document.addEventListener('mousemove', handleMouseMove);


        function handleMouseMove(e): void {
            if (isResizingRef.current && !isMoving.current) {
                const rect = elemento_padre.getBoundingClientRect()
                newLeft = rect.left;
                newTop = rect.top;
                newWidth = rect.width;
                newHeight = rect.height;
                if (lado === 'rigth') {
                    newWidth = `${rect.width - (prevX - e.clientX)}px`
                    elemento_padre.style.width = newWidth
                } else if (lado === 'left') {
                    newWidth = `${rect.width + (prevX - e.clientX)}px`
                    newLeft = `${e.clientX - 17 - props.widthBar}px`
                    elemento_padre.style.width = newWidth
                    elemento_padre.style.left = newLeft
                } else if (lado === 'top') {
                    newHeight = `${rect.height + (prevY - e.clientY)}px`
                    newTop = `${e.clientY - 315}px`
                    elemento_padre.style.height = newHeight
                    elemento_padre.style.top = newTop
                } else if (lado === 'bottom') {
                    newHeight = `${rect.height - (prevY - e.clientY)}px`
                    elemento_padre.style.height = newHeight

                }
            }
            prevX = e.clientX;
            prevY = e.clientY;

        };


        function handleMouseUp(): void {
            isResizingRef.current = false;
            const saved = localStorage.getItem(itemId)

            if (saved) {
                const save = JSON.parse(saved)
                save.styles = {
                    top: lado === 'top' ? newTop : elemento_padre.style.top ,
                    left: lado === 'left' ? newLeft : elemento_padre.style.left,
                    width: (lado === 'rigth' || lado === 'left') ? newWidth : elemento_padre.style.width,
                    height: (lado === 'top' || lado === 'bottom') ? newHeight : elemento_padre.style.height 
                }
                console.log(save)
                saveStateToLocalStorage(itemId, save);
            }
            // Remove the correct reference
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            console.log("Events removed");

        };


    };
    const handleMouseDownMove = (e, itemId): void => {
        console.log("Move")
        const el = e.currentTarget

        e.stopPropagation();
        isMoving.current = true;

        document.addEventListener('mouseup', handleMouseUp);
        document.addEventListener('mousemove', handleMouseMove);

        let newLeft;
        let newTop;

        function handleMouseMove(e): void {
            if (isMoving.current) {
                newLeft = `${e.clientX - props.widthBar - 150}px`;
                newTop = `${e.clientY - 310}px`;
                el.style.left = newLeft
                el.style.top = newTop
            }
        }

        function handleMouseUp(): void {
            isMoving.current = false;
            const saved = localStorage.getItem(itemId)

            if (saved) {
                const save = JSON.parse(saved)
                save.styles = {
                    top: `${newTop}`,
                    left: `${newLeft}`
                }
                console.log(save)
                saveStateToLocalStorage(itemId, save);
            }
            // Remove the correct reference
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            console.log("Events removed");

        };
    }


    return (
        <div className="componentContainer">
            <div className="navBar"></div>
            <h2>Eficiencia de la fruta</h2>
            <div className='filtroContainer'>
                <label>
                    <p>Tipo fruta</p>
                    <select onChange={handleTipoFruta}>
                        <option value="">Tipo de fruta</option>
                        <option value="Naranja">Naranja</option>
                        <option value="Limon">Limon</option>
                    </select>
                </label>
                <label>
                    <p>Fecha Incio</p>
                    <input type="date" onChange={(e): void => SetFechaInicio(e.target.value)} />
                </label>
                <label>
                    <p>Fecha Fin</p>
                    <input type="date" onChange={(e): void => SetFechaFin(e.target.value)} />
                </label>
                <label>
                    <p>Componentes</p>
                    <select onChange={handleCheckComponent}>
                        <option value="">Graficas</option>
                        {items.map(item => (
                            <option value={item.id} key={item.id}>
                                {item.name}
                            </option>
                        ))}
                    </select>
                </label>
                <label>
                    <div>{" "}</div>
                    <button onClick={handleBuscar} >Buscar</button>
                </label>

            </div>
            <hr />
            <div className="indicadores-tarjetas-container">
                {items.map(item => {
                    const Component = item.component
                    if (item.show) {
                        return (
                            <div
                                key={item.id}
                                style={item.styles}
                                className="indicadores-tarjeta"
                                onMouseDown={(e): void => handleMouseDownMove(e, item.id)}>
                                <div className="indicadores-tarjeta-top" onMouseDown={(e): void => handleMouseDown(e, "top", item.id)}></div>
                                <div className="indicadores-tarjeta-left" onMouseDown={(e): void => handleMouseDown(e, "left", item.id)}></div>
                                <Component data={data} />
                                <div className="indicadores-tarjeta-rigth" onMouseDown={(e): void => handleMouseDown(e, "rigth", item.id)}></div>
                                <div className="indicadores-tarjeta-bottom" onMouseDown={(e): void => handleMouseDown(e, "bottom", item.id)}></div>
                            </div>
                        )
                    } else {
                        return null
                    }
                })}
            </div>
        </div>
    )
}