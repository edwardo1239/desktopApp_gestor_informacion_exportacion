/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Chart from 'chart.js/auto';
import { useEffect, useRef } from "react";
import { formatearFecha } from '@renderer/functions/fechas';
import { convertir_fecha_a_mes, convertir_fecha_a_semana } from '../function';
import { volanteCalidadType } from '@renderer/types/formulariosCalidad';

type propsType = {
    data: volanteCalidadType[]
    agrupacion: string
}

export default function GraficoBarrasNoCalidad(props: propsType): JSX.Element {
    const chartRef = useRef<Chart<any> | null>(null);

    useEffect(() => {


        if (chartRef.current) {
            chartRef.current.data.labels = props.data.map(item => {
                if (props.agrupacion === 'dia') {
                    return formatearFecha(item.fecha)
                } else if (props.agrupacion === 'semana') {
                    return convertir_fecha_a_semana(item.fecha)
                } else if (props.agrupacion === 'mes') {
                    return convertir_fecha_a_mes(item.fecha)
                } else {
                    return item.fecha
                }
            });
            chartRef.current.data.datasets[0].data = props.data.map(item => item.unidades);
            chartRef.current.data.datasets[1].data = props.data.map(item => item.defectos);
            chartRef.current.data.datasets[2].data = props.data.map(item => {
                if (item.unidades === 0) return 'NaN'

                else {
                    return ((item.defectos * 100) / item.unidades)
                }
            });

            chartRef.current.update();
        } else {
            const canvas = document.getElementById('myChart_indicadores_operativo_noCalidad') as HTMLCanvasElement;
            if (canvas) {
                const ctx = canvas.getContext('2d');
                if (ctx) {
                    chartRef.current = new Chart(ctx, {
                        // NOTA: aunque definimos 'type: bar' aquí,
                        // podemos agregar datasets de tipo 'line' sin problema
                        type: 'bar',
                        data: {
                            labels: props.data.map(item => formatearFecha(item.fecha)),
                            datasets: [
                                {
                                    label: 'Meta horas',
                                    type: 'bar',
                                    data: props.data.map(item => item.unidades),
                                    backgroundColor: 'rgba(75, 192, 192, 0.6)',
                                    borderColor: 'rgba(75, 192, 192, 1)',
                                    borderWidth: 1,
                                },
                                {
                                    label: 'Horas entre proceso y salida',
                                    type: 'bar',
                                    data: props.data.map(item => item.defectos),
                                    backgroundColor: 'rgba(255, 99, 132, 0.6)',
                                    borderColor: 'rgba(255, 99, 132, 1)',
                                    borderWidth: 1,
                                },
                                {
                                    label: 'No Calidad (%)',
                                    type: 'line',
                                    data:props.data.map(item => {
                                        if (item.unidades === 0) return 'NaN'
                        
                                        else {
                                            return ((item.defectos * 100) / item.unidades)
                                        }
                                    }),
                                    borderColor: 'rgba(255, 206, 86, 1)',
                                    backgroundColor: 'rgba(255, 206, 86, 0.2)',
                                    yAxisID: 'y1', // Eje secundario
                                    tension: 0.2    // Suaviza la línea (opcional)
                                }
                            ]
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: true,
                            devicePixelRatio: 2,
                            // Configuramos dos ejes Y: uno para las barras y otro para la línea
                            scales: {
                                x: {
                                    reverse: true,
                                    stacked: false,
                                    ticks: {
                                        font: {
                                            size: 10
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
                                        text: 'Unidades'
                                    },
                                    // ID que usarán las barras
                                    type: 'linear',
                                    position: 'left'
                                },
                                y1: {
                                    stacked: false,  // La línea no se apila
                                    type: 'linear',
                                    position: 'right',
                                    title: {
                                        display: true,
                                        text: 'Porcentaje de no calidad (%)'
                                    },
                                    // Si tu porcentaje ronda entre 0 y 1, ajusta los rangos:
                                    suggestedMin: 0,
                                    suggestedMax: 1
                                }
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
            <h2>Gráfico de No calidad</h2>
            <canvas id="myChart_indicadores_operativo_noCalidad" width="700" height="350"></canvas>
        </div>
    )
}
