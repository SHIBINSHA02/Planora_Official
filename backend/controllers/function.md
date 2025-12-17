<!-- backend/controllers/function.md -->

<!-- Teacher routes -->

Teacher Routes — API Documentation
Base Path
/api/teachers

All teacher routes are organisation-scoped.
organisationId is mandatory in requests.




Authentication & Scope (Assumed)

This documentation assumes:
Authentication middleware already ran
Caller is authorized for the given organisationId
(If not, add middleware later — controller is ready.)
 Teacher Model (Response Shape)
{
  "organisationId": "ORG1",
  "teacherId": "T-12",
  "teacherName": "John Doe",
  "email": "john@school.edu",
  "subjects": ["Maths", "Physics"],
  "createdAt": "2025-01-01T10:00:00Z",
  "updatedAt": "2025-01-01T10:00:00Z"
}





Create Teacher
Endpoint
POST /api/teachers

Request Body
{
  "organisationId": "ORG1",
  "teachername": "John Doe",
  "mailid": "john@school.edu",
  "subjects": ["Maths", "Physics"]
}

Required Fields
Field	Type	Notes
organisationId	string	Tenant identifier
teachername	string	Display name
mailid	string	Must be unique
subjects	string[]	At least one
Processing Logic

Validate required fields

Generate unique teacherId (T-n)

Persist teacher document

Emit teacher_created event

Success Response — 201
{
  "message": "Teacher created successfully",
  "teacher": { ...teacherObject }
}

Error Responses
Status	Reason
400	Missing required fields
409	Duplicate email / ID
500	Server error
2️⃣ Get All Teachers (Organisation Scoped)
Endpoint
GET /api/teachers?organisationId=ORG1

Query Parameters
Param	Required
organisationId	✅ Yes
Behavior

Returns only teachers belonging to the organisation

Prevents cross-organisation data access

Success Response — 200
[
  { ...teacher1 },
  { ...teacher2 }
]

Error Responses
Status	Reason
400	organisationId missing
500	Fetch failure
3️⃣ Get Teacher by ID
Endpoint
GET /api/teachers/:teacherid?organisationId=ORG1

Path Parameters
Param	Description
teacherid	Custom teacher ID (e.g., T-3)
Query Parameters
Param	Required
organisationId	✅ Yes
Behavior

Fetches one teacher by ID within organisation

Returns 404 if not found

Success Response — 200
{ ...teacherObject }

Error Responses
Status	Reason
404	Teacher not found
500	Fetch error
4️⃣ Update Teacher
Endpoint
PUT /api/teachers/:teacherid

Request Body
{
  "organisationId": "ORG1",
  "teacherName": "John D",
  "subjects": ["Maths", "CS"]
}

Update Rules
Rule	Enforced
teacherId immutable	✅
organisationId required	✅
schedule update allowed	❌
email uniqueness	✅
Processing Logic

Validate organisationId

Remove forbidden fields (teacherId)

Apply safe updates

Return updated document

Success Response — 200
{
  "message": "Teacher updated successfully",
  "teacher": { ...updatedTeacher }
}

Error Responses
Status	Reason
400	organisationId missing
404	Teacher not found
409	Duplicate email
500	Update failure
5️⃣ Delete Teacher (Cascade Cleanup)
Endpoint
DELETE /api/teachers/:teacherid?organisationId=ORG1

Behavior

Deletes teacher record

Deletes all ScheduleSlots linked to teacher

Prevents orphan timetable entries

Success Response — 200
{
  "message": "Teacher John Doe deleted successfully"
}

Error Responses
Status	Reason
404	Teacher not found
500	Delete failure
🔄 Real-Time Events
Emitted Events
Event	Trigger
teacher_created	After teacher creation
Payload
{ ...teacherObject }

❗ Important Design Notes
No Timetable in Teacher

Teacher model contains identity only

Schedule lives in ScheduleSlot

No Hard Conflict Enforcement

Same teacher can appear in multiple slots

Parallel scheduling is allowed

Organisation Isolation

Every query filters by organisationId

Mandatory for data safety



<!-- Classrrom Documentation -->


📘 Classroom Routes — API Documentation
Base Path
/api/classrooms


All routes are organisation-scoped.
Every request must include organisationId.

📦 Classroom Model (Response Shape)
{
  "organisationId": "ORG1",
  "classroomId": "CSE-A",
  "className": "Computer Science A",
  "department": "CSE",
  "subjects": [
    {
      "subject": "Maths",
      "defaultTeacherId": "T-1",
      "weeklyHours": 4
    }
  ],
  "createdAt": "2025-01-01T10:00:00Z",
  "updatedAt": "2025-01-01T10:00:00Z"
}

1️⃣ Create Classroom (Onboard)
Endpoint
POST /api/classrooms

Request Body
{
  "organisationId": "ORG1",
  "classroomId": "CSE-A",
  "className": "Computer Science A",
  "department": "CSE",
  "subjects": [
    {
      "subject": "Maths",
      "defaultTeacherId": "T-1",
      "weeklyHours": 4
    }
  ]
}

Required Fields
Field	Type	Notes
organisationId	string	Tenant boundary
classroomId	string	Unique per organisation
className	string	Display name
Processing Logic

Validate required fields

Ensure classroomId is unique within organisation

Create classroom document

Return created classroom

Success Response — 201
{
  "success": true,
  "message": "Classroom onboarded successfully",
  "classroom": { ...classroomObject }
}

Error Responses
Status	Reason
400	Missing required fields
409	Classroom already exists
500	Server error
2️⃣ Get All Classrooms (Organisation Scoped)
Endpoint
GET /api/classrooms?organisationId=ORG1

Query Parameters
Param	Required
organisationId	✅ Yes
Behavior

Returns only classrooms in the organisation

Excludes schedule data (lightweight response)

Success Response — 200
{
  "success": true,
  "count": 3,
  "data": [
    { ...classroom1 },
    { ...classroom2 }
  ]
}

Error Responses
Status	Reason
400	organisationId missing
500	Fetch failure
3️⃣ Get Classroom by ID
Endpoint
GET /api/classrooms/:classroomId?organisationId=ORG1

Path Parameters
Param	Description
classroomId	Classroom identifier
Query Parameters
Param	Required
organisationId	✅ Yes
Behavior

Fetch classroom by ID within organisation

Returns 404 if not found

Success Response — 200
{
  "success": true,
  "data": { ...classroomObject }
}

Error Responses
Status	Reason
404	Classroom not found
500	Fetch error
4️⃣ Update Classroom
Endpoint
PUT /api/classrooms/:classroomId

Request Body
{
  "organisationId": "ORG1",
  "className": "CSE A - Updated",
  "subjects": [
    {
      "subject": "AI",
      "defaultTeacherId": "T-4",
      "weeklyHours": 3
    }
  ]
}

Update Rules
Rule	Enforced
classroomId immutable	✅
organisationId required	✅
schedule updates allowed	❌
Processing Logic

Validate organisationId

Prevent classroomId mutation

Apply safe updates

Return updated document

Success Response — 200
{
  "success": true,
  "message": "Classroom updated successfully",
  "classroom": { ...updatedClassroom }
}

Error Responses
Status	Reason
400	organisationId missing
404	Classroom not found
500	Update failure
5️⃣ Delete Classroom (Cascade Cleanup)
Endpoint
DELETE /api/classrooms/:classroomId?organisationId=ORG1

Behavior

Deletes classroom document

Deletes all related ScheduleSlot records

Prevents orphan timetables

Success Response — 200
{
  "success": true,
  "message": "Classroom deleted successfully"
}

Error Responses
Status	Reason
404	Classroom not found
500	Delete failure
🔎 How to Get Classroom Schedule

Classroom does not store schedule data.

Correct Way
GET /api/schedules/classroom/:classroomId?organisationId=ORG1

Internal Query
ScheduleSlot.find({
  organisationId,
  classroomId
}).sort({ day: 1, period: 1 });

🔐 Security & Data Isolation
Concern	Handling
Cross-organisation access	Blocked via filters
Data consistency	Centralized in ScheduleSlot
Race conditions	Avoided by design


<!-- Schedule management  -->
