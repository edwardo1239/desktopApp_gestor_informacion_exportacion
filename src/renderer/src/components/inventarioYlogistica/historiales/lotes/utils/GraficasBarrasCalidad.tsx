/* eslint-disable prettier/prettier */
import Chart from 'chart.js/auto';
import { useEffect, useRef } from 'react';
import { datosGraficasCalidad } from '../functions/functions';
import { lotesType } from '@renderer/types/lotesType';

type propsType = {
  data: lotesType[]

}

export default function GraficasBarrasCalidad(props:propsType): JSX.Element {
  const chartRef = useRef<Chart<'bar', unknown> | null>(null);
  
  useEffect(() => {
    const graficar = async (): Promise<void> => {
      const dataGrafica = datosGraficasCalidad(props.data)
    console.log(dataGrafica)
      const colorFondo =  'rgba(75, 192, 192, 0.2)'
      if (chartRef.current) {
          chartRef.current.data.labels = dataGrafica.map(item => item.nombrePredio);
          chartRef.current.data.datasets[0].data = dataGrafica.map(item => item.acidez);
          chartRef.current.data.datasets[1].data  = dataGrafica.map(item => item.brix);
          chartRef.current.data.datasets[2].data  = dataGrafica.map(item => item.ratio);
          chartRef.current.data.datasets[3].data  = dataGrafica.map(item => item.peso);
          chartRef.current.data.datasets[4].data = dataGrafica.map(item => item.zumo);
          chartRef.current.update();
        } else {
          const canvas = document.getElementById('myChart') as HTMLCanvasElement;
          if (canvas) {
              const ctx = canvas.getContext('2d');
              if (ctx) {
                  chartRef.current = new Chart(ctx, {
                      type: 'bar',
                      data: {
                        labels: dataGrafica.map(item => item.nombrePredio),
                        datasets: [
                          {
                            label: 'Acidez',
                            data: dataGrafica.map(item => item.acidez),
                            backgroundColor: colorFondo,
                            borderColor: 'rgba(75, 192, 192, 1)',
                            borderWidth: 1,
                            hidden:true,
                          },
                          {
                            label: 'Brix',
                            data: dataGrafica.map(item => item.brix),
                            backgroundColor: 'rgba(155, 155, 192, 1)',
                            borderColor: 'rgba(155, 155, 192, 1)',
                            borderWidth: 1,
                            hidden:true,
                          },
                          {
                            label: 'Ratio',
                            data: dataGrafica.map(item => item.ratio),
                            backgroundColor: 'rgba(0, 155, 192, 1)',
                            borderColor: 'rgba(0, 155, 192, 1)',
                            borderWidth: 1,
                          },
                          {
                            label: 'Peso',
                            data: dataGrafica.map(item => item.peso),
                            backgroundColor: 'rgba(155, 155, 20, 1)',
                            borderColor: 'rgba(155, 155, 20, 1)',
                            hidden:true,
                            borderWidth: 1,
                          },
                          {
                            label: 'Zumo',
                            data:  dataGrafica.map(item => item.zumo),
                            backgroundColor: 'rgba(155, 20, 180, 1)',
                            borderColor: 'rgba(155, 20, 180, 1)',
                            hidden:true,
                            borderWidth: 1,
                          },
                        ],
                      },
                      options: {
                        scales: {
                          y: {
                            beginAtZero: true,
                            title: {
                              display: true,
                              text: '',
                            },
                          },
                          x: {
                            title: {
                              display: true,
                              text: 'Predios',
                            },
                          },
                        },
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
       <canvas id="myChart" width="700" height="350"></canvas>
    </div>
  )
}
