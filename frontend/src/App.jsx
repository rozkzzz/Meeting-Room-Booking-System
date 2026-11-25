import './App.css';
import { useState } from 'react';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import RoomsPage from './pages/RoomsPage';
import MyBookingsPage from './pages/MyBookingsPage';
import { apiRequest } from './services/api';

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
  const [myBookings, setMyBookings] = useState([]);
  const [bookingError, setBookingError] = useState('');


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
    setBookingMessage('');
    setMyBookings([]);
    setBookingError('');
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
      const data = await apiRequest('/rooms', {
        token
      });

      setRooms(data);

    } catch (error) {
      setRoomError(error.message);
    }
  }

  async function loadMyBookings() {
    setBookingError('');
    setView('myBookings');
    try {
      const response = await fetch('/api/bookings/my', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (!response.ok) {
        setBookingError("Can't load bookings");
        return;
      }

      const data = await response.json();

      setMyBookings(data);

    } catch (error) {
      console.error(error);
      setBookingError('Cannot load bookings');
    }
  }

  async function submitBooking() {
    setBookingMessage('');

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },

        body: JSON.stringify({
          room_id: selectedRoom,
          start_time: startTime.replace('T', ' ') + ':00',
          end_time: endTime.replace('T', ' ') + ':00'
        })
      });

      const data = await response.json();
      if (response.ok) {
        setBookingMessage('Booking successful');
      } else {
        setBookingMessage(data.message || 'Booking failed');
      }

    } catch (error) {
      console.error(error);
      setBookingMessage('Cannot connect to server');
    }
  }

  async function cancelBooking(bookingId) {
    setBookingError('');

    try {
      const response = await fetch(
        `/api/bookings/${bookingId}/cancel`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));

        setBookingError(data.message || 'Cancel failed');
        return;
      }
      await loadMyBookings();

    } catch (error) {
      console.error(error);
      setBookingError('Cannot cancel booking');
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
            <RoomsPage
              rooms={rooms}
              roomError={roomError}
              selectedRoom={selectedRoom}
              startTime={startTime}
              endTime={endTime}
              bookingMessage={bookingMessage}
              onSelectRoom={setSelectedRoom}
              onStartTimeChange={setStartTime}
              onEndTimeChange={setEndTime}
              onSubmitBooking={submitBooking}
              onBack={() => setView('dashboard')}
            />
          ) : view === 'myBookings' ? (
            <MyBookingsPage
              myBookings={myBookings}
              bookingError={bookingError}
              onCancelBooking={cancelBooking}
              onBack={() => setView('dashboard')}
            />
          ) : (
            <DashboardPage
              role={currentUser.role}
              onBookRoom={loadRooms}
              onMyBookings={loadMyBookings}
            />
          )}

          <button type="button" onClick={handleLogout}>
            Logout
          </button>
        </>
      ) : (
        <LoginPage
          username={Username}
          password={Password}
          message={message}
          onUsernameChange={setUsername}
          onPasswordChange={setPassword}
          onSubmit={handleLogin}
        />
      )}
    </div >
  );
}

export default App;