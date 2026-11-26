/** Active watches and warnings from the US National Weather Service. */
export type Alert = {
  id: string;
  event: string;
  headline: string;
  severity: 'Extreme' | 'Severe' | 'Moderate' | 'Minor' | 'Unknown';
  /** ISO time with offset, or empty when the NWS gives none. */
  ends: string;
  description: string;
  instruction: string;
};

type Feature = { id?: string; properties?: Record<string, unknown> };

const severities = ['Extreme', 'Severe', 'Moderate', 'Minor'] as const;
const s = (v: unknown) => (typeof v === 'string' ? v : '');

/** Parses `/alerts/active?point=` GeoJSON, most severe first. */
export function parseAlerts(json: unknown): Alert[] {
  const features = ((json as { features?: Feature[] }).features ?? []).filter((f) => f.properties);
  const alerts = features.map((f): Alert => {
    const p = f.properties ?? {};
    const sev = severities.find((x) => x === p.severity) ?? 'Unknown';
    return {
      id: s(f.id) || s(p.id),
      event: s(p.event),
      headline: s(p.headline) || s(p.event),
      severity: sev,
      ends: s(p.ends) || s(p.expires),
      description: s(p.description),
      instruction: s(p.instruction),
    };
  });
  const rank = (a: Alert) => {
    const i = severities.indexOf(a.severity as (typeof severities)[number]);
    return i === -1 ? severities.length : i;
  };
  return alerts.sort((a, b) => rank(a) - rank(b));
}
