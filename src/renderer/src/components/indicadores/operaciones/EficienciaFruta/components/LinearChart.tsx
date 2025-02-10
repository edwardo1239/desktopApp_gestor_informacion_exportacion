/* eslint-disable prettier/prettier */
import { useEffect, useRef } from "react";
import { datosExportacion } from "../types/type"
import * as echarts from 'echarts'


type propsType = {
  data: datosExportacion
}
export default function LinearChart(props: propsType): JSX.Element {
  const chartRef = useRef(null);
  useEffect(() => {
    const semanas = Object.keys(props.data)
    const frutaProcesada = Object.keys(props.data).map(semana => props.data[semana].kilosProcesados)
    const exportacion = Object.keys(props.data).map(semana => props.data[semana].kilosExportacion)
    const chartDom = chartRef.current;
    const myChart = echarts.init(chartDom)
    const option = {
      title: {
        text: 'Rendimiento fruta'
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: ['Exportación', 'Procesada']
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      toolbox: {
        feature: {
          saveAsImage: {}
        }
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: semanas
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: 'Exportación',
          type: 'line',
          stack: 'Total',
          data: exportacion
        },
        {
          name: 'Procesada',
          type: 'line',
          stack: 'Total',
          data: frutaProcesada
        },
      ]
    };
    myChart.setOption(option);
    return () => {
      myChart.dispose();
    }
  }, [props.data])

  return (
    <div ref={chartRef} style={{ width: '100%', height: '100%' }}></div>

  )
}