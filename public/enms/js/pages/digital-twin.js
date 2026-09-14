import { mountModuleDashboard } from '../components/module-page.js';

export async function mount() {
  await mountModuleDashboard('digital-twin');
}

export async function onAction() { return false; }
