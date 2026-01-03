import fs from 'fs/promises';
import path from 'path';
import { ChurchStatistics, ScheduleEvent, UMKM } from '@/types/data';

const CONTENT_DIR = path.join(process.cwd(), '../web-paroki-content');

export async function getChurchStatistics(): Promise<ChurchStatistics | null> {
  try {
    const filePath = path.join(CONTENT_DIR, 'statistik.json');
    const fileContent = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(fileContent) as ChurchStatistics;
  } catch (error) {
    console.error('Error reading statistik.json:', error);
    return null;
  }
}

export async function getScheduleEvents(): Promise<ScheduleEvent[]> {
  try {
    const filePath = path.join(CONTENT_DIR, 'jadwal-kegiatan.json');
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const data = JSON.parse(fileContent);
    // Ensure it's an array
    if (Array.isArray(data)) {
        // Sort by date/time if needed? Maybe nearest future first.
        // For now just return as is or sort by date asc
        return data.sort((a, b) => new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime());
    }
    return [];
  } catch (error) {
    console.error('Error reading jadwal-kegiatan.json:', error);
    return [];
  }
}

export async function getUMKM(): Promise<UMKM[]> {
  try {
    const filePath = path.join(CONTENT_DIR, 'umkm.json');
    const fileContent = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(fileContent);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    console.error('Error reading umkm.json:', error);
    return [];
  }
}
