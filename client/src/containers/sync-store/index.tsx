'use client';
import { useSyncLayersAndSettings } from '@/store';

export default function SyncStoreHome() {
  useSyncLayersAndSettings();
  return null;
}
