/* eslint-disable prettier/prettier */
import { useEffect, useRef } from "react";
import { datosExportacion } from "../types/type"
import * as echarts from 'echarts'

type propsType = {
    data: datosExportacion
}
export default function BarChart(props:propsType):JSX.Element{
    const chartRef = useRef(null);
    useEffect(()=>{
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
              trigger: 'axis',
              axisPointer: {
                type: 'shadow'
              }
            },
            legend: {},
            grid: {
              left: '3%',
              right: '4%',
              bottom: '3%',
              containLabel: true
            },
            xAxis: {
              type: 'value',
              boundaryGap: [0, 0.01]
            },
            yAxis: {
              type: 'category',
              data: semanas
            },
            series: [
                {
                    name: 'Exportación',
                    type: 'bar',
                    data: exportacion
                  },
                  {
                    name: 'Procesada',
                    type: 'bar',
                    data: frutaProcesada
                  },
            ]
          };
          myChart.setOption(option);
          return () => {
            myChart.dispose();
          }
    },[props.data])

    return(
        <div ref={chartRef} style={{ width: '100%', height: '100%' }}></div>

    )
}