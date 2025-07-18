export interface Project {
  id: number;
  title: string;
  meta: string;
  description: string;
  links: string[];
  related: string[];
  tags: string[];
  isMajor?: boolean;
  position: {
    x: number; // percentage
    y: number; // percentage
  };
}

export const projectData: Record<number, Project> = {
  1: {
    id: 1,
    title: "Download and Paint Like a Master",
    meta: "Writing / Installation • 2021",
    description: "An exploration of interface materiality through Munch's digitized brushes.",
    links: ["View Installation", "Read Essay", "Documentation"],
    related: ["The Fertile Nexus", "Real-time Archaeology", "Window/Wall"],
    tags: ["Interface Theory", "Digital Materiality", "Art History"],
    isMajor: true,
    position: { x: 15, y: 20 }
  },
  2: {
    id: 2,
    title: "The Fertile Nexus",
    meta: "Research / Theory • 2022",
    description: "A theoretical framework for understanding creative interfaces as generative spaces.",
    links: ["Read Paper", "View Diagrams"],
    related: ["Download and Paint Like a Master", "Interface Territories"],
    tags: ["Theory", "Interface Design", "Creative Tools"],
    position: { x: 45, y: 35 }
  },
  3: {
    id: 3,
    title: "Real-time Archaeology",
    meta: "Performance / Data • 2023",
    description: "Live excavation of browser histories and cache files as archaeological artifacts.",
    links: ["Watch Performance", "Download Data Sets"],
    related: ["Temporal Fragments", "Digital Sediment"],
    tags: ["Performance", "Data Archaeology", "Browser Art"],
    position: { x: 75, y: 15 }
  },
  4: {
    id: 4,
    title: "Window/Wall",
    meta: "Installation / Architecture • 2022",
    description: "A meditation on the interface as architectural element.",
    links: ["See Installation", "Read Statement"],
    related: ["Boundary Conditions", "Spatial Interfaces"],
    tags: ["Architecture", "Projection", "Spatial Design"],
    isMajor: true,
    position: { x: 25, y: 65 }
  },
  5: {
    id: 5,
    title: "Interface Territories",
    meta: "Mapping / Research • 2023",
    description: "Cartographic explorations of digital interaction spaces.",
    links: ["View Maps", "Explore Data"],
    related: ["Spatial Interfaces", "Digital Geography"],
    tags: ["Mapping", "Spatial Theory", "Interface Analysis"],
    position: { x: 65, y: 50 }
  },
  6: {
    id: 6,
    title: "Temporal Fragments",
    meta: "Time-based Media • 2021",
    description: "Collected moments of interface interruption and system poetry.",
    links: ["Watch Videos", "Download Archive"],
    related: ["Real-time Archaeology", "System States"],
    tags: ["Time-based Media", "Glitch", "System Poetry"],
    position: { x: 85, y: 75 }
  },
  7: {
    id: 7,
    title: "Boundary Conditions",
    meta: "Interactive / Web • 2023",
    description: "A web-based exploration of edge cases in user interface design.",
    links: ["Visit Site", "View Code"],
    related: ["Window/Wall", "Edge Cases"],
    tags: ["Web Art", "Interactive", "UI/UX"],
    position: { x: 35, y: 85 }
  },
  8: {
    id: 8,
    title: "Living Systems",
    meta: "Ongoing • 2024",
    description: "An ongoing investigation into interfaces that breathe and evolve.",
    links: ["Experience Live", "Read Documentation"],
    related: ["Adaptive Interfaces", "Responsive Systems"],
    tags: ["Living Systems", "Adaptive Design", "Environmental Response"],
    isMajor: true,
    position: { x: 55, y: 25 }
  }
};

