import Anthropic from '@anthropic-ai/sdk';

// Inicializar el cliente oficial de Anthropic para el entorno de escritorio (Tauri)
const anthropic = new Anthropic({
  apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY || '',
  dangerouslyAllowBrowser: true // Requerido para ejecución directa en el frontend
});

/**
 * Consulta oficial a la API de Anthropic usando el SDK.
 */
export async function consultClaudeAI(activeTab, userMessage) {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;

  if (!apiKey) {
    throw new Error('Falta definir VITE_ANTHROPIC_API_KEY en tu archivo .env');
  }

  // Contextos especializados por módulo del hato ganadero
  const systemContexts = {
    veterinary: 'Eres un experto consultor veterinario y zootecnista para el software de hato ganadero RebañoPro. Responde de forma técnica, concisa y profesional en español, enfocándote en sanidad animal y protocolos clínicos.',
    financial: 'Eres un asesor financiero pecuario experto para el software de hato ganadero RebañoPro. Responde de forma técnica, concisa y profesional en español, enfocándote en costos de producción y rentabilidad.',
    general: 'Eres el núcleo de inteligencia artificial y consultor estratégico general para el software de hato ganadero RebañoPro. Responde de forma técnica, concisa y profesional en español.'
  };

  const response = await anthropic.messages.create({
    model: 'claude-haiku-4-5-20251001', // Probando con Claude 3 Opus
    max_tokens: 1024,
    system: systemContexts[activeTab] || systemContexts.general,
    messages: [
      { role: 'user', content: userMessage }
    ]
  });

  if (response.content && response.content[0]?.text) {
    return response.content[0].text;
  } else {
    throw new Error('No se pudo obtener una respuesta válida de Claude.');
  }
}