"use server";

import { revalidatePath } from "next/cache";
import { getFile, commitFiles } from "@/lib/github/operations";

const UMKM_FILE = "umkm.json";
const STATISTIK_FILE = "statistik.json";
const JADWAL_FILE = "jadwal-kegiatan.json";

export interface UMKMData {
  id: string;
  owner: string;
  businessName: string;
  address: string;
  phone: string;
  type: string;
  description: string;
}

export interface StatistikData {
  churches: number;
  wards: number;
  families: number;
  parishioners: number;
  lastUpdated?: string;
}

export interface JadwalEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time: string;
  location: string;
  description: string;
  category: "liturgi" | "kegiatan" | "rapat" | "lainnya";
}

// UMKM Actions
export async function getUMKM(): Promise<UMKMData[]> {
  const content = await getFile(UMKM_FILE);
  if (!content) return [];
  try {
    return JSON.parse(content);
  } catch (e) {
    console.error("Error parsing UMKM data:", e);
    return [];
  }
}

export async function saveUMKM(data: UMKMData[]) {
  try {
    await commitFiles(
      [{ path: UMKM_FILE, content: JSON.stringify(data, null, 2) }],
      `Update UMKM data (${data.length} entries)`
    );
    revalidatePath("/data/umkm");
    revalidatePath("/admin/data/umkm");
    return { success: true };
  } catch (error: any) {
    console.error("Error saving UMKM data:", error);
    return { success: false, error: error.message };
  }
}

// Statistik Actions
export async function getStatistik(): Promise<StatistikData | null> {
  const content = await getFile(STATISTIK_FILE);
  if (!content) return null;
  try {
    return JSON.parse(content);
  } catch (e) {
    console.error("Error parsing statistik data:", e);
    return null;
  }
}

export async function saveStatistik(data: StatistikData) {
  try {
    const dataWithDate = {
        ...data,
        lastUpdated: new Date().toISOString()
    };
    await commitFiles(
      [{ path: STATISTIK_FILE, content: JSON.stringify(dataWithDate, null, 2) }],
      "Update statistik data"
    );
    revalidatePath("/data/statistik");
    revalidatePath("/profil"); // Statistics are shown in profile page too
    revalidatePath("/admin/data/statistik");
    return { success: true };
  } catch (error: any) {
    console.error("Error saving statistik data:", error);
    return { success: false, error: error.message };
  }
}

// Schedule Actions
export async function getJadwalKegiatan(): Promise<JadwalEvent[]> {
    const content = await getFile(JADWAL_FILE);
    if (!content) return [];
    try {
        return JSON.parse(content);
    } catch (e) {
        console.error("Error parsing jadwal kegiatan:", e);
        return [];
    }
}

export async function saveJadwalKegiatan(data: JadwalEvent[]) {
  try {
    await commitFiles(
      [{ path: JADWAL_FILE, content: JSON.stringify(data, null, 2) }],
      `Update jadwal kegiatan (${data.length} events)`
    );
    revalidatePath("/data/jadwal");
    revalidatePath("/admin/data/jadwal");
    return { success: true };
  } catch (error: any) {
    console.error("Error saving jadwal kegiatan:", error);
    return { success: false, error: error.message };
  }
}
