/* eslint-disable prettier/prettier */
import Chart from 'chart.js/auto';
import { registrosType } from '../type/type';
import { useEffect, useRef } from 'react';
import { obtenerOperarios } from '../functions/functions';

type propsType = {
  data: registrosType[]
}
export default function Graficas(props: propsType): JSX.Element {
    const chartRef = useRef<Chart<'bar', unknown> | null>(null);

    useEffect(() => {
        const datosProm = obtenerOperarios(props.data);
        const colorFondo =   'rgba(62, 79, 206, 0.6)' 
        if (chartRef.current) {
            chartRef.current.data.labels = datosProm.map(item => item.operario);
            chartRef.current.data.datasets[0].data = datosProm.map(item => item.porcentaje);
            chartRef.current.update();
          } else {
            const canvas = document.getElementById('myChart') as HTMLCanvasElement;
            if (canvas) {
                const ctx = canvas.getContext('2d');
                if (ctx) {
                    chartRef.current = new Chart(ctx, {
                        type: 'bar',
                        data: {
                          labels: datosProm.map(item => item.operario),
                          datasets: [
                            {
                              label: 'Promedio de defectos por operario',
                              data: datosProm.map(item => item.porcentaje),
                              backgroundColor: colorFondo,
                              borderColor: 'rgba(75, 192, 192, 1)',
                              borderWidth: 1,
                            },
                          ],
                        },
                        options: {
                          scales: {
                            y: {
                              beginAtZero: true,
                              min: 0,
                              max: 100,
                              title: {
                                display: true,
                                text: 'Porcentaje de defectos',
                              },
                            },
                            x: {
                              title: {
                                display: true,
                                text: 'Fechas',
                              },
                            },
                          },
                        },
                      });
                }
            }
          }


    }, [props.data])
    return (
        <div className='volante-calidad-div-graficas-container'>
            <h2>Gráfico de Porcentaje de Defectos por Operario</h2>
            <canvas id="myChart" width="200" height="100"></canvas>
        </div>
    )
}
