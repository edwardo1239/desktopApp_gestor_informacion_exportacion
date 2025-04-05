/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Chart from 'chart.js/auto';
import { useEffect, useRef } from "react";
import { formatearFecha } from '@renderer/functions/fechas';
import { convertir_fecha_a_mes, convertir_fecha_a_semana, outTypeLoteIndicadores } from '../function';

type propsType = {
    data: outTypeLoteIndicadores[]
    agrupacion: string
}

export default function GraficoTiempoCicloLotePredio(props: propsType): JSX.Element {
    const chartRef = useRef<Chart<any> | null>(null);

    useEffect(() => {


        if (chartRef.current) {
            chartRef.current.data.labels = props.data.map(item => {
                if (props.agrupacion === 'dia') {
                    return formatearFecha(item.fecha_ingreso)
                } else if (props.agrupacion === 'semana') {
                    return convertir_fecha_a_semana(item.fecha_ingreso)
                } else if (props.agrupacion === 'mes') {
                    return convertir_fecha_a_mes(item.fecha_ingreso)
                } else {
                    return item.fecha_ingreso
                }
            });
            chartRef.current.data.datasets[0].data = props.data.map(() => 24);
            chartRef.current.data.datasets[1].data = props.data.map(item => item.total_dias);

            chartRef.current.update();
        } else {
            const canvas = document.getElementById('myChart_indicadores_operativo_tiempoCiclo_predio') as HTMLCanvasElement;
            if (canvas) {
                const ctx = canvas.getContext('2d');
                if (ctx) {
                    chartRef.current = new Chart(ctx, {
                        // NOTA: aunque definimos 'type: bar' aquí,
                        // podemos agregar datasets de tipo 'line' sin problema
                        type: 'bar',
                        data: {
                            labels: props.data.map(item => formatearFecha(item.fecha_ingreso)),
                            datasets: [
                                {
                                    label: 'Meta horas',
                                    type: 'bar',
                                    data: props.data.map(() => 24),
                                    backgroundColor: 'rgba(75, 192, 192, 0.6)',
                                    borderColor: 'rgba(75, 192, 192, 1)',
                                    borderWidth: 1,
                                },
                                {
                                    label: 'Horas entre proceso y salida',
                                    type: 'bar',
                                    data: props.data.map(item => item.total_dias),
                                    backgroundColor: 'rgba(255, 99, 132, 0.6)',
                                    borderColor: 'rgba(255, 99, 132, 1)',
                                    borderWidth: 1,
                                },
                            ]
                        },
                        options: {
                            responsive: true,
                            // Configuramos dos ejes Y: uno para las barras y otro para la línea
                            scales: {
                                x: {
                                    reverse:true,
                                    stacked: false, 
                                    ticks:{
                                        font:{
                                            size:10
                                        }
                                    },
                                    title: {
                                        display: true,
                                        text: 'Fechas'
                                    }
                                },
                                y: {
                                    stacked: false, // Apilar las barras en el eje Y
                                    title: {
                                        display: true,
                                        text: 'Horas'
                                    },
                                    // ID que usarán las barras
                                    type: 'linear',
                                    position: 'left'
                                },
                            },
                            plugins: {
                                legend: {
                                    position: 'top'
                                },
                                tooltip: {
                                    enabled: true
                                }
                            }
                        }
                    });
                }
            }
        }
    }, [props.data]);
    return (
        <div className='indicadores-operativos-eficiencia-operativa-grafica-barras-container'>
            <h2>Gráfico de tiempo ciclo lote</h2>
            <canvas id="myChart_indicadores_operativo_tiempoCiclo_predio" width="700" height="350"></canvas>
        </div>
    )
}
