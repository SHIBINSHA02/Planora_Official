// backend/middleware/teacherValidation.js

function validateTeacher(req, res, next) {
  const { teacherid, teachername, mailid, subjects, schedule_grid } = req.body;

  if (!teacherid || typeof teacherid !== 'string')
    return res.status(400).json({ error: 'teacherid is required and must be a string' });

  if (!teachername || typeof teachername !== 'string')
    return res.status(400).json({ error: 'teachername is required and must be a string' });

  if (!mailid || typeof mailid !== 'string')
    return res.status(400).json({ error: 'mailid is required and must be a string' });

  if (!Array.isArray(subjects) || subjects.length === 0)
    return res.status(400).json({ error: 'subjects must be a non-empty array of strings' });

  for (const sub of subjects) {
    if (typeof sub !== 'string')
      return res.status(400).json({ error: 'Each subject must be a string' });
  }

  // Optional validation for schedule grid
  if (schedule_grid) {
    if (!Array.isArray(schedule_grid) || schedule_grid.length !== 5)
      return res.status(400).json({ error: 'schedule_grid must have 5 rows (days)' });

    for (const day of schedule_grid) {
      if (!Array.isArray(day) || day.length !== 6)
        return res.status(400).json({ error: 'Each day in schedule_grid must have 6 periods' });
    }
  }

  next();
}

module.exports = { validateTeacher };
