import React, { useState, useEffect } from 'react';
import UserProfile from './UserProfile';

function App() {
  const [users, setUsers] = useState([]);

  const [searchKeyword, setSearchKeyword] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        const data = await response.json();

        setUsers(data); 
      } catch (error) {
        console.error("데이터 로딩 실패:", error);
      }
    };

    fetchUserData();
  }, []); 

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  if (users.length === 0) return <div style={{ padding: '20px' }}>데이터를 불러오는 중입니다...</div>;

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h2>유저 목록 검색 실습 </h2>

      <input
        type="text"
        placeholder="이름을 검색"
        value={searchKeyword}
        onChange={(e) => setSearchKeyword(e.target.value)}
        style={{ padding: '8px', marginBottom: '20px', width: '250px', borderRadius: '4px', border: '1px solid #ccc' }}
      />

      {filteredUsers.length > 0 ? (
        filteredUsers.map((user) => (
          <UserProfile key={user.id} user={user} />
        ))
      ) : (
        <p style={{ color: 'gray' }}>검색 결과가 없습니다.</p>
      )}
      

    </div>
  );
}

export default App;