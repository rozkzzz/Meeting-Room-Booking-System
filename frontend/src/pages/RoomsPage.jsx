function RoomsPage({
    rooms,
    roomError,
    selectedRoom,
    startTime,
    endTime,
    bookingMessage,
    onSelectRoom,
    onStartTimeChange,
    onEndTimeChange,
    onSubmitBooking,
    onBack
}) {
    return (
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

                        <button type="button" onClick={() => onSelectRoom(room.id)}>
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
                    onChange={(event) => onStartTimeChange(event.target.value)}
                    placeholder="Enter StartTime"
                    name="Start_Time"
                    required
                />

                <label htmlFor="End_Time">End Time</label>
                <input
                    id="End_Time"
                    type="datetime-local"
                    value={endTime}
                    onChange={(event) => onEndTimeChange(event.target.value)}
                    placeholder="Enter EndTime"
                    name="End_Time"
                    required
                />

                {Boolean(startTime && endTime) && (
                    <button
                        type="button"
                        onClick={onSubmitBooking}
                    >Confirm Booking</button>
                )}
            </>)}
            <p>{bookingMessage}</p>
            <button
                type="button"
                onClick={onBack}
            >
                Back to Dashboard
            </button>
        </div>
    );
}

export default RoomsPage;