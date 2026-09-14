import { mountModuleDashboard } from '../components/module-page.js';

export async function mount() {
  await mountModuleDashboard('emissions');
}

export async function onAction() { return false; }
