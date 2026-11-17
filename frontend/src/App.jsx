import './App.css';

function App() {
  return (
    <div>
      <h1>Meeting Room Booking</h1>

      <form>
        <div className="container">
          <label htmlFor="uname">Username</label>
          <input
            id="uname"
            type="text"
            placeholder="Enter Username"
            name="uname"
            required
          />

          <label htmlFor="psw">Password</label>
          <input
            id="psw"
            type="password"
            placeholder="Enter Password"
            name="psw"
            required
          />

          <button type="submit">Login</button>
        </div>
      </form>
    </div>
  );
}

export default App;