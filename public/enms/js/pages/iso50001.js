import { mountModuleDashboard } from '../components/module-page.js';

export async function mount() {
  await mountModuleDashboard('iso50001');
}

export async function onAction() { return false; }
