import { buildIcs } from '@/data/bronco-build-it-calendar';

// The event starts at the next upcoming session, which depends on today's date.
export const revalidate = 3600;

export function GET() {
  return new Response(buildIcs(), {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': 'inline; filename="bronco-build-it.ics"',
    },
  });
}
