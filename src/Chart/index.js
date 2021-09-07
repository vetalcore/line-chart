import React, { useState, useEffect, useCallback } from 'react';
import Chart from "./Chart";
import Legend from "./Legend";
import { fetchData } from '../helpers';

const generateLegendObject = numOfLines => (
  Array.from({ length: numOfLines }).reduce((acc, val, index) => ({ ...acc, [`Chart ${index}`]: false }), {})
);
const getActiveCharts = (legendObj) => Object.keys(legendObj).filter(key => legendObj[key]);
const getTimeStamp = () => new Date().toISOString().substr(11, 8);

const ChartWhitDataAndlegend = ({ numOfLines = 1 }) => {
  const [legendObj, setLegendObj] = useState(generateLegendObject(numOfLines));
  const [data, setData] = useState([]);

  const onToggleChart = useCallback(async (name, checked) => {
    const updates = await fetchData(10);
    const timeStamp = getTimeStamp();

    if (checked && (name in legendObj)) {
      setData(prevData => Array.from({ length: 10 }).map((item, index) => ({
        ...prevData[index] && prevData[index],
        [name]: updates[index],
        name: timeStamp,
      })));
    }

    setLegendObj(prevVal => ({
      ...prevVal,
      [name]: checked,
    }));

  }, [setLegendObj, legendObj]);

  const updateChart = useCallback(async () => {
    const activeCharts = getActiveCharts(legendObj)
    if (!activeCharts.length) return;

    const updates = await fetchData(activeCharts.length);
    const timeStamp = getTimeStamp();;

    const diff = activeCharts.reduce((acc, chartName, index) => (
      {
        ...acc,
        [chartName]: updates[index]
      }
    ), { name: timeStamp });

    setData(prevData => [...prevData.slice(prevData.length < 10 ? 0 : 1, 10), diff]);
  }, [legendObj]);

  useEffect(() => {
    const activeCharts = getActiveCharts(legendObj)

    let intervalId;
    if (activeCharts.length) {
      intervalId = setInterval(updateChart, 1000);
    }

    return () => {
      clearInterval(intervalId);
    }
  }, [updateChart, legendObj]);

  const chartNames = Object.keys(legendObj);

  return (
    <>
      <Chart data={data} keys={chartNames} />
      <Legend charts={chartNames} onToggleChart={onToggleChart} />
    </>
  );
}

export default ChartWhitDataAndlegend;
