import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]"; // ✅ Import authOptions
import prisma from "@/lib/prisma";

export default async function handler(req, res) {   
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  // ✅ Convert to integer if needed
  const professorId = parseInt(session.user.id);
  const { method } = req;

  try {
    switch (method) {
      // -----------------------------
      // GET — Read all courses
      // -----------------------------
      case "GET": {
        const courses = await prisma.course.findMany({
          where: { professorId },
          orderBy: { createdAt: "desc" }
        });
        return res.status(200).json(courses);
      }

      // -----------------------------
      // POST — Create a course
      // -----------------------------
      case "POST": {
        const { title, description, semester } = req.body;

        // ✅ Add validation
        if (!title || !description || !semester) {
          return res.status(400).json({ error: "Missing required fields" });
        }

        const newCourse = await prisma.course.create({
          data: {
            title,
            description,
            semester,
            professorId,
          },
        });

        return res.status(201).json(newCourse);
      }

      // -----------------------------
      // PUT — Update a course
      // -----------------------------
      case "PUT": {
        const { id, ...updateData } = req.body;

        if (!id) {
          return res.status(400).json({ error: "Course ID required" });
        }

        // Security: ensure the course belongs to the professor
        const course = await prisma.course.findUnique({ where: { id } });
        if (!course) {
          return res.status(404).json({ error: "Course not found" });
        }
        if (course.professorId !== professorId) {
          return res.status(403).json({ error: "Forbidden" });
        }

        const updatedCourse = await prisma.course.update({
          where: { id },
          data: updateData,
        });

        return res.status(200).json(updatedCourse);
      }

      // -----------------------------
      // DELETE — Delete a course
      // -----------------------------
      case "DELETE": {
        const { courseId } = req.body;

        if (!courseId) {
          return res.status(400).json({ error: "Course ID required" });
        }

        const course = await prisma.course.findUnique({ where: { id: courseId } });
        if (!course) {
          return res.status(404).json({ error: "Course not found" });
        }
        if (course.professorId !== professorId) {
          return res.status(403).json({ error: "Forbidden" });
        }

        await prisma.course.delete({ where: { id: courseId } });
        return res.status(204).end();
      }

      // -----------------------------
      default:
        res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
        return res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.error("API error:", error);
    return res.status(500).json({ error: "Server error", details: error.message });
  }
}