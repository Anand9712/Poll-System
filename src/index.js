
import React from 'react';
// import ReactDOM from 'react-dom';
import { createRoot } from "react-dom/client";
import App from './App';
import { Chart, registerables } from 'chart.js';  // Import registerables

// Register the necessary elements globally
Chart.register(...registerables);

createRoot(document.getElementById('root')).render(<App />);
