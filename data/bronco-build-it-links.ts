export interface SessionLink {
  date: string;       // ISO date string "YYYY-MM-DD" (the Sunday)
  url: string;        // ExperienceWMU RSVP link for that session
  label?: string;     // Optional: special session name (e.g., "Demo Day")
}

export const sessionLinks: SessionLink[] = [
  {
    date: "2026-03-22",
    url: "https://experiencewmu.wmich.edu/event/12336155",
  },
  {
    date: "2026-03-29",
    url: "https://experiencewmu.wmich.edu/event/12336161",
  },
  {
    date: "2026-04-05",
    url: "https://experiencewmu.wmich.edu/event/12336162",
  },
  {
    date: "2026-04-12",
    url: "https://experiencewmu.wmich.edu/event/12336163",
  },
  {
    date: "2026-04-19",
    url: "https://experiencewmu.wmich.edu/event/12336164",
  },
];

export function getNextSession(): SessionLink | null {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcoming = sessionLinks.find((session) => {
    const sessionDate = new Date(session.date + 'T00:00:00');
    return sessionDate > today;
  });

  if (upcoming) return upcoming;

  // Fallback: return the most recent past session
  return sessionLinks.length > 0 ? sessionLinks[sessionLinks.length - 1] : null;
}

export function formatSessionDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}
