import { mountModuleDashboard } from '../components/module-page.js';

export async function mount() {
  await mountModuleDashboard('optimization');
}

export async function onAction() { return false; }
