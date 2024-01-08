import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line, Bar } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, Title } from 'chart.js';

Chart.register(CategoryScale, LinearScale, Title);

function TrendAnalysis() {
  const [voteData, setVoteData] = useState([]);
  const [lineChartData, setLineChartData] = useState({});
  const [barChartData, setBarChartData] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tableResponse = await axios.get('http://localhost:3000/data');
        setVoteData(tableResponse.data.data);

        const trueVotesResponse = await axios.get('http://localhost:3000/counts?voting_choice=true');
        const falseVotesResponse = await axios.get('http://localhost:3000/counts?voting_choice=false');

        setLineChartData({
          labels: trueVotesResponse.data.data ? trueVotesResponse.data.data.map(entry => entry.casted_at) : [],
          datasets: [
            {
              label: 'True Votes',
              fill: false,
              borderColor: 'rgb(75, 192, 192)',
              data: trueVotesResponse.data.data ? trueVotesResponse.data.data.map(entry => entry.count) : [],
            },
            {
              label: 'False Votes',
              fill: false,
              borderColor: 'rgb(255, 99, 132)',
              data: falseVotesResponse.data.data ? falseVotesResponse.data.data.map(entry => entry.count) : [],
            },
          ],
        });

        setBarChartData({
          labels: ['Yes', 'No'],
          datasets: [
            {
              label: 'Vote Counts',
              backgroundColor: ['rgb(75, 192, 192)', 'rgb(255, 99, 132)'],
              data: trueVotesResponse.data.data ? trueVotesResponse.data.data.map(entry => entry.count) : [],
            },
          ],
        });
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error);
      }
    };

    fetchData();
  }, []);

  if (error) {
    return (
      <div>
        <h2>Error</h2>
        <p>An error occurred while fetching data. Please try again later.</p>
      </div>
    );
  }

  return (
    <div>
      <h2>Trend Analysis</h2>

      <div>
        <h3>Vote Data Table</h3>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Vote Choice</th>
              <th>Date of Submission</th>
            </tr>
          </thead>
          <tbody>
            {voteData.map((vote) => (
              <tr key={vote.id}>
                <td>{vote.id}</td>
                <td>{vote.name}</td>
                <td>{vote.voting_choice ? 'Yes' : 'No'}</td>
                <td>{vote.casted_at}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div>
        <h3>Line Chart</h3>
        {lineChartData.labels && lineChartData.labels.length > 0 ? (
          <Line data={lineChartData} />
        ) : (
          <p>No data available for the Line Chart</p>
        )}
      </div>

      <div>
        <h3>Bar Graph</h3>
        {barChartData.labels && barChartData.labels.length > 0 ? (
          <Bar
            data={barChartData}
            options={{
              scales: {
                x: {
                  type: 'category',
                  labels: ['yes','no'],
                  beginAtZero: true,
                },
                y: {
                  beginAtZero: true,
                },
              },
            }}
          />
        ) : (
          <p>No data available for the Bar Graph</p>
        )}
      </div>
    </div>
  );
}

export default TrendAnalysis;
