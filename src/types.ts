/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Site {
  id: string;
  name: string;
  location?: string;
  createdAt: string;
  status: 'active' | 'completed';
  laborerIds: string[];
}

export interface Laborer {
  id: string;
  name: string;
  dailyWage: number;
  phone?: string;
  active: boolean;
}

export type LogType = 'attendance' | 'advance' | 'payment';
export type AttendanceStatus = 'present' | 'half-day' | 'absent';

export interface AttendanceLog {
  id: string;
  laborerId: string;
  siteId: string;
  date: string;
  type: LogType;
  status?: AttendanceStatus;
  amount?: number;
  note?: string;
}

export interface SitePhoto {
  id: string;
  siteId: string;
  url: string;
  caption?: string;
  timestamp: string;
}

export interface MaterialRates {
  brickPrice: number;
  cementPrice: number;
  sandPrice: number;
  updatedAt: string;
}

export interface CalculationResult {
  bricks: number;
  cementBags: number;
  sandCubicFeet: number;
  concreteVolume: number;
}
