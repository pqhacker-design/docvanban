export async function extractTextFromFile(file: File): Promise<{ text: string; fileName: string; fileSize: number }> {
  const fileName = file.name;
  const fileSize = file.size;

  // Plain text or Markdown
  if (file.type === 'text/plain' || fileName.endsWith('.txt') || fileName.endsWith('.md')) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string || '';
        resolve({ text, fileName, fileSize });
      };
      reader.onerror = () => reject(new Error('Không thể đọc file văn bản này'));
      reader.readAsText(file);
    });
  }

  // DOCX / PDF / other files -> send to backend endpoint /api/tts/extract
  try {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('/api/tts/extract', {
      method: 'POST',
      body: formData
    });

    if (!res.ok) {
      throw new Error(`Tải file thất bại (${res.statusText})`);
    }

    const data = await res.json();
    return {
      text: data.text || '',
      fileName,
      fileSize
    };
  } catch (e: unknown) {
    // Client side fallback for simple file reading if backend offline
    if (file.type.includes('text') || fileName.endsWith('.json') || fileName.endsWith('.csv')) {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (ev) => resolve({ text: (ev.target?.result as string) || '', fileName, fileSize });
        reader.readAsText(file);
      });
    }
    const message = e instanceof Error ? e.message : 'Lỗi xử lý file';
    throw new Error(`Không thể trích xuất văn bản từ ${fileName}: ${message}`);
  }
}
