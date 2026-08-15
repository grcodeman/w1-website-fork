import { sessionLinks, formatSessionDate } from '@/data/bronco-build-it-links';
import { events } from '@/data/events';
import ecosystem from '@/data/ecosystem.json';
import portfolio from '@/data/portfolio.json';
import resources from '@/data/resources.json';

// Past/upcoming labelling depends on the current date, so re-render hourly.
export const revalidate = 3600;

const BASE_URL = 'https://www.w1build.com';

const pages = [
  ['/', 'Home', 'Hero, the three W1 pillars (Bronco Build It, Learn, Ecosystem), and a month-by-month calendar of startup events around Western Michigan.'],
  ['/build', 'Bronco Build It', 'Weekly Sunday 2:30 PM build session in the WMU Student Center RSO Lounge, with RSVP links for every session.'],
  ['/ecosystem', 'Ecosystem', 'Directory of Midwest startup organizations, accelerators, and student clubs W1 connects members to.'],
  ['/learn', 'Learn', 'Vetted programs for learning how to ship a product and run a business.'],
  ['/portfolio', 'Portfolio', 'Startups built by W1 members.'],
];

function formatDate(date: string): string {
  return new Date(date + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export function GET() {
  const today = new Date().toISOString().slice(0, 10);

  const sections = [
    `# W1 @ WMU`,
    ``,
    `> A student startup community across Western Michigan and beyond.`,
    ``,
    `W1 is a student startup community based at Western Michigan University in Kalamazoo, Michigan. It runs on three pillars: Bronco Build It, a weekly in-person work session; Learn, a short list of vetted programs for going from zero to shipping; and Ecosystem, a directory of the Midwest startup organizations W1 connects students to. Members build side projects and real companies, and everything is free and open to students.`,
    ``,
    `This is the full version of ${BASE_URL}/llms.txt, with complete details for every event, company, partner, and resource on the site.`,
    ``,
    `## Pages`,
    ``,
    ...pages.map(([path, title, description]) => `- [${title}](${BASE_URL}${path}): ${description}`),
    ``,
    `Note: ${BASE_URL}/info and ${BASE_URL}/join both redirect to the home page.`,
    ``,
    `## Bronco Build It`,
    ``,
    `Every Sunday at 2:30 PM in the WMU Student Center RSO Lounge. A weekly workspace for homework, side projects, and launching a business. Show up, build, ship. Details and RSVP links: ${BASE_URL}/build`,
    ``,
    `Sessions:`,
    ...sessionLinks.map(
      (s) =>
        `- ${formatSessionDate(s.date)} (${s.date})${s.label ? ` - ${s.label}` : ''}${
          s.date < today ? ' [past]' : ''
        }: RSVP at ${s.url}`,
    ),
    ``,
    `## Events`,
    ``,
    `Startup events happening around W1, hosted by W1 and by partner organizations. Calendar: ${BASE_URL}/#events`,
    ``,
    ...events.flatMap((e) => [
      `### ${e.title}${e.date < today ? ' [past]' : ''}`,
      ``,
      `- Date: ${formatDate(e.date)} (${e.date})`,
      `- Time: ${e.time}`,
      `- Location: ${e.location}`,
      ...(e.href ? [`- Link: ${e.href}`] : []),
      ``,
      e.description,
      ``,
    ]),
    `## Portfolio`,
    ``,
    `Startups built by W1 members. Full list: ${BASE_URL}/portfolio`,
    ``,
    ...portfolio.map((p) => `- [${p.name}](${p.url})`),
    ``,
    `## Ecosystem`,
    ``,
    `Startup organizations, accelerators, and student clubs across the Midwest that W1 connects members to. Full directory: ${BASE_URL}/ecosystem`,
    ``,
    ...ecosystem.regions.flatMap((region) => [
      `### ${region.city} (${region.status})`,
      ``,
      ...(region.orgs.length > 0
        ? region.orgs.map((o) => `- [${o.name}](${o.url}): ${o.description}`)
        : [`W1 is expanding into ${region.city}. No partner organizations listed yet.`]),
      ``,
    ]),
    `## Learning Resources`,
    ``,
    `Programs W1 has vetted for learning the fundamentals of shipping a product and running a business. Full list: ${BASE_URL}/learn`,
    ``,
    ...resources.map(
      (r) => `- [${r.title}](${r.url})${r.featured ? ' (featured)' : ''}: ${r.description}`,
    ),
    ``,
    `Resource suggestions go to w1@student.groups.wexchange.wmich.edu.`,
    ``,
    `## Contact`,
    ``,
    `- Email: w1@student.groups.wexchange.wmich.edu`,
    `- Discord: https://discord.com/invite/G9yE5s6NFM`,
    `- Instagram: https://www.instagram.com/developerclubwmu/`,
    `- LinkedIn: https://www.linkedin.com/company/w1build/`,
    ``,
  ];

  return new Response(sections.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
