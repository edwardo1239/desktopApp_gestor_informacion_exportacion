/* eslint-disable prettier/prettier */

/* eslint-disable prettier/prettier */
import Chart from 'chart.js/auto';
import {  useEffect, useRef } from 'react';
import { datosGraficaDona } from '../functions/functions';
import { lotesType } from '@renderer/types/lotesType';

type propsType = {
  data: lotesType[]

}

export default function GraficaCircular(props:propsType): JSX.Element {
  const chartRef = useRef<Chart<'doughnut', unknown> | null>(null);

  useEffect(() => {
    const graficar = async (): Promise<void> => {
      const dataGrafica = datosGraficaDona(props.data)
    console.log(dataGrafica)
      if (chartRef.current) {
          chartRef.current.data.labels = Object.keys(dataGrafica);
          chartRef.current.data.datasets[0].data = Object.values(dataGrafica);
          chartRef.current.update();
        } else {
          const canvas = document.getElementById('myChart') as HTMLCanvasElement;
          if (canvas) {
              const ctx = canvas.getContext('2d');
              if (ctx) {
                  chartRef.current = new Chart(ctx, {
                      type: 'doughnut',
                      data: {
                        labels: Object.keys(dataGrafica),
                        datasets: [
                          {
                            label: 'Porcentaje',
                            data: Object.values(dataGrafica),
                            backgroundColor: [
                                '#3498db',   // Azul
                                '#f1c40f',   // Amarillo cálido
                                '#e74c3c',   // Rojo
                                '#2ecc71',   // Verde esmeralda
                                '#f39c12',   // Naranja
                                '#e74c3c',   // Rojo
                                '#f1c40f',   // Amarillo cálido
                              ],
                            borderWidth: 1,
                          } 
                        ],
                        
                      },
                      
                      options: {
                        radius:150
             
                      },
                    });
              }
          }
        }
    } 
    graficar()
  }, [props.data])
  return (
    <div className='lotes-graficas-div'>
       <canvas id="myChart" width="400" height="350"></canvas>
    </div>
  )
}
