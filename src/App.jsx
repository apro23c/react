import React, { useState, useEffect } from 'react';
import axios from 'axios';
import StockCard from './StockCard';

const API_KEY = import.meta.env.VITE_FINNHUB_API_KEY; 

function App() {
  // 1. 고정되어 있던 종목 배열을 State로 변경하여 동적으로 추가할 수 있게 만듭니다.
  const [symbols, setSymbols] = useState(['AAPL', 'MSFT', 'TSLA', 'GOOGL', 'AMZN', 'NVDA']);
  
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // 2. 검색창에 입력할 새로운 티커(종목코드)를 관리할 State입니다.
  const [newSymbol, setNewSymbol] = useState('');

  // 3. 데이터를 불러오는 함수를 useEffect 밖으로 분리했습니다.
  const fetchStockData = async (currentSymbols) => {
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
    // 최초 화면 진입 시 즉시 데이터를 한 번 불러옵니다.
    fetchStockData(symbols);

    // 4. 실시간 자동 새로고침(Polling) 마법! setInterval을 사용해 10초마다 함수를 재실행합니다.
    const interval = setInterval(() => {
      console.log("실시간 데이터 갱신 중...");
      fetchStockData(symbols);
    }, 10000); // 10000ms = 10초

    // 컴포넌트가 화면에서 사라질 때(Unmount) 타이머를 꺼주는 정리(Cleanup) 함수입니다. (메모리 누수 방지)
    return () => clearInterval(interval);
  }, [symbols]); // symbols 배열이 변경될 때마다 타이머를 새롭게 세팅합니다.

  // 5. 폼 제출(Enter 또는 버튼 클릭) 시 실행될 종목 추가 로직
  const handleAddSymbol = (e) => {
    e.preventDefault(); // 폼 제출 시 화면이 새로고침되는 기본 동작을 막습니다.
    const upperSymbol = newSymbol.toUpperCase().trim();
    
    // 빈 칸이 아니고, 기존 목록에 없는 티커일 때만 추가합니다.
    if (upperSymbol && !symbols.includes(upperSymbol)) {
      setSymbols([...symbols, upperSymbol]); // 기존 배열에 새 티커를 밀어 넣습니다.
      setNewSymbol(''); // 입력창 초기화
      setLoading(true); // 새 데이터를 불러오는 동안 로딩 표시
    }
  };

  if (loading && stocks.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50 text-xl font-bold text-gray-500 animate-pulse">
        미국 주식 시장 데이터를 불러오는 중입니다... 📈
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-6 font-sans">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-extrabold text-slate-800 mb-2 tracking-tight">미국 주식 실시간 대시보드 🇺🇸</h2>
        <p className="text-slate-500 mb-8 text-lg">내 관심 종목의 현재 시세와 변동률을 확인하세요. (10초마다 자동 갱신)</p>
        
        {/* 6. 티커 추가 검색창 (Form) */}
        <form onSubmit={handleAddSymbol} className="flex gap-4 mb-10">
          <input 
            type="text" 
            placeholder="티커 입력 (예: NFLX, META)" 
            value={newSymbol}
            onChange={(e) => setNewSymbol(e.target.value)}
            className="flex-1 max-w-sm px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all uppercase placeholder-normal"
          />
          <button 
            type="submit"
            className="px-6 py-3 bg-slate-800 text-white font-bold rounded-lg shadow-sm hover:bg-slate-700 transition-colors cursor-pointer"
          >
            종목 추가
          </button>
        </form>
        
        {/* 주식 카드 그리드 */}
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