import React from 'react';
import { Link } from 'react-router-dom';

const UserProfile = ({ user }) => {
  return (
    // 테두리, 패딩, 둥근 모서리, 그림자 효과, 마우스 오버 시 그림자 진해지는 효과(hover:shadow-md) 등을 부여했습니다.
    <div className="border border-gray-200 p-5 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow">
      
      <h3 className="text-xl font-bold text-gray-800">{user.name}</h3>
      
      <div className="mt-3 text-sm text-gray-600 space-y-1">
        <p><span className="font-semibold text-gray-700">이메일:</span> {user.email}</p>
        <p><span className="font-semibold text-gray-700">회사명:</span> {user.company.name}</p>
      </div>
      
      <Link to={`/users/${user.id}`}>
        {/* 파란색 배경, 흰색 글씨, 마우스 오버 시 배경색 변경 효과를 주었습니다. */}
        <button className="mt-4 px-4 py-2 w-full bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors cursor-pointer">
          상세보기
        </button>
      </Link>
      
    </div>
  );
};

export default UserProfile;