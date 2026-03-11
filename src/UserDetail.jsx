import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const UserDetail = () => {
  // URL 경로(예: /users/3)에서 '3'이라는 파라미터 값을 추출합니다.
  const { id } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`https://jsonplaceholder.typicode.com/users/${id}`);
        setUser(response.data);
      } catch (error) {
        console.error("상세 데이터 로딩 실패:", error.message);
      }
    };
    fetchUser();
  }, [id]);

  if (!user) return <div style={{ padding: '20px' }}>유저 정보를 불러오는 중입니다...</div>;

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h2>{user.name}님의 상세 정보 📄</h2>
      <div style={{ border: '1px solid #007bff', padding: '16px', borderRadius: '8px', marginBottom: '20px' }}>
        <p><strong>이메일:</strong> {user.email}</p>
        <p><strong>전화번호:</strong> {user.phone}</p>
        <p><strong>웹사이트:</strong> {user.website}</p>
        <p><strong>주소:</strong> {user.address.city}, {user.address.street}</p>
      </div>
      
      {/* 화면을 깜빡이지 않고 클라이언트 사이드에서만 주소를 이동시키는 Link 컴포넌트 */}
      <Link to="/" style={{ textDecoration: 'none', color: '#007bff', fontWeight: 'bold' }}>
        ← 목록으로 돌아가기
      </Link>
    </div>
  );
};

export default UserDetail;