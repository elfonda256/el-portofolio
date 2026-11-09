import type { Service } from "./types";

/**
 * Products & services. These describe what Elfano offers, based on work
 * already shown in the CV. Add real products (apps, templates, tools) here
 * with a `link` when they exist.
 */
export const services: Service[] = [
  {
    title: "Business systems & internal tools",
    description:
      "Custom web platforms that model how your operation actually runs — ordering, procurement, inventory, approvals and reporting.",
    deliverables: ["Process mapping", "Role-based admin", "Dashboards & reports", "WhatsApp notifications"],
    cover: "catering",
  },
  {
    title: "Company profile websites",
    description:
      "Responsive, fast company websites — from requirements and UI/UX design through deployment and revisions.",
    deliverables: ["UI/UX design", "Responsive build", "Deployment", "Revisions"],
    cover: "website",
  },
  {
    title: "Industrial IoT & monitoring",
    description:
      "Telemetry and remote monitoring: connecting field sensors, data loggers and gateways so data reaches the people who act on it.",
    deliverables: ["Modbus / MQTT / GSM", "Data acquisition", "Remote monitoring", "System integration"],
    cover: "telemetry",
  },
];
