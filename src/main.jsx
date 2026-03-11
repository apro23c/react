import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom'; // 1. 라우터 불러오기

ReactDOM.createRoot(document.getElementById('root')).render(
  // 2. App 컴포넌트를 BrowserRouter로 감싸줍니다.
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
