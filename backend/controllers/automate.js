// backend/controllers/automate.js
const {Classroom ,checkClassroomExists,saveClassroom } = require('../models/classroomModel');

exports.automateClassShedule  = async(req,res) =>{
    try{
        const data = req.query;
        console.log(data)

        return res.status(201).json({
            success: true,
            message :'Classroom automation init',
            
        })
    }
    catch(err){
        console.error('Error creaating automation');
        return res.status(500).json({ success: false, message: 'Internal Server Error', error: err.message });
    }
}