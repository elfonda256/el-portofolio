import type { Photo } from "./types";

/**
 * Photo library — every real photo on the site, defined once.
 * Projects (projects.ts), the timeline (experience.ts) and the About/band
 * section (site.ts) pick photos from here by name.
 * Captions come from Elfano's own descriptions.
 */
export const library = {
  // ── Rentang Irrigation telemetry ─────────────────────────────
  weatherSensor: {
    src: "/images/projects/telemetry-weather-sensor.jpg",
    alt: "Elfano with a field team installing a weather sensor mast and solar panel at a gauging station beside an irrigation canal",
    caption: "Installing weather sensors at a telemetry gauging station",
    width: 1202,
    height: 1600,
    position: "50% 30%",
  },
  jointInspection: {
    src: "/images/projects/telemetry-joint-inspection.jpg",
    alt: "Elfano and a colleague in hard hats inspecting a telemetry panel and data logger inside a station",
    caption: "Joint inspection with a Japanese telemetry expert",
    width: 955,
    height: 1280,
    position: "50% 40%",
  },
  rimpPresentation: {
    src: "/images/field-presenting-rimp.jpg",
    alt: "Elfano presenting the telemetering system of the Rentang Irrigation Modernization Project on stage",
    caption: "Presenting the RIMP telemetering system",
    width: 2000,
    height: 1500,
    position: "60% 50%",
  },
  fieldStation: {
    src: "/images/field-station.jpg",
    alt: "Elfano in a hard hat and safety vest giving a thumbs up in front of a fenced field station beside an irrigation canal",
    caption: "In the field",
    width: 1280,
    height: 960,
    position: "50% 45%",
  },

  // ── Toyota R&D: AMR, SLAM, computer vision ───────────────────
  amrLoadTest: {
    src: "/images/projects/amr-load-test.jpg",
    alt: "Elfano and a colleague testing an autonomous mobile robot carrying a person's weight",
    caption: "Strength-testing the AMR with a human load",
    width: 725,
    height: 1280,
    position: "50% 62%",
  },
  amrPresentation: {
    src: "/images/projects/toyota-amr-presentation.jpg",
    alt: "Presenting an autonomous mobile robot with its chassis open to a group of Toyota Indonesia leaders",
    caption: "Presenting the AMR to the director and head of Yayasan Toyota Indonesia",
    width: 1206,
    height: 1177,
    position: "50% 55%",
  },
  agvChassis: {
    src: "/images/projects/agv-chassis-design.jpg",
    alt: "3D model of an AGV chassis with LiDAR, Jetson module, motors and four wheels in Autodesk Fusion",
    caption: "AGV chassis design in Autodesk Fusion",
    width: 890,
    height: 530,
  },
  slamRviz: {
    src: "/images/projects/slam-rviz.jpg",
    alt: "RViz showing a LiDAR scan outlining a room with the robot's scan and odometry frames",
    caption: "RViz view while SLAM is running",
    width: 1206,
    height: 851,
  },
  segmentation: {
    src: "/images/projects/jetson-segmentation.jpg",
    alt: "Camera preview with semantic segmentation overlay colouring floor, walls and a person, running on Jetson with TensorRT",
    caption: "Semantic segmentation preview (Jetson Inference)",
    width: 1206,
    height: 420,
  },
  objectDetection: {
    src: "/images/projects/jetson-object-detection.jpg",
    alt: "Object detection on Jetson labelling Elfano as a person with 97.2% confidence",
    caption: "Object detection with Jetson Inference",
    width: 1040,
    height: 643,
    position: "50% 35%",
  },
  presdirTmmin: {
    src: "/images/projects/toyota-presdir-tmmin.jpg",
    alt: "Elfano with the President Director of TMMIN, both giving a thumbs up",
    caption: "With the President Director of TMMIN after a presentation",
    width: 1168,
    height: 634,
    position: "35% 40%",
  },

  // ── Enterprise Catering Platform (ZKS Catering) ──────────────
  zksDashboard: {
    src: "/images/projects/zks-dashboard-logistik.jpg",
    alt: "Operations and dispatch console dashboard with central kitchen capacity tracking and logistics orders",
    caption: "Operations and dispatch console dashboard",
    width: 1024,
    height: 640,
  },
  zksInventory: {
    src: "/images/projects/zks-inventory-warehouse.jpg",
    alt: "Command center inventory and warehouse dashboard showing stock value and material throughput",
    caption: "Inventory command center and warehouse management",
    width: 1024,
    height: 640,
  },
  zksProduction: {
    src: "/images/projects/zks-production-bom.jpg",
    alt: "Central kitchen production schedule and bill of materials with work orders",
    caption: "Production scheduling & Bill of Materials (BOM)",
    width: 1024,
    height: 640,
  },
  zksKitchen: {
    src: "/images/projects/zks-kitchen-kds.jpg",
    alt: "Kitchen Display System (KDS) console with station dispatch queues and HACCP compliance",
    caption: "Kitchen Display System (KDS) & HACCP monitoring",
    width: 1024,
    height: 640,
  },
  zksProcurement: {
    src: "/images/projects/zks-procurement-pr.jpg",
    alt: "Enterprise procurement workspace with smart purchase request recommendations and approval workflow",
    caption: "Smart procurement recommendations & PR workflow",
    width: 1024,
    height: 640,
  },
  zksPurchaseOrders: {
    src: "/images/projects/zks-purchase-orders.jpg",
    alt: "Purchase order lifecycle tracking and 4-tier chain of procurement approval",
    caption: "Purchase order management & 4-tier approval chain",
    width: 1024,
    height: 640,
  },
  zksMenuCatalog: {
    src: "/images/projects/zks-menu-catalog.jpg",
    alt: "Customer-facing balanced nutrition menu catalog with daily shift rotation",
    caption: "Customer portal & daily menu rotation",
    width: 1024,
    height: 618,
  },

  // ── Pancalingga Website ───────────────────────────────────────
  pancalinggaHero: {
    src: "/images/projects/pancalingga-hero.jpg",
    alt: "PT Panca Lingga Perkasa corporate website hero and portfolio section",
    caption: "Corporate website homepage & service showcase",
    width: 1024,
    height: 640,
  },

  // ── Rentang Telemetry & IoT ──────────────────────────────────
  telemetryWmsDashboard: {
    src: "/images/projects/telemetry-wms-dashboard.jpg",
    alt: "Rentang Irrigation Monitoring Application WMS Integration telemetry station list and sensor telemetry readings",
    caption: "Rentang WMS telemetry monitoring web dashboard",
    width: 1024,
    height: 640,
  },
} satisfies Record<string, Photo>;
