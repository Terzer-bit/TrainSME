import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './Metrics.css';
import Menu from '../components/Menu';


function Metrics() {

  const [chartData, setChartData] = useState([]);
  const [totalTests, setTotalTests] = useState(0);
  const [passedTests, setPassedTests] = useState(0);
  const [acedTests, setAcedTests] = useState(0);
  const [passedLast, setPassedLast] = useState(0);

  const [passedRate, setPassedRate] = useState(0);
  const [acedRate, setAcedRate] = useState(0);
  const [improvementRate, setImprovementRate] = useState(0);  


  const computeStats = () => {
    setPassedRate( totalTests > 0 ? (passedTests / totalTests * 100).toFixed(1) : "0.0");
    setAcedRate( passedTests > 0 ? (acedTests / passedTests * 100).toFixed(1) : "0.0");
    setImprovementRate( passedLast > 0 ? ( passedTests/ passedLast * 100).toFixed(1): "0");
  };

  const renderBarChart = (data) => {
    // Initialize month counters
    const monthMap = {
      Jan: { total: 0, passed: 0, aced: 0 },
      Feb: { total: 0, passed: 0, aced: 0 },
      Mar: { total: 0, passed: 0, aced: 0 },
      Apr: { total: 0, passed: 0, aced: 0 },
      May: { total: 0, passed: 0, aced: 0 },
      Jun: { total: 0, passed: 0, aced: 0 },
      Jul: { total: 0, passed: 0, aced: 0 },
      Aug: { total: 0, passed: 0, aced: 0 },
      Sep: { total: 0, passed: 0, aced: 0 },
      Oct: { total: 0, passed: 0, aced: 0 },
      Nov: { total: 0, passed: 0, aced: 0 },
      Dec: { total: 0, passed: 0, aced: 0 }
    };
  
    // Count tests
    data.tests.forEach(test => {
      const date = new Date(test.test_date);
      const monthName = date.toLocaleString('en-US', { month: 'short' });
  
      monthMap[monthName].total++;
      if (test.correct_answers >= 5) {
        monthMap[monthName].passed++;
      }
      if (test.correct_answers === 10) {
        monthMap[monthName].aced++;
      }
    });
  
    // Format for chart
    const chartFormatted = Object.entries(monthMap).map(([name, { total }]) => ({
      name,
      tests: total
    }));
  
    setChartData(chartFormatted);
  
    const currentMonthName = new Date().toLocaleString('en-US', { month: 'short' });
    const currentMonthData = monthMap[currentMonthName];
  
    // No NaN protection here
    setTotalTests(currentMonthData.total);
    setPassedTests(currentMonthData.passed);
    setAcedTests(currentMonthData.aced);
  
    const previousMonthIndex = (new Date().getMonth() + 11) % 12;
    const previousMonthName = new Date(0, previousMonthIndex).toLocaleString('en-US', { month: 'short' });
    const previousMonthData = monthMap[previousMonthName];
  
    // Set last month’s passed tests (>=5)
    setPassedLast(previousMonthData.passed);
  };
  
  
  useEffect(() => {
    computeStats();
  }, [totalTests, passedTests, acedTests, passedLast]);


  const fetchResults = async () => {
    try {
      const user_id = localStorage.getItem('user_id');
      const response = await fetch('http://localhost:5000/api/metrics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ user_id })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json(); // expecting { tests: [...] }
      renderBarChart(data);

    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };


  useEffect(() => {
    fetchResults();
  }, []);

  return (
    <>
      <div className="metrics-page">
        <Menu />
        <div className="metrics-content">
          <div className="analysis-section">
            <h2 className="chart-title">Amount of tests done</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis dataKey="name" stroke="#aaa" />
                <YAxis stroke="#aaa" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#333', border: 'none', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                  labelStyle={{ color: '#aaa' }}
                />
                <Bar dataKey="tests" fill="#d9232d" barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="summary-section aspect-[1/1]">
            <div className="summary-box">
              <p className="summary-title">Passed tests</p>
              <p className="main-stat">{passedTests}</p>
              <p className="secondary-stat">{passedRate}% this month</p>
            </div>
            <div className="summary-box aspect-[1/1]">
              <p className="summary-title">Aced tests</p>
              <p className="main-stat">{acedTests}</p>
              <p className="secondary-stat">{acedRate}% this month</p>
            </div>
            <div className="summary-box aspect-[1/1]">
              <p className="summary-title">Improvement rate</p>
              <p className="main-stat">{improvementRate}%</p>
              <p className="secondary-stat">{passedTests} vs {passedLast} last month</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Metrics;
