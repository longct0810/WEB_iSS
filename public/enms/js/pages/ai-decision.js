import { mountModuleDashboard } from '../components/module-page.js';

export async function mount() {
  await mountModuleDashboard('ai-decision');
}

export async function onAction() { return false; }
