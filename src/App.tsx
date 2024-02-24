import React, { useEffect, useState } from 'react';
import { Theme, presetGpnDefault } from "@consta/uikit/Theme";
// import { mockData } from './data/data';
import ChoiceGroupCurrencies from './component/ChoiceGroupCurrencies';
import { ReactECharts } from './Echarts/ReactECharts';
import { Layout } from '@consta/uikit/Layout';
import './style.css'
import { ChoiceGroup } from '@consta/uikit/ChoiceGroup';
import axios from 'axios';

export interface ICurrencies {
  date: string;
  month: string;
  indicator: string;
  value: number;
}

export interface IItems {
  sign: string;
  description: string;
  max: number;
  min: number;
}

const items: IItems[] = [
  {
    sign: '$',
    description: 'Курс доллара',
    max: 84,
    min: 72
  },
  {
    sign: '€',
    description: 'Курс евро',
    max: 94,
    min: 86
  },
  {
    sign: '¥',
    description: 'Курс юаня',
    max: 26,
    min: 18
  }];
function App() {
  const [value, setValue] = useState<IItems | null>(items[0]);
  const [arrayCurrency, setArrayCurrency] = useState<ICurrencies[]>([])
  const [mockData, setMockData] = useState<ICurrencies[]>([])
  let getData = async () => {
    let response = await axios.get<ICurrencies[]>('https://65d9d039bcc50200fcdc2686.mockapi.io/api/v1/info-currencies');
    setMockData(response.data);
    setArrayCurrency([...response.data.filter((dollar: ICurrencies) => dollar.indicator === value?.description)])
  }

  useEffect(() => {
    getData();
    console.log(1);
  }, []);

  useEffect(() => {
    setArrayCurrency([...mockData.filter((dollar: ICurrencies) => dollar.indicator === value?.description)])
    console.log(2);
  }, [value]);

  const option= {
    tooltip: {
      trigger: 'axis',
    },
    legend: {
      show: false,
    },
    xAxis: {
      type: 'category',
      axisTick: {
        alignWithLabel: true,
        show: false,
      },
      boundaryGap: false,
      axisLine: {
        lineStyle: {
          type: 'dashed'
        }
      },
      data: [...mockData.filter((dollar: ICurrencies) => dollar.indicator === 'Курс доллара').map((dollar: ICurrencies) => dollar.month)],
    },
    yAxis: {
      type: 'value',
      min: value?.min,
      max: value?.max,
      splitNumber: 4,
      splitLine: {
        show: true,
        lineStyle: {
          type: 'dashed',
        }
      },
      axisLabel:{
        formatter:function(value:string, index:number){
          if(index === 0){
            return ''
          }else{
            return value;
          }
        }
      }
    },
    series: [
      {
        name: value?.description,
        type: 'line',
        showSymbol: false,
        legendHoverLink: false,
        color: ['#F38B00'],
        data: [...mockData.filter((dollar: ICurrencies) => dollar.indicator === value?.description).map((dollar: ICurrencies) => dollar.value)],
      },
    ],
    title: {
      text: `${value?.description.toUpperCase()}, ${value?.sign}/₽`,
      textStyle:{
        fontFamily: "Inter, sans-serif",
        fontWeight: 'bold'
      }
    },
  };

  return (
    <Theme className="App-container" preset={presetGpnDefault}>
      <div className="wrapper">
        <Layout>
          <Layout flex={5} onClick={() => console.log(arrayCurrency)}>
            <ReactECharts style={{ height: '400px' }} option={option} />
          </Layout>
          <Layout className={'infoBar'} flex={1}>
            <div className="choice__container">
              <ChoiceGroup
                value={value}
                onChange={({value}) => setValue(value)}
                name="ChoiceGroupCurrencies"
                items={items}
                getItemLabel={(item) => item.sign}
                multiple={false}
                size={'xs'}
              />
            </div>
            <div className="average">
              <div className="average__title">Среднее за период</div>
              <div className="average__const">{((arrayCurrency.reduce((accumulator, currentValue) => accumulator + currentValue.value, 0)) / arrayCurrency.length).toFixed(1) }<span>₽</span></div>
            </div>
          </Layout>
        </Layout>
      </div>
    </Theme>
  );
}

export default App;
