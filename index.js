const express = require('express');
const pool = require('./data/db');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const roomRoutes = require('./routes/roomRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const app = express();

app.use(express.json());
app.use('/auth',authRoutes);
app.use('/admin', adminRoutes);
app.use('/rooms', roomRoutes);
app.use('/bookings', bookingRoutes);
app.get('/health',(req,res)=>{
    res.status(200).json({
        status: "ok",
        message: "Meeting Room API is running"});
});

async function test() {
    try{
        await pool.query('SELECT 1');
        app.listen(3000, ()=>{
    console.log('server is on');
})
    }catch(error){
        console.error('Database connection failed:', error);
    }
    
}
test();