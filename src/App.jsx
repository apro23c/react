import React, { useState, useEffect } from 'react';
import axios from 'axios';
import StockCard from './StockCard';
// 1. 방금 만든 Zustand 저장소를 불러옵니다.
import useThemeStore from './store';

const API_KEY = import.meta.env.VITE_FINNHUB_API_KEY; 

function App() {
  // 1. 초기값을 그냥 배열로 넣는 대신, 로컬 스토리지에 저장된 값이 있으면 그걸 쓰고, 없으면 기본 배열을 씁니다.
  const [symbols, setSymbols] = useState(() => {
    const savedSymbols = localStorage.getItem('my-stocks');
    // 로컬 스토리지에는 텍스트(문자열)로만 저장되기 때문에 JSON.parse로 다시 배열로 바꿔줍니다.
    return savedSymbols ? JSON.parse(savedSymbols) : ['AAPL', 'MSFT', 'TSLA', 'GOOGL', 'AMZN', 'NVDA'];
  });
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newSymbol, setNewSymbol] = useState('');

  // 2. 저장소에서 다크모드 상태와 변경 함수를 꺼내옵니다. (Props로 전달받지 않아도 됩니다!)
  const { isDarkMode, toggleDarkMode } = useThemeStore();

  // 2. symbols 배열이 변경될 때마다 그 값을 로컬 스토리지에 텍스트 형태로 저장(JSON.stringify)하는 로직을 추가합니다.
  useEffect(() => {
    localStorage.setItem('my-stocks', JSON.stringify(symbols));
  }, [symbols]);

  const fetchStockData = async (currentSymbols) => {
    /* 기존과 동일 (생략하지 않고 그대로 두시면 됩니다!) */
    try {
      const promises = currentSymbols.map(symbol =>
        axios.get(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${API_KEY}`)
      );
      const responses = await Promise.all(promises);
      const stockData = responses.map((res, index) => ({
        symbol: currentSymbols[index],
        ...res.data
      }));
      setStocks(stockData);
    } catch (error) {
      console.error("데이터 로딩 실패:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStockData(symbols);
    const interval = setInterval(() => {
      fetchStockData(symbols);
    }, 10000);
    return () => clearInterval(interval);
  }, [symbols]);

  const handleAddSymbol = (e) => {
    e.preventDefault();
    const upperSymbol = newSymbol.toUpperCase().trim();
    if (upperSymbol && !symbols.includes(upperSymbol)) {
      setSymbols([...symbols, upperSymbol]);
      setNewSymbol('');
      setLoading(true);
    }
  };

  if (loading && stocks.length === 0) return <div className="flex justify-center items-center h-screen text-xl">데이터 로딩 중...</div>;

  return (
    // 3. isDarkMode 값에 따라 최상위 부모의 배경색과 글자색을 다르게 적용합니다.
    <div className={`min-h-screen py-12 px-6 font-sans transition-colors duration-300 ${isDarkMode ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-800'}`}>
      <div className="max-w-6xl mx-auto relative">
        
        {/* 다크 모드 토글 버튼 */}
        <button 
          onClick={toggleDarkMode}
          className={`absolute top-0 right-0 px-4 py-2 rounded-full font-bold shadow-md transition-colors ${isDarkMode ? 'bg-yellow-400 text-slate-900' : 'bg-slate-800 text-white'}`}
        >
          {isDarkMode ? '☀️ 라이트 모드' : '🌙 다크 모드'}
        </button>

        <h2 className="text-4xl font-extrabold mb-2 tracking-tight">미국 주식 실시간 대시보드 🇺🇸</h2>
        <p className={`mb-8 text-lg ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
          내 관심 종목의 현재 시세와 변동률을 확인하세요.
        </p>
        
        <form onSubmit={handleAddSymbol} className="flex gap-4 mb-10">
          <input 
            type="text" 
            placeholder="티커 입력 (예: NFLX)" 
            value={newSymbol}
            onChange={(e) => setNewSymbol(e.target.value)}
            className={`flex-1 max-w-sm px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all uppercase ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-400' : 'bg-white border-gray-300'}`}
          />
          <button type="submit" className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-sm hover:bg-blue-700 cursor-pointer">
            종목 추가
          </button>
        </form>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stocks.map((stock) => (
            <StockCard key={stock.symbol} stock={stock} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;