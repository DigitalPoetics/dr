import language from '../../data/digitalTropology/language.json';

export function GET() {
  return new Response(JSON.stringify(language), {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

