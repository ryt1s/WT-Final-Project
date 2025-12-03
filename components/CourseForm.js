import { useState, useEffect } from "react";
import axios from "axios";

export default function CourseForm({ course, professorId, onSave }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [semester, setSemester] = useState("");

  useEffect(() => {
    if (course) {
      setTitle(course.title);
      setDescription(course.description);
      setSemester(course.semester);
    }
  }, [course]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      title,
      description,
      semester,
      professorId,
    };

    if (course) {
      // update
      await axios.put("/api/courses", { id: course.id, ...data });
    } else {
      // create
      await axios.post("/api/courses", data);
    }

    onSave();
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded shadow mb-4">
      <h2 className="text-xl mb-2">
        {course ? "Update Course" : "Add New Course"}
      </h2>

      <input
        className="border p-2 w-full mb-2"
        placeholder="Course title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        className="border p-2 w-full mb-2"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <input
        className="border p-2 w-full mb-2"
        placeholder="Semester"
        value={semester}
        onChange={(e) => setSemester(e.target.value)}
      />

      <button className="bg-green-600 text-white p-2 w-full">
        {course ? "Update Course" : "Create Course"}
      </button>
    </form>
  );
}
