import type { Project } from "./types";
import { library as ph } from "./photos";

/**
 * Portfolio projects.
 * - Order here = order on the site.
 * - `featured: true` puts a project on the home page grid (6 look best).
 * - Add a real screenshot with `image` to replace the built-in illustration.
 * - To add a new project, copy an entry, give it a unique `slug`, and fill it in.
 *
 * Every fact below comes from the CV or from links Elfano provided.
 */
export const projects: Project[] = [
  {
    slug: "rentang-irrigation-telemetry",
    title: "Rentang Irrigation Telemetry",
    category: "Industrial IoT",
    year: "2025 – 2026",
    summary:
      "Industrial IoT telemetry and remote monitoring for the Rentang Irrigation Modernization Project — 52 telemetry and 13 telecontrol stations.",
    overview: [
      "The Rentang Irrigation Modernization Project brings real-time data to an irrigation network in Majalengka, West Java. As Telemetry Engineer at PT Alkatec Mandiri Kencana, I worked on the systems that collect field measurements and deliver them to the people managing water distribution.",
      "The work spans the full data path: field sensors, data loggers, communication gateways and telemetry infrastructure, connected over Modbus, MQTT and GSM so that water flow, water levels, climatology and environmental parameters can be monitored remotely.",
    ],
    role: "Telemetry Engineer",
    context: "PT Alkatec Mandiri Kencana · Majalengka, Indonesia",
    highlights: [
      "Designed and implemented Industrial IoT telemetry systems using Modbus, MQTT and GSM communication.",
      "Supported deployment and operation of 52 telemetry stations and 13 telecontrol stations.",
      "Delivered an end-to-end data acquisition and remote monitoring system integrating sensors, data loggers and gateways.",
      "Maintained real-time monitoring, data accuracy and integrity across distributed field devices with hydrology, automation and GIS teams.",
      "Installed weather sensors at gauging stations and took part in joint inspections with Japanese telemetry experts.",
      "Presented the RIMP telemetering system.",
    ],
    stack: ["Modbus", "MQTT", "GSM", "Data Loggers", "Telemetry", "Telecontrol", "Remote Monitoring"],
    image: ph.weatherSensor.src,
    imageAlt: ph.weatherSensor.alt,
    imagePosition: ph.weatherSensor.position,
    hero: ph.rimpPresentation,
    gallery: [ph.telemetryWmsDashboard, ph.weatherSensor, ph.jointInspection, ph.rimpPresentation, ph.fieldStation],
    cover: "telemetry",
    featured: true,
  },
  {
    slug: "enterprise-catering-platform",
    title: "Enterprise Catering Platform",
    category: "Business & Internal Tools",
    year: "Ongoing",
    summary:
      "Customer platform and enterprise administration system for an industrial catering business producing ~8,000 meals per day.",
    overview: [
      "A full-stack platform for an industrial catering business producing approximately 8,000 meals per day. I am the sole developer — from requirements gathering with stakeholders, through architecture and UI/UX, to deployment and continuous improvement.",
      "On the customer side, the platform offers a menu catalog, online ordering and WhatsApp ordering. Behind it, an administration system covers the operational workflows that keep a kitchen of that scale running: ordering, procurement, inventory, warehouse and approvals.",
    ],
    role: "Sole developer — full lifecycle",
    context: "Commercial client project",
    highlights: [
      "Mapped ordering, procurement, inventory, warehouse and approval workflows directly with stakeholders.",
      "Built role-based access, order management, inventory & warehouse, supplier management, purchase requests and purchase orders.",
      "Operational dashboards and reporting for day-to-day decisions.",
      "Automated business notifications through WhatsApp API (Fonnte) integration.",
      "Designed system architecture, database schema, UI/UX and REST APIs.",
    ],
    stack: [
      "Next.js",
      "React",
      "TypeScript",
      "Tailwind CSS",
      "Next.js API Routes",
      "PostgreSQL",
      "Prisma ORM",
      "Supabase",
      "Vercel",
      "WhatsApp API (Fonnte)",
    ],
    links: [{ label: "Visit live site", href: "https://zks-catering-web-6fkr.vercel.app/" }],
    image: ph.zksDashboard.src,
    imageAlt: ph.zksDashboard.alt,
    hero: ph.zksDashboard,
    gallery: [
      ph.zksDashboard,
      ph.zksInventory,
      ph.zksProduction,
      ph.zksKitchen,
      ph.zksProcurement,
      ph.zksPurchaseOrders,
      ph.zksMenuCatalog,
    ],
    cover: "catering",
    featured: true,
  },
  {
    slug: "pancalingga-website",
    title: "Pancalingga Website",
    category: "Corporate Website",
    year: "Client work",
    summary:
      "Responsive company profile website delivered for a commercial client, from requirements and UI/UX design through deployment.",
    overview: [
      "A company profile website delivered for a commercial client. I owned the project end to end: gathering requirements, designing the UI/UX, building a responsive site, deploying it and handling client revisions.",
    ],
    role: "Designer & developer",
    context: "Commercial client project",
    highlights: [
      "Requirements gathering and UI/UX design.",
      "Responsive build for desktop, tablet and mobile.",
      "Deployment and client revision rounds.",
    ],
    stack: ["UI/UX Design", "Responsive Web", "Deployment"],
    links: [{ label: "Visit live site", href: "https://pancalingga.com/" }],
    image: ph.pancalinggaHero.src,
    imageAlt: ph.pancalinggaHero.alt,
    hero: ph.pancalinggaHero,
    gallery: [ph.pancalinggaHero],
    cover: "website",
    featured: true,
  },
  {
    slug: "amr-lidar-slam",
    title: "SLAM on an Autonomous Mobile Robot",
    category: "Robotics",
    year: "2024",
    summary:
      "Simultaneous Localization and Mapping on an AMR, integrating a LiDAR sensor for mapping and localization.",
    overview: [
      "An implementation of Simultaneous Localization and Mapping (SLAM) on an autonomous mobile robot. A LiDAR sensor was integrated so the robot could build a map of its surroundings and localize itself within it — the foundation for autonomous navigation.",
    ],
    role: "Robotics engineer",
    highlights: [
      "Integrated a LiDAR sensor with the robot platform.",
      "Implemented SLAM for mapping and localization.",
      "Built on ROS for robot software development.",
    ],
    stack: ["ROS", "SLAM", "LiDAR"],
    image: ph.slamRviz.src,
    imageAlt: ph.slamRviz.alt,
    cover: "slam",
    featured: true,
  },
  {
    slug: "edge-vision-tensorrt",
    title: "Edge Computer Vision on Jetson",
    category: "Applied AI",
    year: "2023 – 2024",
    summary:
      "YOLO object detection trained with PyTorch and TensorFlow, optimized with TensorRT for ~47–60 FPS on NVIDIA Jetson.",
    overview: [
      "During my R&D internship at PT Toyota Motor Manufacturing Indonesia, I developed and deployed YOLO-based computer vision models for robotics experiments.",
      "I prepared and labeled publicly available datasets, trained object detection models with PyTorch and TensorFlow on Google Colab, then optimized inference with NVIDIA TensorRT and deployed to NVIDIA Jetson Nano and Jetson Orin Nano — reaching approximately 47–60 FPS depending on the hardware platform.",
    ],
    role: "R&D Intern · Automation, Robotics & Applied AI",
    context: "PT Toyota Motor Manufacturing Indonesia",
    highlights: [
      "Prepared and labeled publicly available datasets.",
      "Trained YOLO object detection models with PyTorch and TensorFlow on Google Colab.",
      "Optimized inference with NVIDIA TensorRT — approx. 47–60 FPS depending on hardware.",
      "Integrated computer vision with robotics experiments.",
      "Ran object detection and semantic segmentation demos with NVIDIA Jetson Inference.",
    ],
    stack: ["YOLO", "PyTorch", "TensorFlow", "TensorRT", "Jetson Inference", "Google Colab"],
    image: ph.objectDetection.src,
    imageAlt: ph.objectDetection.alt,
    imagePosition: ph.objectDetection.position,
    gallery: [ph.objectDetection, ph.segmentation],
    cover: "vision",
    featured: true,
  },
  {
    slug: "amr-jetson-prototype",
    title: "AMR Prototype on NVIDIA Jetson",
    category: "Robotics",
    year: "2023",
    summary:
      "An autonomous mobile robot prototype built on embedded GPU computing platforms — Jetson Nano and Jetson Orin Nano.",
    overview: [
      "An autonomous mobile robot prototype built on NVIDIA's embedded GPU computing platforms, Jetson Nano and Jetson Orin Nano — giving the robot on-board compute for perception and autonomy.",
    ],
    role: "Robotics engineer",
    highlights: [
      "Built the AMR prototype around Jetson Nano and Jetson Orin Nano.",
      "Used ROS for robot software development.",
      "Strength-tested the AMR with a human load.",
      "Presented the AMR to the director and head of Yayasan Toyota Indonesia.",
    ],
    stack: ["NVIDIA Jetson Nano", "Jetson Orin Nano", "ROS", "LiDAR", "Autodesk Fusion"],
    image: ph.amrLoadTest.src,
    imageAlt: ph.amrLoadTest.alt,
    imagePosition: ph.amrLoadTest.position,
    hero: ph.amrPresentation,
    gallery: [ph.amrLoadTest, ph.amrPresentation, ph.agvChassis],
    cover: "jetson",
    featured: true,
  },
  {
    slug: "early-robotics",
    title: "Early Robotics Work",
    category: "Embedded",
    year: "2022",
    summary: "An Arduino-based fire-fighting robot and a digital line tracer with PID control.",
    overview: [
      "Early hands-on robotics projects: an Arduino-based fire-fighting robot, and a digital line-tracing robot using PID control to follow a track smoothly.",
    ],
    highlights: ["Arduino-based fire-fighting robot.", "Digital line tracer with PID control."],
    stack: ["Arduino", "C/C++", "PID Control"],
    cover: "robot",
  },
  // ── Placeholder: replace with your next project (GitHub repo, robotics, etc.) ──
  {
    slug: "next-project",
    title: "Your next project",
    category: "Coming soon",
    year: "—",
    summary:
      "Placeholder slot. More GitHub repositories, software and robotics projects will be added here.",
    overview: ["This is a placeholder. Edit src/data/projects.ts to replace it with a real project."],
    highlights: [],
    stack: [],
    cover: "placeholder",
    placeholder: true,
  },
];

export const featuredProjects = projects.filter((p) => p.featured);

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}
