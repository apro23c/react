import React from 'react';
import useThemeStore from './store';

const StockCard = ({ stock, onRemove }) => {
  const { isDarkMode } = useThemeStore();

  const isPositive = stock.d > 0;
  const isZero = stock.d === 0;

  const colorClass = isPositive ? 'text-red-500' : isZero ? 'text-gray-500' : 'text-blue-500';
  const arrow = isPositive ? '▲' : isZero ? '-' : '▼';

  return (
    <div className={`relative p-6 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
      
      <button
        onClick={() => onRemove(stock.symbol)}
        className="absolute top-5 right-5 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
        title="종목 삭제"
      >
        ✕
      </button>

      <h3 className={`text-2xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
        {stock.symbol}
      </h3>

      <h3 className={`text-2xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
        {stock.symbol}
      </h3>
      
      <div className="mt-4 mb-6">
        <p className={`text-4xl font-extrabold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          ${stock.c.toFixed(2)}
        </p>
        <p className={`text-lg font-bold mt-1 ${colorClass}`}>
          {arrow} {Math.abs(stock.d).toFixed(2)} ({stock.dp.toFixed(2)}%)
        </p>
      </div>
      
      <div className={`pt-4 border-t text-sm grid grid-cols-2 gap-y-2 gap-x-4 ${isDarkMode ? 'border-slate-700 text-slate-400' : 'border-gray-100 text-gray-600'}`}>
        <p className="flex justify-between">
          <span>고가:</span> 
          <span className={`font-semibold ${isDarkMode ? 'text-slate-200' : 'text-gray-800'}`}>${stock.h.toFixed(2)}</span>
        </p>
        <p className="flex justify-between">
          <span>저가:</span> 
          <span className={`font-semibold ${isDarkMode ? 'text-slate-200' : 'text-gray-800'}`}>${stock.l.toFixed(2)}</span>
        </p>
        <p className="flex justify-between">
          <span>시가:</span> 
          <span className={`font-semibold ${isDarkMode ? 'text-slate-200' : 'text-gray-800'}`}>${stock.o.toFixed(2)}</span>
        </p>
        <p className="flex justify-between">
          <span>전일종가:</span> 
          <span className={`font-semibold ${isDarkMode ? 'text-slate-200' : 'text-gray-800'}`}>${stock.pc.toFixed(2)}</span>
        </p>
      </div>
      
    </div>
  );
};

export default StockCard;