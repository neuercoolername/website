export interface ProjectImage {
  id: number;
  blobUrl: string;
  filename: string;
  altText?: string;
  displayOrder: number;
}

export async function getProjectImages(projectId: number): Promise<ProjectImage[]> {
  try {
    const response = await fetch(`/api/projects/${projectId}/images`);
    if (!response.ok) {
      throw new Error('Failed to fetch images');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching project images:', error);
    return [];
  }
}

// Legacy function for compatibility - returns just the URLs
export async function getProjectGalleryImages(projectId: number): Promise<string[]> {
  const images = await getProjectImages(projectId);
  return images.map(img => img.blobUrl);
}