import React from 'react';

interface MembersButtonPorpos {
  name: string,
  image: string
}

const MembersButton: React.FC<MembersButtonPorpos> = ({ name, image }) => {
  return (
    <div
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: '50px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.15)',
        padding: '10px',
        cursor: 'pointer',
      }}
    >
      <img
        src={image} // Replace with the correct image path or URL
        alt="Profile"
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          objectFit: 'cover',
          marginRight: '10px',
        }}
      />
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <p style={{ fontSize: '14px', color: '#000000', fontWeight: 'bold', margin: 0 }}>{name}</p>
        <p style={{ fontSize: '12px', color: 'gray' }}>
          <span style={{ color: 'green', fontWeight: 'bold' }}>Admin</span> Avg. response time: <strong>1 Hour</strong>
        </p>
      </div>
    </div>
  );
};

export default MembersButton;
