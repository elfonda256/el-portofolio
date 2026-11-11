import type { SkillGroup } from "./types";

/** Short list shown in the About section. */
export const coreSkills = [
  "Business Process Analysis",
  "Requirements Gathering",
  "Full-Stack Web Development",
  "System & Database Design",
  "Industrial IoT & Telemetry",
  "Sensor Integration & Data Acquisition",
  "ROS, SLAM & Autonomous Mobile Robots",
  "Computer Vision (YOLO, TensorRT, Jetson)",
];

/** Full technical skills, grouped. Source: CV. */
export const skillGroups: SkillGroup[] = [
  { name: "Programming", items: ["TypeScript", "JavaScript", "Python", "C/C++", "HTML", "CSS"] },
  { name: "Frontend", items: ["React", "Next.js", "TypeScript", "Tailwind CSS"] },
  {
    name: "Backend & Database",
    items: ["PostgreSQL", "Prisma ORM", "Supabase", "Next.js API Routes", "REST APIs", "WhatsApp API (Fonnte)"],
  },
  { name: "Version Control", items: ["Git", "GitHub"] },
  {
    name: "Automation & Robotics",
    items: ["ROS", "SLAM", "LiDAR Integration", "NVIDIA Jetson Nano / Orin Nano", "Arduino", "PID Control"],
  },
  {
    name: "AI & Computer Vision",
    items: ["PyTorch", "TensorFlow", "YOLO", "NVIDIA Jetson Inference", "NVIDIA TensorRT", "Model Training", "Google Colab"],
  },
  {
    name: "Industrial IoT",
    items: ["Telemetry", "Telecontrol", "Modbus", "MQTT", "GSM", "Remote Monitoring", "Sensor Integration", "Data Loggers", "Communication Gateways", "Data Acquisition"],
  },
  /** Stated by Elfano (not on the CV PDF yet). */
  { name: "English", items: ["TOEIC 750 (2024)", "TOEFL 501 (2021)"] },
  {
    name: "Engineering",
    items: ["Business Process Analysis", "Requirements Gathering", "System Architecture", "Database Design", "UI/UX Design", "AI-Assisted Development"],
  },
];
