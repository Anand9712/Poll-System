import React, { useState } from 'react';
import axios from 'axios';

function PollStation() {
  const [name, setName] = useState('');
  const [choice, setChoice] = useState(true);
  const [date, setDate] = useState('');

  const submitVote = async () => {
    try {
      const response = await axios.post('http://localhost:3000/vote', {
        name,
        voting_choice: choice,
        casted_at: date,
      });
      console.log(response.data);
    } catch (error) {
      console.error('Error submitting vote:', error);
    }
  };

  return (
    <div>
      <h2>Poll Station</h2>
      <form>
        <label>
          Name:
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <br />
        <label>
          Vote Choice:
          <select value={choice} onChange={(e) => setChoice(e.target.value === 'true')}>
            <option value={true}>Yes</option>
            <option value={false}>No</option>
          </select>
        </label>
        <br />
        <label>
          Date of Submission:
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </label>
        <br />
        <button type="button" onClick={submitVote}>
          Submit Vote
        </button>
      </form>
    </div>
  );
}

export default PollStation;
