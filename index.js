const express = require('express');
const pool = require('./data/db');
const authRoutes = require('./routes/authRoutes');
const app = express();

app.use(express.json());
app.use('/auth',authRoutes);
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