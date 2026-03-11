import React from 'react';
import { Link } from 'react-router-dom';

// 자식 컴포넌트: 부모로부터 'user'라는 데이터를 Props로 전달받아 화면에 그리기만 합니다.
const UserProfile = ({ user }) => {
  return (
    <div style={{ border: '1px solid #ccc', padding: '16px', borderRadius: '8px', marginTop: '10px' }}>
      <h3>{user.name}님의 프로필</h3>
      <p><strong>이메일:</strong> {user.email}</p>
      <p><strong>웹사이트:</strong> {user.website}</p>
      <p><strong>회사명:</strong> {user.company.name}</p>

      {/* 클릭 시 /users/1, /users/2 등 각 유저의 고유 ID 경로로 이동합니다. */}
      <Link to={`/users/${user.id}`}>
        <button style={{ marginTop: '10px', padding: '6px 12px', cursor: 'pointer' }}>상세보기</button>
      </Link>
    </div>
  );
};

export default UserProfile;