function validateScheduleSlot(data) {
  const { organisationId, classroomId, teacherId, subject, day, period } = data;

  if (!organisationId) return [false, "organisationId required"];
  if (!classroomId) return [false, "classroomId required"];
  if (!teacherId) return [false, "teacherId required"];
  if (!subject) return [false, "subject required"];
  if (day < 0 || period < 0) return [false, "Invalid day or period"];

  return [true, null];
}

module.exports = { validateScheduleSlot };
