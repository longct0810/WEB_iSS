import { mountModuleDashboard } from '../components/module-page.js';

export async function mount() {
  await mountModuleDashboard('forecast');
}

export async function onAction() { return false; }
