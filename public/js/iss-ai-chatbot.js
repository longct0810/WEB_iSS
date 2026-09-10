(function () {
  'use strict';

  const state = { history: [], busy: false };

  function escapeHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function appendMessage(role, content) {
    const list = document.getElementById('issAiMessages');
    if (!list) return;

    const item = document.createElement('div');
    item.className = `iss-ai-message ${role}`;
    item.innerHTML = `<div class="iss-ai-bubble">${escapeHtml(content).replace(/\n/g, '<br>')}</div>`;
    list.appendChild(item);
    list.scrollTop = list.scrollHeight;
  }

  function setBusy(value) {
    state.busy = value;
    const input = document.getElementById('issAiInput');
    const send = document.getElementById('issAiSend');
    if (input) input.disabled = value;
    if (send) {
      send.disabled = value;
      send.textContent = value ? 'Đang xử lý...' : 'Gửi';
    }
  }

  function collectContext() {
    const context = {
      page: window.location.pathname,
      stationCode: localStorage.getItem('code') || localStorage.getItem('savedCode') || null,
      deviceId: window.currentDeviceId || window.id_thietbi || null
    };

    if (window.powerAIData && typeof window.powerAIData === 'object') {
      context.powerAI = window.powerAIData;
    }
    if (typeof window.getIssAiContext === 'function') {
      try { Object.assign(context, window.getIssAiContext() || {}); } catch (_) {}
    }
    return context;
  }

  async function sendMessage() {
    if (state.busy) return;
    const input = document.getElementById('issAiInput');
    const question = String(input?.value || '').trim();
    if (!question) return;

    appendMessage('user', question);
    state.history.push({ role: 'user', content: question });
    input.value = '';
    setBusy(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question,
          history: state.history.slice(-10),
          context: collectContext()
        })
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data.success) {
        throw new Error(data.error || data.message || 'Không thể gọi chatbot AI');
      }

      appendMessage('assistant', data.answer);
      state.history.push({ role: 'assistant', content: data.answer });
      state.history = state.history.slice(-10);
    } catch (error) {
      appendMessage('assistant', `Không thể kết nối trợ lý AI: ${error.message}`);
    } finally {
      setBusy(false);
      input?.focus();
    }
  }

  function init() {
    const toggle = document.getElementById('issAiToggle');
    const panel = document.getElementById('issAiPanel');
    const close = document.getElementById('issAiClose');
    const send = document.getElementById('issAiSend');
    const input = document.getElementById('issAiInput');
    if (!toggle || !panel) return;

    toggle.addEventListener('click', () => {
      panel.classList.toggle('open');
      panel.setAttribute('aria-hidden', panel.classList.contains('open') ? 'false' : 'true');
      if (panel.classList.contains('open')) input?.focus();
    });
    close?.addEventListener('click', () => panel.classList.remove('open'));
    send?.addEventListener('click', sendMessage);
    input?.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
      }
    });
  }

  document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', init)
    : init();
})();
