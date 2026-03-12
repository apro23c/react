import React from 'react';

const StockCard = ({ stock }) => {
  // Finnhub API 응답 구조: c(현재가), d(변동폭), dp(변동률), h(고가), l(저가), o(시가), pc(전일종가)
  const isPositive = stock.d > 0;
  const isZero = stock.d === 0;

  // 한국 주식 시장(HTS/MTS)에서 익숙한 색상 적용 (상승: 빨간색, 하락: 파란색)
  const colorClass = isPositive ? 'text-red-500' : isZero ? 'text-gray-500' : 'text-blue-500';
  const arrow = isPositive ? '▲' : isZero ? '-' : '▼';

  return (
    <div className="border border-gray-200 p-6 rounded-2xl bg-white shadow-sm hover:shadow-lg transition-all duration-300">
      <h3 className="text-2xl font-black text-gray-800 tracking-tight">{stock.symbol}</h3>
      
      <div className="mt-4 mb-6">
        <p className="text-4xl font-extrabold text-gray-900">
          ${stock.c.toFixed(2)}
        </p>
        <p className={`text-lg font-bold mt-1 ${colorClass}`}>
          {arrow} {Math.abs(stock.d).toFixed(2)} ({stock.dp.toFixed(2)}%)
        </p>
      </div>
      
      <div className="pt-4 border-t border-gray-100 text-sm text-gray-600 grid grid-cols-2 gap-y-2 gap-x-4">
        <p className="flex justify-between"><span>고가:</span> <span className="font-semibold text-gray-800">${stock.h.toFixed(2)}</span></p>
        <p className="flex justify-between"><span>저가:</span> <span className="font-semibold text-gray-800">${stock.l.toFixed(2)}</span></p>
        <p className="flex justify-between"><span>시가:</span> <span className="font-semibold text-gray-800">${stock.o.toFixed(2)}</span></p>
        <p className="flex justify-between"><span>전일종가:</span> <span className="font-semibold text-gray-800">${stock.pc.toFixed(2)}</span></p>
      </div>
    </div>
  );
};

export default StockCard;