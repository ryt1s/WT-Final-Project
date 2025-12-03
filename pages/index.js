import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import axios from "axios";
import CourseForm from "@/components/CourseForm";

export default function Dashboard() {
  const { data: session } = useSession();
  const [courses, setCourses] = useState([]);
  const [editingCourse, setEditingCourse] = useState(null);

  const loadCourses = async () => {
    const res = await axios.get("/api/courses");
    setCourses(res.data);
  };

  useEffect(() => {
    if (session) loadCourses();
  }, [session]);

  if (!session) return <p>Loading...</p>;

  const handleDelete = async (courseId) => {
    await axios.delete("/api/courses", { data: { courseId } });
    loadCourses();
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl mb-4">Welcome, {session.user.name}</h1>

      <button className="bg-red-500 text-white p-2 mb-4" onClick={() => signOut()}>
        Logout
      </button>

      <CourseForm
        course={editingCourse}
        professorId={session.user.id}
        onSave={() => {
          setEditingCourse(null);
          loadCourses();
        }}
      />

      <table className="w-full border">
        <thead>
          <tr>
            <th className="border p-2">Title</th>
            <th className="border p-2">Description</th>
            <th className="border p-2">Semester</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((course) => (
            <tr key={course.id}>
              <td className="border p-2">{course.title}</td>
              <td className="border p-2">{course.description}</td>
              <td className="border p-2">{course.semester}</td>
              <td className="border p-2 flex gap-2">
                <button
                  className="bg-blue-500 text-white p-1"
                  onClick={() => setEditingCourse(course)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 text-white p-1"
                  onClick={() => handleDelete(course.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
