import Work1 from "../../assets/poker.png";
import Work2 from "../../assets/exam.png";
import Work3 from "../../assets/geo.png";
import Work4 from "../../assets/pkm.png";
import Work5 from "../../assets/srikandi/srikandi.png";
import Work5_1 from "../../assets/srikandi/srikandi1.png";
import Work5_2 from "../../assets/srikandi/srikandi2.png";
import Work5_3 from "../../assets/srikandi/srikandi3.png";
import Work5_4 from "../../assets/srikandi/srikandi4.png";
import Work6 from "../../assets/sspm/sspm.png";
import Work6_1 from "../../assets/sspm/sspm1.png";
import Work6_2 from "../../assets/sspm/sspm2.png";
import Work6_3 from "../../assets/sspm/sspm3.png";
import Work6_4 from "../../assets/sspm/sspm4.png";
import Work7 from "../../assets/lah-kerja/lahkerja.png";
import Work7_1 from "../../assets/lah-kerja/lahkerja1.png";
import Work7_2 from "../../assets/lah-kerja/lahkerja2.png";
import Work7_3 from "../../assets/lah-kerja/lahkerja3.png";
import Work7_4 from "../../assets/lah-kerja/lahkerja4.png";
import Work7_5 from "../../assets/lah-kerja/lahkerja5.png";
import Work7_6 from "../../assets/lah-kerja/lahkerja6.png";
import Work8 from "../../assets/atisisbada/atisisbada.png";
import Work8_1 from "../../assets/atisisbada/atisisbada1.png";
import Work8_2 from "../../assets/atisisbada/atisisbada2.png";
import Work8_3 from "../../assets/atisisbada/atisisbada3.png";
import Work9 from "../../assets/bayar-air/bayarair.png";
import Work9_1 from "../../assets/bayar-air/bayarair1.png";
import Work9_2 from "../../assets/bayar-air/bayarair2.png";
import Work9_3 from "../../assets/bayar-air/bayarair3.png";
import Work9_4 from "../../assets/bayar-air/bayarair4.png";
import Work9_5 from "../../assets/bayar-air/bayarair5.png";
import Work9_6 from "../../assets/bayar-air/bayarair6.png";
import Work10 from "../../assets/komdigi/komdigi.png";
import Work10_1 from "../../assets/komdigi/komdigi1.png";
import Work10_2 from "../../assets/komdigi/komdigi2.png";
import Work10_3 from "../../assets/komdigi/komdigi3.png";
import Work11 from "../../assets/atisisbada-page/atisisbada.png";
//import Work11_1 from "../../assets/atisisbada-page/atisisbada1.png";
//import Work11_2 from "../../assets/atisisbada-page/atisisbada2.png";
//import Work11_3 from "../../assets/atisisbada-page/atisisbada3.png";

const Menu = [
  {
    id: 1,
    image: Work1,
    title: "Poker CLI Game - Academic Project",
    category: ["Other"],
    repositoryUrl: "https://github.com/restu-akbar/poker-tongkrongan.git",
    tech: [
      "C++",
      "Pointer in C",
      "Memory Management",
      "Data Structure & Algorithms (Linked List, Queue, Stack, etc)",
    ],
  },
  {
    id: 2,
    image: Work2,
    title: "Exam CLI App - Academic Project",
    category: ["Other"],
    repositoryUrl: "https://github.com/restu-akbar/Proyek2-C2.git",
    tech: [
      "C++",
      "Pointer in C",
      "Memory Management",
      "Data Structure (Linked List)",
    ],
  },
  {
    id: 3,
    image: Work3,
    title: "Geolocation App - Dummy Project",
    category: ["NodeJs"],
    repositoryUrl: "https://github.com/restu-akbar/sig-app.git",
    tech: ["Express", "LeafletJs"],
    description:
      "A simple geolocation application that allows users to view and mark locations on an interactive map. This project is built with Express as the backend and LeafletJs for the map, designed to demonstrate basic location features and spatial data visualization in real time.",
  },
  {
    id: 4,
    image: Work4,
    title: "PKM Management App - Academic Project",
    category: ["Laravel"],
    repositoryUrl: "https://github.com/restu-akbar/pkm-polban.git",
    description:
      "This website serves as a platform for the academic community of Politeknik Negeri Bandung to manage the submission of internal Program Kreativitas Mahasiswa (PKM) proposals. Through the system, students can submit proposals online, track their submission status, and receive feedback from reviewers.The platform also facilitates lecturers in reviewing, validating, and selecting proposals more efficiently and transparently. By streamlining these processes, the platform helps ensure a more structured and accountable selection system while supporting the improvement of both the quality and quantity of proposals advancing to national-level funding.",
    tech: ["Fullstack Laravel", "Bootstrap"],
  },
  {
    id: 5,
    image: Work5,
    title: "Srikandi App - Academic Project",
    category: ["Kotlin"],
    repositoryUrl: "https://github.com/DzakiNurhidayat/srikandi-app",
    description:
      "Srikandi is an mobile-based application developed for use within university environments. The platform is designed as a secure, confidential, and responsive reporting tool for incidents of violence, while also providing digital analysis features to help universities systematically map and address cases. Through Srikandi, users—including victims, witnesses, and relevant parties—can report incidents of violence. The system is equipped with supporting features such as psychological and legal assistance services, report status tracking, and educational modules for awareness and prevention.Srikandi aims to foster a safer, more inclusive, and violence-free campus environment, in line with the com",
    gallery: [Work5, Work5_1, Work5_2, Work5_3, Work5_4],
    tech: [
      "Jetpack Compose",
      "Clean Architecture",
      "Ktor",
      "Dependency Injection (Koin & Dagger Hilt)",
    ],
  },
  {
    id: 6,
    image: Work6,
    title: "SSPM - Intern Project",
    category: ["Laravel"],
    url: "https://www.progantara.com/#projects",
    description:
      "The Tax Period Notification System (SSPM) AkuPrim is a web application developed to support tax data recording and management for AkuPrim, a tax consulting firm, in serving their clients. The application includes features such as income tax (PPh) and value-added tax (VAT) recording, invoice reporting, and other tax documentation required by consultants. In this project, I served as a Fullstack Developer.",
    contributions: [
      "Integrated Laravel Excel for data import and export features",
      "Developed email functionality using Laravel’s mailing system",
      "Built frontend components with Laravel Livewire",
    ],
    gallery: [Work6, Work6_1, Work6_2, Work6_3, Work6_4],
    tech: [
      "Laravel Livewire",
      "Laravel Maatwebsite Excel",
      "Yajra Datatables",
      "Laravel Email",
    ],
  },
  {
    id: 7,
    image: Work7,
    title: "Lah Kerja - Intern Project",
    category: ["Laravel"],
    url: "https://lahkerja-dev.progantara.com/",
    description:
      "Lah Kerja is an integrated web and mobile application designed to support human resource (HR) management. The platform streamlines administrative processes such as attendance, overtime, leave, and employee loans, while improving efficiency, data accuracy, and accessibility for both management and employees. In this project, I served as a Backend Developer and DevOps Engineer.",
    contributions: [
      "Implemented backend logic using Laravel.",
      "Designed and developed RESTful APIs for mobile and web application integration.",
      "Collaborated with the frontend team by providing API documentation via Postman and integration support.",
      "Designed and optimized database schemas using MySQL.",
      "Configured CI/CD pipelines (GitHub CI/CD) to automate deployments.",
      "Managed and maintained production servers in a Linux environment with cPanel monitoring",
    ],
    gallery: [Work7, Work7_1, Work7_2, Work7_3, Work7_4, Work7_5, Work7_6],
    tech: [
      "Laravel Api",
      "Yajra Datatables",
      "Laravel Scheduler using Cron Job",
      "Hostinger CPanel & SSH ",
      "GitHub Actions",
    ],
  },
  {
    id: 8,
    image: Work8,
    title: "Atisisbada - Automated Testing",
    category: ["Other"],
    repositoryUrl: "https://github.com/restu-akbar/atisisbada-test.git",
    description:
      "In this project, I served as a QA Tester, focusing on automated testing using Selenium (Python) for ATISISBADA (Regional Asset Management Information System). This application is used by local governments in Indonesia to manage the entire lifecycle of regional assets, including procurement, utilization, maintenance, and disposal.",
    contributions: [
      "Designed, developed, and executed automated test scripts to validate application functionality.",
      "Enhanced testing efficiency while reducing reliance on manual testing.",
      "Accelerated the testing process and ensured consistent results using Selenium (Python).",
      "Identified defects at early development stages, minimizing risks in production.",
      "Contributed to software quality improvement and ensured application compliance with functional standards.",
    ],
    gallery: [Work8, Work8_1, Work8_2, Work8_3],
    tech: ["Selenium", "Python Unittest"],
  },
  {
    id: 9,
    image: Work9,
    title: "Bayar Air - Intern Project",
    category: ["Laravel", "Kotlin"],
    repositoryUrl: "https://github.com/restu-akbar/bayar-air-app.git",
    url: "https://bayarair.progantara.com",
    gallery: [Work9, Work9_1, Work9_2, Work9_3, Work9_4, Work9_5, Work9_6],
    description:
      "Bayar Air is a mobile-based application developed to simplify and modernize the process of recording water meter usage in a practical, secure, and transparent way. The platform is designed to give users real-time access to their recorded data, ensuring accuracy and reducing manual errors in the billing process. I contributed as a Backend Developer, Mobile Developer, and DevOps Engineer.",
    contributions: [
      "Designed and developed a mobile-based application for water meter recording.",
      "Implemented features to log and store water usage data.",
      "Built interface with Compose Multiplatform.",
      "Designed and optimized database schemas using MySQL.",
      "Developed RESTful APIs using laravel.",
      "Applied Koin for dependency injection to improve modularity and scalability.",
      "Configured CI/CD pipelines (GitHub CI/CD) to automate deployments.",
      "Managed and maintained production servers in a Linux environment with cPanel monitoring",
    ],
    tech: [
      "Kotlin Compose Multiplatform",
      "Koin Dependency Injection",
      "Ktor & HTTP Client",
      "Clean Architecture",
      "Laravel Api",
      "Hostinger CPanel & SSH ",
      "GitHub Actions",
    ],
  },
  {
    id: 10,
    image: Work10,
    title: "Profiling & Dashboard Kepatuhan Komdigi",
    category: ["Laravel"],
    url: "https://datahub.komdigi.go.id/",
    gallery: [Work10, Work10_1, Work10_2, Work10_3],
    description:
      "Profiling Komdigi is an application used to display profiles of broadcasting, postal, and telecommunications companies registered at Komdigi. The application presents detailed company data sourced from Komdigi Datahub. Dashboard Kepatuhan is a Komdigi application that displays annual compliance reports of companies toward Komdigi regulations. I contributed as a Fullstack Developer focusing on API updates and data integration.",
    contributions: [
      "Updated Profiling Komdigi APIs to support company profile data for broadcasting, postal, and telecommunications sectors.",
      "Identified and integrated data sources from Komdigi Datahub for use in Profiling and Dashboard Kepatuhan applications.",
      "Developed and improved APIs to display annual compliance report data on the Dashboard Kepatuhan.",
      "Ensured data consistency and accuracy between Datahub Komdigi and application services.",
      "Maintained and optimized backend services using Laravel.",
    ],
    tech: [
      "Laravel API",
      "Laravel Scheduler",
      "RESTful API",
      "MySQL",
      "GitHub",
    ],
  },
  {
    id: 11,
    image: Work11,
    title: "Atisisbada Content Management System",
    category: ["NodeJs"],
    url: "https://dev-atis-landingpage.atisisbada.id/",
    gallery: [
      Work11,
      // Work11_1,
      // Work11_2,
      // Work11_3,
      // Work11_4,
      // Work11_5,
      // Work11_6,
    ],
    description:
      "Atisisbada CMS is a content management system for managing a dynamic landing page. The system enables administrators to manage page content, sections, and media through a web interface. I contributed as a Fullstack Developer and DevOps Engineer, focusing on application development and server management.",
    contributions: [
      "Developed a dynamic landing page using Next.js.",
      "Built CMS features to manage landing page sections and content.",
      "Deployed and managed the application server via SSH.",
      "Configured and maintained production environment for the Next.js application.",
    ],
    tech: [
      "Next.js",
      "React",
      "Node.js",
      "SSH",
      "Linux Server",
      "GitHub",
      "BetterAuth",
    ],
  },
];

export default Menu;
