import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { notify } from './utils/notify';

window.notify = notify;
  

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
    <App />
  //* </React.StrictMode>
);
