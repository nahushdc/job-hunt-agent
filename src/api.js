export async function streamSection({ prompt, mode, useWebSearch, onChunk, onComplete, onError }) {
  try {
    const response = await fetch('/api/stream', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ prompt, mode, useWebSearch }),
    });

    if (!response.ok) {
      let msg = `Server error ${response.status}`;
      try {
        const err = await response.json();
        msg = err.error || msg;
      } catch {}
      onError(msg);
      return;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let fullText = '';
    const textBlockIndices = new Set();
    const sources = [];
    const seenUrls = new Set();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() ?? '';

      for (const line of lines) {
        if (!line.startsWith('data: ')) continue;
        const raw = line.slice(6).trim();
        if (!raw || raw === '[DONE]') continue;

        try {
          const event = JSON.parse(raw);

          if (event.type === 'content_block_start') {
            const block = event.content_block;

            if (block?.type === 'text') {
              textBlockIndices.add(event.index);
            }

            // Web search results arrive as tool_result blocks containing
            // an array of web_search_result items, each with url + title
            if (block?.type === 'tool_result' && Array.isArray(block.content)) {
              for (const item of block.content) {
                if (item.type === 'web_search_result' && item.url && !seenUrls.has(item.url)) {
                  seenUrls.add(item.url);
                  sources.push({ url: item.url, title: item.title || item.url });
                }
              }
            }
          }

          if (
            event.type === 'content_block_delta' &&
            event.delta?.type === 'text_delta' &&
            textBlockIndices.has(event.index)
          ) {
            fullText += event.delta.text;
            onChunk(event.delta.text);
          }
        } catch {
          // skip malformed SSE lines
        }
      }
    }

    onComplete(fullText, sources);
  } catch (err) {
    onError(err.message || 'Network error');
  }
}
