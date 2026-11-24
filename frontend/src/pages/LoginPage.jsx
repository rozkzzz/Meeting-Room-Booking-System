function LoginPage({
  username,
  password,
  message,
  onUsernameChange,
  onPasswordChange,
  onSubmit
}) {
  return (
    <form onSubmit={onSubmit}>
          <div className="container">
            <label htmlFor="uname">Username</label>
            <input
              id="uname"
              type="text"
              value={username}
              onChange={(event) => onUsernameChange(event.target.value)}
              placeholder="Enter Username"
              name="uname"
              required
            />

            <label htmlFor="psw">Password</label>
            <input
              id="psw"
              type="password"
              value={password}
              onChange={(event) => onPasswordChange(event.target.value)}
              placeholder="Enter Password"
              name="psw"
              required
            />

            <button type="submit">Login</button>
            <p>{message}</p>
          </div>
    </form>
  );
}

export default LoginPage;