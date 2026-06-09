export const DANCE_STYLES = [
  { value: "salsa", label: "Salsa" },
  { value: "bachata", label: "Bachata" },
  { value: "hip-hop", label: "Hip-Hop" },
  { value: "contemporary", label: "Contemporary" },
  { value: "ballroom", label: "Ballroom" },
  { value: "tango", label: "Tango" },
  { value: "swing", label: "Swing" },
  { value: "kizomba", label: "Kizomba" },
  { value: "other", label: "Other" },
] as const;

export const EVENTS_PER_PAGE = 12;

const pexels = (id: number) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=800&h=500&fit=crop`;

export const PLACEHOLDER_EVENT_IMAGE = pexels(209948);

export const DEMO_ACCOUNTS = {
  admin: {
    label: "Admin",
    email: "admin@dancesphere.com",
    password: "Admin123!",
  },
  organizer: {
    label: "Organizer",
    email: "organizer@dancesphere.com",
    password: "Org123!",
  },
} as const;

/** Seed / default images keyed by event slug */
export const EVENT_IMAGES: Record<string, string> = {
  "salsa-night-barcelona": pexels(209948),
  "bachata-sensual-workshop": pexels(4674805),
  "hip-hop-battle-championship": pexels(4348078),
  "contemporary-flow-festival": pexels(1705082),
  "kizomba-sunset-social": pexels(713149),
  "swing-dance-revival": pexels(2747449),
};
