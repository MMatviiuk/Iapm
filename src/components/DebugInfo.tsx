export default function DebugInfo({ currentUser, userRole, currentPage }: any) {
  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      background: 'rgba(0,0,0,0.8)',
      color: 'white',
      padding: '20px',
      borderRadius: '8px',
      fontSize: '14px',
      zIndex: 9999,
      maxWidth: '300px'
    }}>
      <h3 style={{ marginBottom: '10px', fontWeight: 'bold' }}>DEBUG INFO</h3>
      <div><strong>Current Page:</strong> {currentPage}</div>
      <div><strong>User Role:</strong> {userRole}</div>
      <div><strong>User Name:</strong> {currentUser?.name || 'UNDEFINED'}</div>
      <div><strong>User Email:</strong> {currentUser?.email || 'UNDEFINED'}</div>
      <div><strong>User Loaded:</strong> {currentUser ? 'YES ✅' : 'NO ❌'}</div>
    </div>
  );
}
