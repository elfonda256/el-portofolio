import type { TimelineItem } from "./types";
import { library as ph } from "./photos";

/** Work experience, newest first. Source: CV. */
export const experience: TimelineItem[] = [
  {
    title: "Independent Software Engineer",
    organization: "Commercial Client Projects",
    context: "Remote · Alongside full-time roles",
    period: "Oct 2025 – Present",
    description:
      "Deliver production web applications for paying clients, owning the full lifecycle from requirements gathering to deployment and post-launch improvement.",
    points: [
      "Sole developer of an enterprise catering platform for a business producing ~8,000 meals per day — ordering, procurement, inventory, warehouse and approvals.",
      "Responsive company profile websites for commercial clients, including contractor firms, from requirements and UI/UX through deployment and revisions.",
    ],
    tags: ["Next.js", "TypeScript", "PostgreSQL", "Prisma", "Supabase", "Vercel"],
  },
  {
    title: "Telemetry Engineer",
    organization: "PT Alkatec Mandiri Kencana",
    context: "Subcontractor to PT Adhi Karya (Persero) Tbk (BUMN) · Rentang Irrigation Modernization Project",
    location: "Majalengka, Indonesia",
    period: "Mar 2025 – Aug 2026",
    points: [
      "Worked within a state-owned enterprise (BUMN) project structure as a subcontractor to PT Adhi Karya (Persero) Tbk, the contractor for the Rentang Irrigation Modernization Project.",
      "Designed and implemented Industrial IoT telemetry systems using Modbus, MQTT and GSM communication.",
      "Supported deployment and operation of 52 telemetry stations and 13 telecontrol stations.",
      "Delivered an end-to-end data acquisition and remote monitoring system integrating sensors, data loggers, gateways and telemetry infrastructure.",
      "Monitored water flow, water levels, climatology and environmental parameters in real time, working with hydrology, automation and GIS teams.",
    ],
    tags: ["Modbus", "MQTT", "GSM", "Telemetry", "Telecontrol"],
    photos: [ph.weatherSensor, ph.jointInspection, ph.rimpPresentation],
  },
  {
    title: "Research & Development Intern",
    organization: "PT Toyota Motor Manufacturing Indonesia",
    context: "Automation, Robotics & Applied AI",
    location: "Karawang, Indonesia",
    period: "May 2023 – Apr 2024",
    points: [
      "Built autonomous mobile robot (AMR) prototypes using ROS, implementing SLAM for mapping and autonomous navigation.",
      "Trained YOLO object detection models with PyTorch and TensorFlow; optimized with TensorRT on Jetson Nano / Orin Nano (≈47–60 FPS).",
      "Participated in R&D of autonomous systems, including automated guided vehicles (AGVs).",
      "Analyzed work-equipment data and defined and reported engineering KPIs to executive management.",
      "Presented the AMR to the director and head of Yayasan Toyota Indonesia.",
    ],
    tags: ["ROS", "SLAM", "YOLO", "TensorRT", "Jetson"],
    photos: [ph.amrPresentation, ph.amrLoadTest, ph.presdirTmmin],
  },
];

/** Education. Source: CV. */
export const education: TimelineItem[] = [
  {
    title: "Applied Bachelor's Degree (Sarjana Terapan), Automation Engineering Technology",
    organization: "Institut Teknologi Sepuluh Nopember (ITS)",
    location: "Surabaya, Indonesia",
    period: "Aug 2020 – Sep 2024",
    description: "GPA 3.41 / 4.00",
    points: [
      "Global Project Based Learning (GPbL) with Shibaura Institute of Technology, Japan (2024): presented an energy monitoring project with a joint ITS and SIT team.",
      "Liaison Officer, Kontes Robot Indonesia (KRI) 2022 national round, hosted by ITS.",
      "Research Student, Electric Drive and Power Electronics System Laboratory (2021 – 2023).",
      "Finalist, Student Creativity Program (PKM): Community Service (2023) and Creativity Initiative (2021).",
    ],
    photos: [ph.gpblSit, ph.kri2022, ph.itsGraduationDept, ph.itsGraduation130],
  },
];
