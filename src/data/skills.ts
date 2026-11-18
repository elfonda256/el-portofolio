import type { SkillGroup } from "./types";

/** Short list shown in the About section. */
export const coreSkills = [
  "Full-Stack Web Development",
  "LLM Integration",
  "Computer Vision (YOLO, TensorRT, Jetson)",
  "Object Detection & Tracking",
  "System & Database Design",
  "Industrial IoT & Telemetry",
  "Business Process Analysis",
  "Requirements Gathering",
]

/** Full technical skills, grouped. Source: CV. */
export const skillGroups: SkillGroup[] = [
  { name: "Programming", items: ["TypeScript", "JavaScript", "Python", "C/C++", "SQL", "HTML", "CSS"] },
  {
    name: "AI & Machine Learning",
    items: ["LLM APIs (Google Gemini)", "Ollama / local LLMs", "PyTorch", "TensorFlow", "YOLO / YOLOv8", "TensorRT", "DeepSORT", "DeepFace", "OCR (Tesseract, EasyOCR)", "Jetson Inference", "Google Colab"],
  },
  {
    name: "Web & Backend",
    items: ["Next.js", "React", "Tailwind CSS", "FastAPI", "REST APIs", "PostgreSQL", "Prisma ORM", "Supabase", "Redis", "WhatsApp API (Fonnte)"],
  },
  { name: "DevOps & Tools", items: ["Docker", "Vercel", "Coolify", "Git", "GitHub", "AI coding agents (Claude, Gemini)"] },
  {
    name: "Automation & Robotics",
    items: ["ROS", "SLAM", "LiDAR Integration", "NVIDIA Jetson Nano / Orin Nano", "Arduino", "PID Control"],
  },
  {
    name: "Industrial IoT",
    items: ["Telemetry", "Telecontrol", "Modbus", "MQTT", "GSM", "Data Loggers", "Communication Gateways", "Data Acquisition", "Remote Monitoring"],
  },
  { name: "Languages", items: ["Indonesian (native)", "English — TOEIC 750 (2024), TOEFL 501 (2021)"] },
  {
    name: "Engineering",
    items: ["Business Process Analysis", "Requirements Gathering", "System Architecture", "Database Design", "UI/UX Design", "AI-Assisted Development"],
  },
];
