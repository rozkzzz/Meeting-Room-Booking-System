function DashboardPage({
    role,
    onBookRoom,
    onMyBookings
}) {
    return (
        <>
            <button type="button" onClick={onBookRoom}>
                Book Room
            </button>

            <button type="button" onClick={onMyBookings}>My Bookings</button>

            {role === 'admin' && (
                <>
                    <button type="button">Manage Rooms</button>
                    <button type="button">All Bookings</button>
                </>
            )}
        </>
    );
}

export default DashboardPage;