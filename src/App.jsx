import React, { useState, useEffect } from 'react';
import axios from 'axios';
import StockCard from './StockCard';
import useThemeStore from './store';

const API_KEY = import.meta.env.VITE_FINNHUB_API_KEY; 

function App() {
  // ⭐️ 복구 1: 그냥 배열을 넣지 않고, 브라우저 로컬 스토리지에서 먼저 찾아보고 없으면 기본 5개를 씁니다.
  const [symbols, setSymbols] = useState(() => {
    const savedSymbols = localStorage.getItem('my-stocks');
    return savedSymbols ? JSON.parse(savedSymbols) : ['AAPL', 'MSFT', 'TSLA', 'NFLX', 'BINANCE:BTCUSDT'];
  });

  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newSymbol, setNewSymbol] = useState('');

  const { isDarkMode, toggleDarkMode } = useThemeStore();

  // ⭐️ 복구 2: 종목(symbols)이 추가되거나 삭제될 때마다 잊지 않고 로컬 스토리지에 텍스트로 꽉꽉 저장해 둡니다.
  useEffect(() => {
    localStorage.setItem('my-stocks', JSON.stringify(symbols));
  }, [symbols]);

  // [최초 1회 데이터 로딩]
  const fetchStockData = async (currentSymbols) => {
    try {
      const promises = currentSymbols.map(symbol =>
        axios.get(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${API_KEY}`)
      );
      const responses = await Promise.all(promises);
      
      const validStocks = [];
      const invalidSymbols = [];

      responses.forEach((res, index) => {
        const currentSymbol = currentSymbols[index];
        // 암호화폐(: 포함)이거나 가격 데이터가 정상인 경우만 통과
        if (currentSymbol.includes(':') || (res.data && res.data.c !== 0 && res.data.c !== null)) {
          validStocks.push({
            symbol: currentSymbol,
            ...res.data
          });
        } else {
          invalidSymbols.push(currentSymbol);
        }
      });

      setStocks(validStocks);

      // 잘못된 주식은 지워버리기
      if (invalidSymbols.length > 0) {
        alert(`데이터를 찾을 수 없는 종목입니다: ${invalidSymbols.join(', ')}`);
        setSymbols((prevSymbols) => prevSymbols.filter(sym => !invalidSymbols.includes(sym)));
      }
    } catch (error) {
      console.error("데이터 로딩 실패:", error.message);
    } finally {
      setLoading(false);
    }
  };

  // [실시간 백엔드 연동 1초 갱신]
  useEffect(() => {
    if (symbols.length === 0) return; // 종목이 하나도 없으면 실행 안 함

    fetchStockData(symbols); // 부팅될 때 딱 1번만 핀허브 API 호출

    const interval = setInterval(async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/stocks/prices?symbols=${symbols.join(',')}`);
        const realTimePrices = response.data;

        setStocks(prevStocks => prevStocks.map(stock => {
          const newPriceStr = realTimePrices[stock.symbol];
          if (newPriceStr && newPriceStr !== "로딩중...") {
            const newPrice = parseFloat(newPriceStr);
            const newD = newPrice - stock.pc;
            const newDp = stock.pc > 0 ? (newD / stock.pc) * 100 : 0;
            return { ...stock, c: newPrice, d: newD, dp: newDp };
          }
          return stock;
        }));
      } catch (error) {
        console.error("백엔드 실시간 연동 실패:", error.message);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [symbols]);

  // [종목 추가]
  const handleAddSymbol = async (e) => {
    e.preventDefault();
    const upperSymbol = newSymbol.toUpperCase().trim();
    if (upperSymbol && !symbols.includes(upperSymbol)) {
      setSymbols([...symbols, upperSymbol]);
      setNewSymbol('');
      setLoading(true);
      
      try {
        await axios.post(`http://localhost:8080/api/stocks/subscribe/${upperSymbol}`);
      } catch (error) {
        console.error("구독 추가 요청 실패:", error);
      }
    }
  };

  // [종목 삭제]
  const handleRemoveSymbol = async (symbolToRemove) => {
    const updatedSymbols = symbols.filter(symbol => symbol !== symbolToRemove);
    setSymbols(updatedSymbols);

    try {
      await axios.delete(`http://localhost:8080/api/stocks/subscribe/${symbolToRemove}`);
    } catch (error) {
      console.error("구독 해제 요청 실패:", error);
    }
  };

  // ... (이 아래의 if (loading) 부분과 return (<div>...) 화면 그리는 부분은 기존과 완벽하게 동일합니다!) ...

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
            <StockCard 
              key={stock.symbol} 
              stock={stock} 
              onRemove={handleRemoveSymbol} 
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;