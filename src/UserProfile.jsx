import React from 'react';

// 자식 컴포넌트: 부모로부터 'user'라는 데이터를 Props로 전달받아 화면에 그리기만 합니다.
const UserProfile = ({ user }) => {
  return (
    <div style={{ border: '1px solid #ccc', padding: '16px', borderRadius: '8px', marginTop: '10px' }}>
      <h3>{user.name}님의 프로필</h3>
      <p><strong>이메일:</strong> {user.email}</p>
      <p><strong>웹사이트:</strong> {user.website}</p>
      <p><strong>회사명:</strong> {user.company.name}</p>
    </div>
  );
};

export default UserProfile;