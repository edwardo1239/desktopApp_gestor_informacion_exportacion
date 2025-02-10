/* eslint-disable prettier/prettier */
import { useEffect, useRef } from "react";
import { datosExportacion } from "../types/type"
import * as echarts from 'echarts'
import { promedioResultado } from "../services/function";

type propsType = {
    data: datosExportacion
}
export default function GaugeChart(props: propsType): JSX.Element {
    const chartRef = useRef(null);
    useEffect(() => {
        const promedio = promedioResultado(props.data)
        const chartDom = chartRef.current;
        const myChart = echarts.init(chartDom)
        const option = {
            series: [
              {
                type: 'gauge',
                startAngle: 180,
                endAngle: 0,
                min: 0,
                max: 100,
                splitNumber: 10,
                itemStyle: {
                  color: '#7d9f3a',
                  shadowColor: 'rgba(0,138,255,0.45)',
                  shadowBlur: 10,
                  shadowOffsetX: 2,
                  shadowOffsetY: 2
                },
                progress: {
                  show: true,
                  roundCap: true,
                  width: 18
                },
                pointer: {
                  icon: 'path://M2090.36389,615.30999 L2090.36389,615.30999 C2091.48372,615.30999 2092.40383,616.194028 2092.44859,617.312956 L2096.90698,728.755929 C2097.05155,732.369577 2094.2393,735.416212 2090.62566,735.56078 C2090.53845,735.564269 2090.45117,735.566014 2090.36389,735.566014 L2090.36389,735.566014 C2086.74736,735.566014 2083.81557,732.63423 2083.81557,729.017692 C2083.81557,728.930412 2083.81732,728.84314 2083.82081,728.755929 L2088.2792,617.312956 C2088.32396,616.194028 2089.24407,615.30999 2090.36389,615.30999 Z',
                  length: '75%',
                  width: 16,
                  offsetCenter: [0, '5%']
                },
                axisLine: {
                  roundCap: true,
                  lineStyle: {
                    width: 18
                  }
                },
                axisTick: {
                  splitNumber: 2,
                  lineStyle: {
                    width: 2,
                    color: '#999'
                  }
                },
                splitLine: {
                  length: 1,
                  lineStyle: {
                    width: 3,
                    color: '#999'
                  }
                },
                axisLabel: {
                  distance: 30,
                  color: '#999',
                  fontSize: 14
                },
                title: {
                  show: false
                },
                detail: {
                  backgroundColor: '#fff',
                  borderColor: '#999',
                  borderWidth: 2,
                  width: '60%',
                  lineHeight: 45,
                  height: 45,
                  borderRadius: 8,
                  offsetCenter: [0, '35%'],
                  valueAnimation: true,
                  formatter: function (): string {
                    return '{value|' + promedio.toFixed(0) + '}{unit|%}';
                  },
                  rich: {
                    value: {
                      fontSize: 40,
                      fontWeight: 'bolder',
                      color: '#777'
                    },
                    unit: {
                      fontSize: 20,
                      color: '#999',
                      padding: [0, 0, -20, 10]
                    }
                  }
                },
                data: [
                  {
                    value: promedio
                  }
                ]
              }
            ]
          };
        myChart.setOption(option);
        return () => {
            myChart.dispose();
        }
    }, [props.data])
    return (
        <div ref={chartRef} style={{ width: '100%', height: '100%', margin:0, padding:0 }}></div>
    )
}