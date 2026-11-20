import './App.css';
import { useState } from 'react';


function App() {
  const [Username, setUsername] = useState('');
  const [Password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [token, setToken] = useState(null);
  const [profile, setProfile] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [view, setView] = useState('dashboard');
  const [roomError, setRoomError] = useState('');
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [bookingMessage, setBookingMessage] = useState('');


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

    setView('dashboard');
    setRooms([]);
    setRoomError('');
    setSelectedRoom(null);
    setStartTime('');
    setEndTime('');
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

  async function loadRooms() {
    setView('rooms');
    setRoomError('');

    try {
      const response = await fetch('/api/rooms', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setRooms(data);
        return;
      } else
        setRoomError('Cannot load rooms');

      return;

    } catch (error) {
      console.error(error);
      setRoomError('Cannot load rooms');
    }
  }
  const currentUser = profile?.user ?? profile;
  return (
    <div>
      <h1>Meeting Room Booking</h1>
      {currentUser ? (
        <>
          <h2>Welcome, {currentUser.username}</h2>
          <p>Role: {currentUser.role}</p>

          {currentUser.status !== 'active' ? (
            <p>Account is not active</p>
          ) : view === 'rooms' ? (
            <div>
              <h2>Meeting Rooms</h2>

              {roomError ? (
                <p>{roomError}</p>
              ) : rooms.length === 0 ? (
                <p>No rooms available</p>
              ) : (
                rooms.map((room) => (
                  <div key={room.id}>
                    <h3>{room.name}</h3>
                    <p>Capacity: {room.capacity}</p>

                    <button type="button" onClick={() => setSelectedRoom(room.id)}>
                      Select Room
                    </button>
                  </div>
                ))
              )}
              {selectedRoom !== null && (<>
                <p>{selectedRoom}</p>
                <label htmlFor="Start_Time">Start Time</label>
                <input
                  id="Start_Time"
                  type="datetime-local"
                  value={startTime}
                  onChange={(event) => setStartTime(event.target.value)}
                  placeholder="Enter StartTime"
                  name="Start_Time"
                  required
                />

                <label htmlFor="End_Time">End Time</label>
                <input
                  id="End_Time"
                  type="datetime-local"
                  value={endTime}
                  onChange={(event) => setEndTime(event.target.value)}
                  placeholder="Enter EndTime"
                  name="End_Time" s
                  required
                />

                {Boolean(startTime && endTime) && (
                  <button
                    type="button"
                  >Confirm Booking</button>
                )}
              </>)}
              <button
                type="button"
                onClick={() => setView('dashboard')}
              >
                Back to Dashboard
              </button>
            </div>
          ) : (
            <>
              <button type="button" onClick={loadRooms}>
                Book Room
              </button>

              <button type="button">My Bookings</button>

              {currentUser.role === 'admin' && (
                <>
                  <button type="button">Manage Rooms</button>
                  <button type="button">All Bookings</button>
                </>
              )}
            </>
          )}

          <button type="button" onClick={handleLogout}>
            Logout
          </button>
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
    </div >
  );
}

export default App;