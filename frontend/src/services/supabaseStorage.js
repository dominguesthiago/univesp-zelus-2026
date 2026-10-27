import { createClient } from '@supabase/supabase-js';

// Leitura das variáveis de ambiente com fallbacks resilientes
const SUPABASE_URL =
  process.env.REACT_APP_SUPABASE_URL || 'https://zehdfbbceiojmwewzwbo.supabase.co';
const SUPABASE_ANON_KEY =
  process.env.REACT_APP_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InplaGRmYmJjZWlvam13ZXd6d2JvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAxMjE1NDksImV4cCI6MjEwNTY5NzU0OX0.kC2PL3JBFmgiooc_o06O-cihcgJXanSKz5STBxDCdOc';

export const BUCKET_NAME = 'solicitacoes-fotos';

// Instância do cliente Supabase para o Frontend
export const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

/**
 * Converte uma DataURL (Base64) em objeto Blob binário nativo.
 * @param {string} dataUrl - String base64 (ex: data:image/jpeg;base64,...)
 * @returns {Blob}
 */
export function base64ToBlob(dataUrl) {
  if (!dataUrl || typeof dataUrl !== 'string') {
    return null;
  }

  // Se já não contiver cabeçalho data:, tenta decodificar diretamente
  const parts = dataUrl.split(',');
  const mimeMatch = parts[0].match(/:(.*?);/);
  const mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg';
  const byteCharacters = atob(parts[1] || parts[0]);
  const byteArrays = [];

  const sliceSize = 512;
  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);
    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  return new Blob(byteArrays, { type: mimeType });
}

/**
 * Redimensiona e comprime uma imagem (File ou Blob) no cliente
 * usando Canvas HTML5 para evitar sobrecarga de memória no smartphone.
 * @param {File|Blob} file - Imagem original do dispositivo
 * @param {number} [maxDimension=1280] - Largura/altura máxima em pixels
 * @param {number} [quality=0.8] - Qualidade do JPEG (0 a 1)
 * @returns {Promise<string>} DataURL otimizada (Base64 JPEG)
 */
export function otimizarImagemArquivo(file, maxDimension = 1280, quality = 0.8) {
  return new Promise((resolve, reject) => {
    if (!file) {
      return reject(new Error('Nenhum arquivo fornecido para otimização.'));
    }

    const reader = new FileReader();
    reader.onerror = (e) => reject(e);
    reader.onload = (e) => {
      const dataUrl = e.target.result;

      // Se Image não estiver disponível ou for jsdom sem motor de renderização de imagem
      if (typeof Image === 'undefined') {
        resolve(dataUrl);
        return;
      }

      const img = new Image();
      let finalizado = false;

      // Timeout de segurança caso Image.onload não dispare no ambiente
      const timeoutId = setTimeout(() => {
        if (!finalizado) {
          finalizado = true;
          resolve(dataUrl);
        }
      }, 300);

      img.onerror = () => {
        if (!finalizado) {
          finalizado = true;
          clearTimeout(timeoutId);
          resolve(dataUrl);
        }
      };

      img.onload = () => {
        if (finalizado) return;
        finalizado = true;
        clearTimeout(timeoutId);

        try {
          let width = img.width || 0;
          let height = img.height || 0;

          if (width === 0 || height === 0 || (width <= maxDimension && height <= maxDimension)) {
            resolve(dataUrl);
            return;
          }

          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(dataUrl);
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', quality));
        } catch {
          resolve(dataUrl);
        }
      };

      img.src = dataUrl;
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Faz o upload de uma imagem (Base64, Blob ou File) para o Supabase Storage.
 * Retorna a URL pública final da imagem enviada.
 * Se a entrada já for uma URL HTTP/HTTPS, retorna a URL diretamente sem re-upload.
 * @param {string|Blob|File} foto - Foto a ser enviada
 * @returns {Promise<string|null>} URL pública do arquivo no Supabase Storage
 */
export async function uploadFotoSolicitacao(foto) {
  if (!foto) {
    return null;
  }

  // Se já for uma URL remota válida, não faz upload novamente
  if (typeof foto === 'string' && (foto.startsWith('http://') || foto.startsWith('https://'))) {
    return foto;
  }

  let blob = null;
  if (typeof foto === 'string') {
    blob = base64ToBlob(foto);
  } else if (foto instanceof Blob || foto instanceof File) {
    blob = foto;
  }

  if (!blob) {
    throw new Error('Formato de foto inválido para upload.');
  }

  // Gera nome de arquivo único com timestamp e sufixo randômico
  const timestamp = Date.now();
  const randomSuffix = Math.random().toString(36).substring(2, 9);
  const filePath = `solicitacao_${timestamp}_${randomSuffix}.jpg`;

  const { error: uploadError } = await supabaseClient.storage
    .from(BUCKET_NAME)
    .upload(filePath, blob, {
      contentType: 'image/jpeg',
      cacheControl: '3600',
      upsert: false,
    });

  if (uploadError) {
    console.error('[Supabase Storage] Erro no upload:', uploadError);
    throw new Error(
      uploadError.message || 'Falha ao enviar a imagem para o Supabase Storage.'
    );
  }

  // Resgata a URL pública do bucket
  const { data: urlData } = supabaseClient.storage
    .from(BUCKET_NAME)
    .getPublicUrl(filePath);

  if (!urlData || !urlData.publicUrl) {
    throw new Error('Não foi possível obter a URL pública da imagem enviada.');
  }

  return urlData.publicUrl;
}

export default {
  supabaseClient,
  BUCKET_NAME,
  base64ToBlob,
  otimizarImagemArquivo,
  uploadFotoSolicitacao,
};
