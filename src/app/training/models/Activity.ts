import { ActivityType } from './ActivityType';

export interface Activity {
  id: number;
  typeActivity: ActivityType;
  pathwayId: string;
  pathwayTitle: string;
  estado: string;
  completedDate: Date;
  enrollmentDate: Date;
  recentActivityDate: Date;
  completionPercent: number;
  observaciones: string;
  sAGA: string;
  gGID: string;
  typeActivityId: number;
}
