// backend/controllers/automate.js
const { Classroom, checkClassroomExists, saveClassroom } = require('../models/classroomModel');
function printScheduleToConsole(schedule) {
    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const maxPeriods = 6;

    if (!schedule || schedule.length === 0) {
        console.log('No schedule data available.');
        return;
    }

    schedule.forEach((daySchedule, dayIndex) => {
        if (dayIndex >= daysOfWeek.length) return;

        console.log(`\n**${daysOfWeek[dayIndex]}**`);

        // Loop through periods (0 to 5, totaling 6 periods)
        for (let periodIndex = 0; periodIndex < maxPeriods; periodIndex++) {
            const periodSlots = daySchedule[periodIndex] || [];

            let periodInfo = `  Period ${periodIndex + 1}: `;

            if (periodSlots.length === 0) {
                periodInfo += 'Free';
            } else {
                // Map the array of slots in the period to a readable string
                const slotsText = periodSlots.map(slot =>
                    `Subject: ${slot.subject}, Teacher: ${slot.teacher_name}`
                ).join(' | ');
                periodInfo += slotsText;
            }
            console.log(periodInfo);
        }
    });
    console.log(`\n-----------------------------------------------------`);

}
exports.automateClassShedule = async (req, res) => {
    try {
        const { classroom_id } = req.params;


        if (!classroom_id) {
            return res.status(400).json({
                success: false,
                message: 'Classroom ID is required'
            });
        }



        //get class
        const classroom = await Classroom.findOne({ classroom_id });
        console.log(classroom)
        console.log('Retrieved Classroom Object:', classroom.schedule);

        //get techers id
        teachers = classroom.subjects
        console.log("teachers list",teachers)


        //



        printScheduleToConsole(classroom.schedule)
        if (!classroom) {
            return res.status(404).json({
                success: false,
                message: `Classroom with ID '${classroom_id}' not found`
            });
        }

        console.log(`\n--- Schedule for Classroom: ${classroom.classname} (${classroom_id}) ---`);

        res.status(200).json({
            success: true,
            message: `Classroom '${ classroom_id }' updated successfully`,

        })
    }
    catch (err) {
        console.error('Error creaating automation');
        return res.status(500).json({ success: false, message: 'Internal Server Error', error: err.message });
    }
}