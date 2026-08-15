import { events } from '@/data/events';
import ecosystem from '@/data/ecosystem.json';
import portfolio from '@/data/portfolio.json';
import resources from '@/data/resources.json';

// Events move from upcoming to past on their own, so re-render hourly like the
// home page instead of freezing this document at build time.
export const revalidate = 3600;

const BASE_URL = 'https://www.w1build.com';

// /info and /join redirect to /, so they are not listed.
const pages = [
  ['/', 'Home', 'Hero, the three W1 pillars (Bronco Build It, Learn, Ecosystem), and a calendar of startup events around Western Michigan.'],
  ['/build', 'Bronco Build It', 'Weekly Sunday 2:30 PM build session in the WMU Student Center RSO Lounge, with RSVP links for every session.'],
  ['/ecosystem', 'Ecosystem', 'Directory of Midwest startup organizations, accelerators, and student clubs W1 connects members to.'],
  ['/learn', 'Learn', 'Vetted programs for learning how to ship a product and run a business.'],
  ['/portfolio', 'Portfolio', 'Startups built by W1 members.'],
];

function formatDate(date: string): string {
  return new Date(date + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

function link(text: string, url: string, description: string): string {
  return `- [${text}](${url}): ${description}`;
}

export function GET() {
  const today = new Date().toISOString().slice(0, 10);
  const upcoming = events.filter((e) => e.date >= today);

  const sections = [
    `# W1 @ WMU`,
    ``,
    `> A student startup community across Western Michigan and beyond.`,
    ``,
    `W1 is a student startup community based at Western Michigan University in Kalamazoo, Michigan. Members meet weekly at Bronco Build It to work on homework, side projects, and real businesses, learn from vetted startup programs, and plug into the wider Midwest startup ecosystem. Everything here is free and open to students.`,
    ``,
    `## Pages`,
    ``,
    ...pages.map(([path, title, description]) => link(title, `${BASE_URL}${path}`, description)),
    ``,
    `## Upcoming Events`,
    ``,
    ...(upcoming.length > 0
      ? upcoming.map((e) =>
          link(
            e.title,
            e.href ?? `${BASE_URL}/#events`,
            `${formatDate(e.date)} at ${e.time}, ${e.location}.`,
          ),
        )
      : ['No upcoming events listed right now. Check the calendar at ' + BASE_URL + '/#events.']),
    ``,
    `## Portfolio`,
    ``,
    ...portfolio.map((p) => link(p.name, p.url, 'Startup built by W1 members.')),
    ``,
    `## Ecosystem Partners`,
    ``,
    ...ecosystem.regions.flatMap((region) =>
      region.orgs.length > 0
        ? [`### ${region.city}`, ``, ...region.orgs.map((o) => link(o.name, o.url, o.description)), ``]
        : [],
    ),
    `Expanding to: ${ecosystem.regions
      .filter((r) => r.status === 'expanding')
      .map((r) => r.city)
      .join(', ')}.`,
    ``,
    `## Learning Resources`,
    ``,
    ...resources.map((r) => link(r.title, r.url, r.description)),
    ``,
    `## Contact`,
    ``,
    link('Email', 'mailto:w1@student.groups.wexchange.wmich.edu', 'Suggest a resource, event, or partner.'),
    link('Discord', 'https://discord.com/invite/G9yE5s6NFM', 'Community chat.'),
    link('Instagram', 'https://www.instagram.com/developerclubwmu/', 'Photos and event announcements.'),
    link('LinkedIn', 'https://www.linkedin.com/company/w1build/', 'Company page.'),
    ``,
  ];

  return new Response(sections.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
