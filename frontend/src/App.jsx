import './App.css';
import { useState } from 'react';


function App() {
  const [Username, setUsername] = useState('');
  const [Password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [token, setToken] = useState(null);
  const [profile, setProfile] = useState(null);

  async function handleLogin(event) {
    event.preventDefault();

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: Username,
          password: Password
        })
      });

      const data = await response.json();
      if (response.ok === true && data.token) {
        setToken(data.token);
        setMessage('Login successful');
        setPassword('');

        await loadProfile(data.token);
      } else
        setMessage(data.message || 'Login failed');
    } catch (error) {
      console.error('Login request failed:', error);
      setMessage('Cannot connect to server');
    }
  }

  function handleLogout() {
    setToken(null);
    setProfile(null);
    setUsername('');
    setPassword('');
    setMessage('');
  }

  async function loadProfile(jwt) {
    try {
      const response = await fetch('/api/auth/me', {
        headers: {
          Authorization: `Bearer ${jwt}`
        }
      });

      if (!response.ok) {
        setMessage('Cannot load profile');
        setProfile(null);
        return;
      }

      const data = await response.json();
      setProfile(data);

    } catch (error) {
      console.error('Profile request failed:', error);
      setMessage('Cannot load profile');
    }
  }

  const currentUser = profile?.user ?? profile;
  return (
    <div>
      <h1>Meeting Room Booking</h1>
      <p>{profile}</p>
      {profile ? (<>
        <p>Welcome to Dashboard</p>
        <p>Welcome, {profile.user}</p>
        <p>Role: {profile.user.role}</p>

        {profile.status === 'pending' ? (
          <p>Waiting for admin approval</p>
        ) : (
          <>
            <button type="button">Book Room</button>
            <button type="button">My Bookings</button>

            {profile.role === 'admin' && (
              <>
                <button type="button">Manage Rooms</button>
                <button type="button">All Bookings</button>
              </>
            )}
          </>
        )}


        <button type="button" onClick={handleLogout}>Logout</button>
      </>
      ) : (
        <form onSubmit={handleLogin}>
          <div className="container">
            <label htmlFor="uname">Username</label>
            <input
              id="uname"
              type="text"
              value={Username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="Enter Username"
              name="uname"
              required
            />

            <label htmlFor="psw">Password</label>
            <input
              id="psw"
              type="password"
              value={Password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter Password"
              name="psw"
              required
            />

            <button type="submit">Login</button>
            <p>{message}</p>
          </div>
        </form>
      )}

    </div>
  );
}

export default App;