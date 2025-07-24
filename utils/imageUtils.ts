// Known gallery images for each project
// This could be extended to read from filesystem or database in the future
const PROJECT_IMAGES: Record<string, string[]> = {
  '1': ['Screenshot (6).png', 'Screenshot (8).png', 'Screenshot (9).png', 'Screenshot (13).png'],
  // Add more projects as needed
};

export interface ProjectImages {
  thumbnail: string | null;
  gallery: string[];
}

export function getProjectImages(projectId: number): ProjectImages {
  const id = projectId.toString();
  
  // Check if thumbnail exists (assume it exists for now, could be made dynamic)
  const thumbnail = `/images/projects/${id}/thumbnail.jpg`;
  
  // Get gallery images for this project
  const galleryImages = PROJECT_IMAGES[id] || [];
  
  return {
    thumbnail,
    gallery: galleryImages
  };
}

export function getProjectThumbnailUrl(projectId: number): string | null {
  return `/images/projects/${projectId}/thumbnail.jpg`;
}

export function getProjectGalleryImages(projectId: number): string[] {
  const id = projectId.toString();
  return PROJECT_IMAGES[id] || [];
}