function MyBookingsPage({
    myBookings,
    bookingError,
    onCancelBooking,
    onBack
}) {
    return (
        <div>
            <h2>My Bookings</h2>
            {bookingError ? (
                <p>{bookingError}</p>
            ) : myBookings.length === 0 ? (
                <p>No bookings found</p>
            ) : (
                myBookings.map((booking) => (
                    <div key={booking.id}>
                        <p>Room ID: {booking.room_id}</p>
                        <p>Start: {booking.start_time}</p>
                        <p>End: {booking.end_time}</p>
                        <p>Status: {booking.status}</p>
                        {booking.status === 'confirmed' && (
                            <button
                                type="button"
                                onClick={() => onCancelBooking(booking.id)}
                            >
                                Cancel Booking
                            </button>
                        )}
                    </div>
                ))
            )}

            <button
                type="button"
                onClick={onBack}
            >
                Back to Dashboard
            </button>
        </div>
    );
}

export default MyBookingsPage;