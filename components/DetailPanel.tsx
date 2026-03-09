'use client';

import { useAppSelector } from '@/store/hooks';
import DefaultPanel from './DefaultPanel';
import ProjectDetail from './ProjectDetail';
import AboutPanel from './AboutPanel';

export default function DetailPanel() {
  const { sidebarPanel } = useAppSelector((state) => state.portfolio);

  if (sidebarPanel === 'project') return <ProjectDetail />;
  if (sidebarPanel === 'about') return <AboutPanel />;
  return <DefaultPanel />;
}
