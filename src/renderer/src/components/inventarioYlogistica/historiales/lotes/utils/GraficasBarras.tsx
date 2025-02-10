/* eslint-disable prettier/prettier */
import Chart from 'chart.js/auto';
import { useEffect, useRef } from 'react';
import { datosGraficas } from '../functions/functions';
import { lotesType } from '@renderer/types/lotesType';
type propsType = {
  data: lotesType[]

}
export default function GraficasBarras(props:propsType): JSX.Element {
  const chartRef = useRef<Chart<'bar', unknown> | null>(null);
  
  useEffect(() => {
    const graficar = async (): Promise<void> => {
      const dataGrafica = datosGraficas(props.data)
      const colorFondo = 'rgba(62, 79, 206, 0.6)' 
      if (chartRef.current) {
          chartRef.current.data.labels = dataGrafica.map(item => item.nombrePredio);
          chartRef.current.data.datasets[0].data = dataGrafica.map(item => item.kilos);
          chartRef.current.data.datasets[1].data = dataGrafica.map(item => item.kilosVaciados);
          chartRef.current.data.datasets[2].data = dataGrafica.map(item => item.descarteLavado);
          chartRef.current.data.datasets[3].data = dataGrafica.map(item => item.descarteEncerado);
          chartRef.current.data.datasets[4].data = dataGrafica.map(item => item.exportacion);
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
                            label: 'Kilos',
                            data: dataGrafica.map(item => item.kilos),
                            backgroundColor: colorFondo,
                            borderColor: 'rgba(75, 192, 192, 1)',
                            borderWidth: 1,
                          },
                          {
                            label: 'Kilos Vaciados',
                            data: dataGrafica.map(item => item.kilosVaciados),
                            backgroundColor: 'rgba(155, 155, 192, 1)',
                            borderColor: 'rgba(155, 155, 192, 1)',
                            borderWidth: 1,
                          },
                          {
                            label: 'Descarte Lavado',
                            data: dataGrafica.map(item => item.descarteLavado),
                            backgroundColor: 'rgba(0, 155, 192, 1)',
                            borderColor: 'rgba(0, 155, 192, 1)',
                            borderWidth: 1,
                          },
                          {
                            label: 'Descarte Encerado',
                            data: dataGrafica.map(item => item.descarteEncerado),
                            backgroundColor: 'rgba(155, 155, 20, 1)',
                            borderColor: 'rgba(155, 155, 20, 1)',
                            borderWidth: 1,
                          },
                          {
                            label: 'Exportacion',
                            data:  dataGrafica.map(item => item.exportacion),
                            backgroundColor: 'rgba(155, 20, 180, 1)',
                            borderColor: 'rgba(155, 20, 180, 1)',
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
                              text: 'kilos',
                            },
                          },
                          x: {
                            title: {
                              display: true,
                              text: 'Lotes',
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
