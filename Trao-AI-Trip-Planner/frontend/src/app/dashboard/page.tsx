"use client";

import { ProtectedPage } from "@/components/ProtectedPage";
import { SubmitButton } from "@/components/SubmitButton";
import { TextField } from "@/components/FormField";
import { api, BudgetType, TripSummary } from "@/lib/api";
import { CalendarDays, CircleDollarSign, MapPin, Sparkles, WandSparkles } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, ReactNode, useEffect, useMemo, useState } from "react";

const interestOptions = ["Food", "Culture", "Adventure", "Shopping", "Nature", "History", "Nightlife", "Wellness"];
const budgets: { label: string; value: BudgetType }[] = [
  { label: "Low", value: "LOW" },
  { label: "Medium", value: "MEDIUM" },
  { label: "High", value: "HIGH" }
];

export default function DashboardPage() {
  const router = useRouter();
  const [trips, setTrips] = useState<TripSummary[]>([]);
  const [destination, setDestination] = useState("");
  const [days, setDays] = useState(3);
  const [budgetType, setBudgetType] = useState<BudgetType>("MEDIUM");
  const [interests, setInterests] = useState<string[]>(["Food", "Culture"]);
  const [error, setError] = useState("");
  const [loadingTrips, setLoadingTrips] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    api
      .listTrips()
      .then(setTrips)
      .catch((exception) => setError(exception instanceof Error ? exception.message : "Unable to load trips"))
      .finally(() => setLoadingTrips(false));
  }, []);

  const totalDays = useMemo(() => trips.reduce((sum, trip) => sum + trip.days, 0), [trips]);

  function toggleInterest(interest: string) {
    setInterests((current) =>
      current.includes(interest) ? current.filter((item) => item !== interest) : [...current, interest]
    );
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (interests.length === 0) {
      setError("Choose at least one interest.");
      return;
    }

    setGenerating(true);
    try {
      const trip = await api.generateTrip({ destination, days, budgetType, interests });
      router.push(`/trips/${trip.id}`);
    } catch (exception) {
      setError(exception instanceof Error ? exception.message : "Unable to generate trip");
    } finally {
      setGenerating(false);
    }
  }

  return (
    <ProtectedPage>
      <main className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[0.92fr_1.08fr]">
        <section className="rounded-lg border border-black/10 bg-white p-5 shadow-soft sm:p-6">
          <div className="mb-6 flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-md bg-coral/12 text-coral">
              <WandSparkles size={21} aria-hidden />
            </span>
            <div>
              <h1 className="text-2xl font-semibold text-ink">Plan a trip</h1>
              <p className="text-sm text-ink/60">Generate a private itinerary with budget and hotels.</p>
            </div>
          </div>

          <form className="space-y-5" onSubmit={submit}>
            <TextField
              label="Destination"
              value={destination}
              onChange={(event) => setDestination(event.target.value)}
              placeholder="Tokyo, Japan"
              required
            />

            <label className="block">
              <span className="text-sm font-medium text-ink">Number of days</span>
              <input
                type="number"
                min={1}
                max={21}
                value={days}
                onChange={(event) => setDays(Number(event.target.value))}
                className="mt-2 h-11 w-full rounded-md border border-black/10 bg-white px-3 text-ink shadow-sm focus:border-moss"
              />
            </label>

            <fieldset>
              <legend className="text-sm font-medium text-ink">Budget type</legend>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {budgets.map((budget) => (
                  <button
                    key={budget.value}
                    type="button"
                    onClick={() => setBudgetType(budget.value)}
                    className={`h-10 rounded-md border text-sm font-medium transition ${
                      budgetType === budget.value
                        ? "border-ink bg-ink text-white"
                        : "border-black/10 bg-white text-ink hover:border-moss"
                    }`}
                  >
                    {budget.label}
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset>
              <legend className="text-sm font-medium text-ink">Interests</legend>
              <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-2">
                {interestOptions.map((interest) => (
                  <label
                    key={interest}
                    className={`flex min-h-10 items-center gap-2 rounded-md border px-3 text-sm transition ${
                      interests.includes(interest)
                        ? "border-moss bg-moss/10 text-ink"
                        : "border-black/10 bg-white text-ink/70"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={interests.includes(interest)}
                      onChange={() => toggleInterest(interest)}
                      className="h-4 w-4 accent-moss"
                    />
                    {interest}
                  </label>
                ))}
              </div>
            </fieldset>

            {error ? <p className="rounded-md bg-coral/10 px-3 py-2 text-sm text-coral">{error}</p> : null}

            <SubmitButton loading={generating} className="w-full">
              <Sparkles size={17} aria-hidden />
              Generate itinerary
            </SubmitButton>
          </form>
        </section>

        <section className="space-y-6">
          <div className="grid grid-cols-3 gap-3">
            <Metric icon={<MapPin size={18} />} label="Trips" value={trips.length.toString()} />
            <Metric icon={<CalendarDays size={18} />} label="Days" value={totalDays.toString()} />
            <Metric icon={<CircleDollarSign size={18} />} label="Mode" value="AI" />
          </div>

          <div className="rounded-lg border border-black/10 bg-white p-5 shadow-soft sm:p-6">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="text-xl font-semibold text-ink">Your trips</h2>
              <span className="rounded-md bg-gold/15 px-2.5 py-1 text-xs font-medium text-ink">Private</span>
            </div>

            {loadingTrips ? (
              <p className="text-sm text-ink/60">Loading trips...</p>
            ) : trips.length === 0 ? (
              <p className="rounded-md border border-dashed border-black/15 px-4 py-8 text-center text-sm text-ink/60">
                No trips yet.
              </p>
            ) : (
              <div className="space-y-3">
                {trips.map((trip) => (
                  <Link
                    key={trip.id}
                    href={`/trips/${trip.id}`}
                    className="block rounded-md border border-black/10 bg-mist p-4 transition hover:border-moss hover:bg-white"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-semibold text-ink">{trip.destination}</h3>
                        <p className="mt-1 text-sm text-ink/60">
                          {trip.days} days · {trip.budgetType.toLowerCase()} budget
                        </p>
                      </div>
                      <span className="rounded-md bg-white px-2 py-1 text-xs font-medium text-ink/70">
                        {trip.interests.slice(0, 2).join(", ")}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </ProtectedPage>
  );
}

function Metric({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-lg border border-black/10 bg-white p-4 shadow-soft">
      <div className="mb-3 text-moss">{icon}</div>
      <div className="text-xl font-semibold text-ink">{value}</div>
      <div className="text-xs font-medium uppercase tracking-[0.08em] text-ink/45">{label}</div>
    </div>
  );
}
