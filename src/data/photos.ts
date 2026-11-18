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
    height: 592,
  },
  wmsStations: {
    src: "/images/projects/telemetry-wms-stations.jpg",
    alt: "Telemetry overview listing 58 stations with online, offline and attention counts, and station cards grouped by upstream and headworks",
    caption: "Telemetry overview — station status and sensor health at a glance",
    width: 1280,
    height: 765,
  },
  wmsTelecontrol: {
    src: "/images/projects/telemetry-telecontrol-gate.jpg",
    alt: "Telecontrol station page showing a gate position diagram, protection alarms, gate status and a live CCTV feed",
    caption: "Telecontrol station — gate position, protection alarms and live CCTV",
    width: 1280,
    height: 765,
  },
  wmsMap: {
    src: "/images/projects/telemetry-wms-map.jpg",
    alt: "Satellite map of the Rentang irrigation network with main and secondary canal routes and weir nodes",
    caption: "Map view of the irrigation network, canal routes and weirs",
    width: 1280,
    height: 765,
  },
  wmsStationDetail: {
    src: "/images/projects/telemetry-wms-station-detail.jpg",
    alt: "Station detail page with water level, discharge and meteorology readings such as humidity, temperature, rainfall and wind",
    caption: "Station detail — water level, discharge and weather readings with data-quality flags",
    width: 1280,
    height: 765,
  },
  // ── SmartMoney (voice-first finance assistant) ───────────────
  smartMoneyDashboard: {
    src: "/images/projects/smartmoney-dashboard.jpg",
    alt: "SmartMoney dashboard with a spoken financial briefing, balance, income, spending and savings cards, and AI insights",
    caption: "Dashboard with the assistant's spoken financial briefing",
    width: 1600,
    height: 830,
  },
  smartMoneyReports: {
    src: "/images/projects/smartmoney-reports.jpg",
    alt: "SmartMoney reports page with an AI voice summary, period totals and export to PDF and CSV",
    caption: "Reports with an AI voice summary and PDF / CSV export",
    width: 1600,
    height: 720,
  },

  // ── Xtur (AI CCTV analytics) ─────────────────────────────────
  xturOverview: {
    src: "/images/projects/xtur-overview.jpg",
    alt: "Xtur overview with camera and stream status, and a 7-day chart of detected people and vehicles",
    caption: "Overview: camera health and a 7-day history of detections",
    width: 1600,
    height: 871,
  },
  xturLogs: {
    src: "/images/projects/xtur-detection-logs.jpg",
    alt: "Xtur detection log table with object class, track ID, camera and confidence, plus CSV and PDF export",
    caption: "Detection logs with track IDs, confidence and CSV / PDF export",
    width: 1600,
    height: 900,
  },
  xturCameras: {
    src: "/images/projects/xtur-cameras.jpg",
    alt: "Xtur camera management with four online dual-stream cameras and their detection classes",
    caption: "Multi-camera management with dual streams per camera",
    width: 1600,
    height: 900,
  },
  xturEngine: {
    src: "/images/projects/xtur-engine-health.jpg",
    alt: "Xtur engine health page showing CPU, RAM, Redis buffer and about 4 ms AI inference latency per frame",
    caption: "Engine health: CPU, RAM, Redis stream buffer and ~4 ms inference per frame",
    width: 1600,
    height: 900,
  },

  // ── ITS: education & campus activities ───────────────────────
  gpblSit: {
    src: "/images/education/gpbl-sit-energy-monitoring.jpg",
    alt: "Elfano with his GPbL team of ITS and Japanese students and a professor from Shibaura Institute of Technology, after their presentation",
    caption: "GPbL with Shibaura Institute of Technology — after our energy monitoring presentation at ITS",
    width: 1024,
    height: 768,
    position: "50% 45%",
  },
  itsGraduation130: {
    src: "/images/education/its-graduation-130.jpg",
    alt: "Graduates in gowns waving together in the ITS graduation hall at the 130th commencement",
    caption: "ITS 130th graduation ceremony (Sep 2024)",
    width: 1600,
    height: 1200,
    position: "50% 62%",
  },
  itsGraduationDept: {
    src: "/images/education/its-graduation-automation-dept.jpg",
    alt: "Elfano and a fellow graduate in gowns and medals beneath the Electrical Automation Engineering department banner",
    caption: "Graduation day at the Department of Electrical Automation Engineering (ITS)",
    width: 768,
    height: 1024,
    position: "50% 75%",
  },
  kri2022: {
    src: "/images/education/kri-2022-liaison-officer.jpg",
    alt: "Elfano with fellow KRI 2022 committee members in purple shirts and ITS Rector Prof. Mochamad Ashari in front of the event stage",
    caption: "Liaison officer at Kontes Robot Indonesia 2022, hosted by ITS — with Rector Prof. Mochamad Ashari",
    width: 899,
    height: 1600,
    position: "50% 72%",
  },
} satisfies Record<string, Photo>;
