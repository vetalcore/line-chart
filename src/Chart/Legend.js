const Legend = ({ charts = [], onToggleChart }) => {
  return (<div>
    {
      charts.map(chartName => (
        <div key={chartName}>
          <label htmlFor={chartName}>{chartName}</label>
          <input onChange={e => onToggleChart(chartName, e.target.checked)} type="checkbox" name={chartName} id={chartName} />
        </div>
      ))
    }
  </div>);
};

export default Legend;
