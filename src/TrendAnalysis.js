import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line, Bar } from 'react-chartjs-2';

function TrendAnalysis() {
  const [voteData, setVoteData] = useState([]);
  const [lineChartData, setLineChartData] = useState([]);
  const [barChartData, setBarChartData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tableResponse = await axios.get('http://localhost:3000/data');
        setVoteData(tableResponse.data.data);

        const trueVotesResponse = await axios.get('http://localhost:3000/counts?voting_choice=true');
        const falseVotesResponse = await axios.get('http://localhost:3000/counts?voting_choice=false');

        setLineChartData({
          labels: trueVotesResponse.data.data.map(entry => entry.casted_at),
          datasets: [
            {
              label: 'True Votes',
              fill: false,
              borderColor: 'rgb(75, 192, 192)',
              data: trueVotesResponse.data.data.map(entry => entry.count),
            },
            {
              label: 'False Votes',
              fill: false,
              borderColor: 'rgb(255, 99, 132)',
              data: falseVotesResponse.data.data.map(entry => entry.count),
            },
          ],
        });

        const barGraphResponse = await axios.get('http://localhost:3000/results');
        setBarChartData({
          labels: barGraphResponse.data.data.map(entry => entry.voting_choice ? 'Yes' : 'No'),
          datasets: [
            {
              label: 'Vote Counts',
              backgroundColor: ['rgb(75, 192, 192)', 'rgb(255, 99, 132)'],
              data: barGraphResponse.data.data.map(entry => entry.count),
            },
          ],
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

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
        <Line data={lineChartData} />
      </div>

      <div>
        <h3>Bar Graph</h3>
        <Bar data={barChartData} />
      </div>
    </div>
  );
}

export default TrendAnalysis;
