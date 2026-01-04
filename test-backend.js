// Test backend connection
const testBackend = async () => {
  try {
    const response = await fetch('http://localhost:8000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@test.com',
        password: 'test123'
      })
    });
    
    const data = await response.json();
    console.log('Backend response:', data);
    
    if (response.ok) {
      console.log('✅ Backend is working');
    } else {
      console.log('❌ Backend error:', data.message);
    }
  } catch (error) {
    console.error('❌ Cannot connect to backend:', error.message);
  }
};

testBackend();