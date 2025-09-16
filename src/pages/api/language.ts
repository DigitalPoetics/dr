import language from '../../data/language/language.json';

export function GET() {
  return new Response(JSON.stringify(language), {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

