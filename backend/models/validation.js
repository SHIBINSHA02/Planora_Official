// Validation for Classroom payload

function validateClassroomSchema(data) {
    if (!data) return [false, 'No data provided'];
  
    const { classroom_id, classname, admin, subjects, schedule } = data;
  
    // Validate required strings
    if (!classroom_id || typeof classroom_id !== 'string') return [false, 'classroom_id is required and must be a string'];
    if (!classname || typeof classname !== 'string') return [false, 'classname is required and must be a string'];
    if (!admin || typeof admin !== 'string') return [false, 'admin is required and must be a string'];
  
    // Validate subjects array
    if (!Array.isArray(subjects) || subjects.length === 0) return [false, 'subjects must be a non-empty array'];
  
    for (const sub of subjects) {
      if (!sub.subject || typeof sub.subject !== 'string') return [false, 'Each subject must have a subject name'];
      if (!sub.teachername || typeof sub.teachername !== 'string') return [false, 'Each subject must have a teachername'];
      if (typeof sub.time !== 'number' || sub.time <= 0) return [false, 'Each subject must have time as a positive number'];
    }
  
    // Validate schedule: 5 days x 6 periods
    if (!Array.isArray(schedule) || schedule.length !== 5) return [false, 'schedule must be an array of 5 days'];
    
    for (let dayIndex = 0; dayIndex < schedule.length; dayIndex++) {
      const day = schedule[dayIndex];
      if (!Array.isArray(day) || day.length !== 6) return [false, `Day ${dayIndex + 1} must have 6 periods`];
      
      for (let periodIndex = 0; periodIndex < day.length; periodIndex++) {
        const period = day[periodIndex];
        if (!Array.isArray(period)) return [false, `Period ${periodIndex + 1} on day ${dayIndex + 1} must be an array`];
  
        for (const slot of period) {
          if (!slot.teacher_id || typeof slot.teacher_id !== 'string') return [false, `teacher_id missing in a slot at day ${dayIndex + 1}, period ${periodIndex + 1}`];
          if (!slot.teacher_name || typeof slot.teacher_name !== 'string') return [false, `teacher_name missing in a slot at day ${dayIndex + 1}, period ${periodIndex + 1}`];
          if (!slot.subject || typeof slot.subject !== 'string') return [false, `subject missing in a slot at day ${dayIndex + 1}, period ${periodIndex + 1}`];
        }
      }
    }
  
    // All checks passed
    return [true, null];
  }
  
  module.exports = { validateClassroomSchema };
  