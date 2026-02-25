'use client';

import { useAppSelector } from '@/store/hooks';
import DefaultPanel from './DefaultPanel';
import ProjectDetail from './ProjectDetail';

export default function DetailPanel() {
  const { selectedProject } = useAppSelector((state) => state.portfolio);
  return selectedProject ? <ProjectDetail /> : <DefaultPanel />;
}
