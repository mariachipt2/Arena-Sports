import React from 'react';

export const SkeletonMatch: React.FC = () => {
  return (
    <div 
      className="glass-panel match-card"
      style={{
        pointerEvents: 'none',
        opacity: 0.6
      }}
    >
      <div className="match-card-header" style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ width: '80px', height: '14px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px' }} className="shimmer"></div>
        <div style={{ width: '40px', height: '14px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px' }} className="shimmer"></div>
      </div>
      <div className="match-card-body" style={{ margin: '8px 0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }}></div>
            <div style={{ width: '120px', height: '16px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px' }}></div>
          </div>
          <div style={{ width: '20px', height: '20px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px' }}></div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }}></div>
            <div style={{ width: '100px', height: '16px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px' }}></div>
          </div>
          <div style={{ width: '20px', height: '20px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px' }}></div>
        </div>
      </div>
      <div style={{ width: '100%', height: '1px', background: 'rgba(255,255,255,0.04)', margin: '8px 0' }}></div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ width: '50px', height: '12px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px' }}></div>
        <div style={{ width: '60px', height: '18px', background: 'rgba(255,255,255,0.08)', borderRadius: '99px' }}></div>
      </div>
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .shimmer {
          background: linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }
      `}</style>
    </div>
  );
};

export default SkeletonMatch;
