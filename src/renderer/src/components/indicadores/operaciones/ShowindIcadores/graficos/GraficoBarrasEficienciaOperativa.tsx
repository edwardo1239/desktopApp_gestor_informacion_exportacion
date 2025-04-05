/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Chart from 'chart.js/auto';
import { indicadoresType } from "@renderer/types/indicadoresType"
import { useEffect, useRef } from "react";
import { formatearFecha } from '@renderer/functions/fechas';
import { convertir_fecha_a_mes, convertir_fecha_a_semana, eficiencia_operativa } from '../function';

type propsType = {
    data: indicadoresType[]
    agrupacion: string
}

export default function GraficoBarrasEficienciaOperativa(props: propsType): JSX.Element {
    const chartRef = useRef<Chart<any> | null>(null);

    useEffect(() => {


        if (chartRef.current) {
            chartRef.current.data.labels = props.data.map(item => {
                if (props.agrupacion === 'dia') {
                    return formatearFecha(item.fecha_creacion)
                } else if (props.agrupacion === 'semana') {
                    return convertir_fecha_a_semana(item.fecha_creacion)
                } else if (props.agrupacion === 'mes') {
                    return convertir_fecha_a_mes(item.fecha_creacion)
                } else {
                    return item.fecha_creacion
                }
            });
            chartRef.current.data.datasets[0].data = props.data.map(item => item.kilos_procesador);
            chartRef.current.data.datasets[1].data = props.data.map(item => item.meta_kilos_procesados - item.kilos_procesador);
            // Actualizamos el dataset de la línea (porcentaje)
            chartRef.current.data.datasets[2].data = props.data.map(item => {
                return eficiencia_operativa(
                    item.kilos_procesador,
                    item.meta_kilos_procesados,
                    item.total_horas_hombre
                )
            });

            chartRef.current.update();
        } else {
            const canvas = document.getElementById('myChart_indicadores_operativo_eficiencia_operativa') as HTMLCanvasElement;
            if (canvas) {
                const ctx = canvas.getContext('2d');
                if (ctx) {
                    chartRef.current = new Chart(ctx, {
                        // NOTA: aunque definimos 'type: bar' aquí,
                        // podemos agregar datasets de tipo 'line' sin problema
                        type: 'bar',
                        data: {
                            labels: props.data.map(item => formatearFecha(item.fecha_creacion)),
                            datasets: [
                                {
                                    label: 'Kilos procesados',
                                    type: 'bar',
                                    data: props.data.map(item => item.kilos_procesador),
                                    backgroundColor: 'rgba(75, 192, 192, 0.6)',
                                    borderColor: 'rgba(75, 192, 192, 1)',
                                    borderWidth: 1,
                                    stack: 'Stack 1' // Agrupación para las barras
                                },
                                {
                                    label: 'Meta Kilos',
                                    type: 'bar',
                                    data: props.data.map(item => item.meta_kilos_procesados - item.kilos_procesador),
                                    backgroundColor: 'rgba(255, 99, 132, 0.6)',
                                    borderColor: 'rgba(255, 99, 132, 1)',
                                    borderWidth: 1,
                                    stack: 'Stack 1'
                                },
                                {
                                    label: 'Eficiencia (%)',
                                    type: 'line',
                                    data: props.data.map(item => {
                                        return eficiencia_operativa(
                                            item.kilos_procesador,
                                            item.meta_kilos_procesados,
                                            item.total_horas_hombre
                                        )
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
                            // Configuramos dos ejes Y: uno para las barras y otro para la línea
                            scales: {
                                x: {
                                    reverse:true,
                                    stacked: true, // Apilar las barras en el eje X
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
                                    stacked: true, // Apilar las barras en el eje Y
                                    title: {
                                        display: true,
                                        text: 'Kilos procesados'
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
                                        text: 'Porcentaje de Eficiencia (%)'
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
            <h2>Gráfico de fruta procesada</h2>
            <canvas id="myChart_indicadores_operativo_eficiencia_operativa" width="700" height="350"></canvas>
        </div>
    )
}
