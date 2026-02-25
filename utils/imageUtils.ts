export async function fetchProjectImages(projectId: number): Promise<string[]> {
  try {
    const response = await fetch(`/api/projects/${projectId}/images`);
    if (!response.ok) throw new Error('Failed to fetch images');
    const images = await response.json();
    return images.map((img: { blobUrl: string }) => img.blobUrl);
  } catch {
    return [];
  }
}
