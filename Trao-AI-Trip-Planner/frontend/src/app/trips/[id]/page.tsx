"use client";

import { TextArea, TextField } from "@/components/FormField";
import { ProtectedPage } from "@/components/ProtectedPage";
import { SubmitButton } from "@/components/SubmitButton";
import { api, ItineraryDay, Trip } from "@/lib/api";
import {
  ArrowLeft,
  BedDouble,
  CalendarDays,
  CircleDollarSign,
  Plus,
  RefreshCw,
  ShieldCheck,
  Trash2,
  WalletCards
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, ReactNode, use, useEffect, useMemo, useState } from "react";

export default function TripDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: tripId } = use(params);
  const router = useRouter();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState("");
  const [activeDay, setActiveDay] = useState(1);
  const [instruction, setInstruction] = useState("");
  const [activity, setActivity] = useState({
    timeOfDay: "Evening",
    title: "",
    description: "",
    category: "Custom",
    estimatedCost: 0
  });

  useEffect(() => {
    api
      .getTrip(tripId)
      .then((loadedTrip) => {
        setTrip(loadedTrip);
        setActiveDay(loadedTrip.itinerary[0]?.dayNumber ?? 1);
      })
      .catch((exception) => setError(exception instanceof Error ? exception.message : "Unable to load trip"))
      .finally(() => setLoading(false));
  }, [tripId]);

  const selectedDay = useMemo(
    () => trip?.itinerary.find((day) => day.dayNumber === activeDay) ?? trip?.itinerary[0],
    [activeDay, trip]
  );

  async function regenerateDay(day: ItineraryDay) {
    setError("");
    setBusy(`regen-${day.dayNumber}`);
    try {
      const updated = await api.regenerateDay(tripId, day.dayNumber, instruction || "Improve this day.");
      setTrip(updated);
      setInstruction("");
    } catch (exception) {
      setError(exception instanceof Error ? exception.message : "Unable to regenerate day");
    } finally {
      setBusy("");
    }
  }

  async function addActivity(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedDay) {
      return;
    }
    setError("");
    setBusy("add");
    try {
      const updated = await api.addActivity(tripId, selectedDay.dayNumber, activity);
      setTrip(updated);
      setActivity({ timeOfDay: "Evening", title: "", description: "", category: "Custom", estimatedCost: 0 });
    } catch (exception) {
      setError(exception instanceof Error ? exception.message : "Unable to add activity");
    } finally {
      setBusy("");
    }
  }

  async function removeActivity(dayNumber: number, activityId: string) {
    setError("");
    setBusy(activityId);
    try {
      setTrip(await api.removeActivity(tripId, dayNumber, activityId));
    } catch (exception) {
      setError(exception instanceof Error ? exception.message : "Unable to remove activity");
    } finally {
      setBusy("");
    }
  }

  async function deleteTrip() {
    setBusy("delete");
    try {
      await api.deleteTrip(tripId);
      router.replace("/dashboard");
    } catch (exception) {
      setError(exception instanceof Error ? exception.message : "Unable to delete trip");
      setBusy("");
    }
  }

  return (
    <ProtectedPage>
      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
        <Link href="/dashboard" className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-ink/70 hover:text-ink">
          <ArrowLeft size={16} aria-hidden />
          Dashboard
        </Link>

        {loading ? <p className="text-sm text-ink/60">Loading trip...</p> : null}
        {error ? <p className="mb-4 rounded-md bg-coral/10 px-3 py-2 text-sm text-coral">{error}</p> : null}

        {trip ? (
          <div className="space-y-6">
            <section className="rounded-lg border border-black/10 bg-white p-5 shadow-soft sm:p-6">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                <div>
                  <h1 className="text-3xl font-semibold text-ink">{trip.destination}</h1>
                  <p className="mt-2 text-sm text-ink/60">
                    {trip.days} days · {trip.budgetType.toLowerCase()} budget · {trip.interests.join(", ")}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={deleteTrip}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-coral/30 px-3 text-sm font-medium text-coral transition hover:bg-coral hover:text-white"
                >
                  <Trash2 size={16} aria-hidden />
                  Delete
                </button>
              </div>
            </section>

            <section className="grid gap-4 md:grid-cols-3">
              <InfoPanel icon={<WalletCards size={19} />} title="Budget" value={money(trip.budgetEstimate?.total, trip.budgetEstimate?.currency)} />
              <InfoPanel icon={<BedDouble size={19} />} title="Hotels" value={`${trip.hotels?.length ?? 0} options`} />
              <InfoPanel icon={<ShieldCheck size={19} />} title="Review" value={`${trip.qualityReview?.paceScore ?? 0}/100 pace`} />
            </section>

            <section className="grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
              <div className="rounded-lg border border-black/10 bg-white p-5 shadow-soft sm:p-6">
                <div className="mb-4 flex flex-wrap gap-2">
                  {trip.itinerary.map((day) => (
                    <button
                      key={day.dayNumber}
                      type="button"
                      onClick={() => setActiveDay(day.dayNumber)}
                      className={`h-10 rounded-md border px-3 text-sm font-medium transition ${
                        activeDay === day.dayNumber
                          ? "border-ink bg-ink text-white"
                          : "border-black/10 bg-white text-ink hover:border-moss"
                      }`}
                    >
                      Day {day.dayNumber}
                    </button>
                  ))}
                </div>

                {selectedDay ? (
                  <article>
                    <div className="mb-5">
                      <h2 className="text-2xl font-semibold text-ink">{selectedDay.title}</h2>
                      <p className="mt-2 text-sm leading-6 text-ink/65">{selectedDay.summary}</p>
                    </div>

                    <div className="space-y-3">
                      {selectedDay.activities.map((item) => (
                        <div key={item.id} className="rounded-md border border-black/10 bg-mist p-4">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-moss">{item.timeOfDay}</p>
                              <h3 className="mt-1 font-semibold text-ink">{item.title}</h3>
                              <p className="mt-1 text-sm leading-6 text-ink/65">{item.description}</p>
                              <p className="mt-2 text-sm text-ink/50">
                                {item.category} · {money(item.estimatedCost, trip.budgetEstimate?.currency)}
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeActivity(selectedDay.dayNumber, item.id)}
                              className="grid h-9 w-9 shrink-0 place-items-center rounded-md border border-black/10 bg-white text-ink/65 transition hover:border-coral hover:text-coral"
                              aria-label={`Remove ${item.title}`}
                              title="Remove activity"
                            >
                              <Trash2 size={16} aria-hidden />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 grid gap-4 md:grid-cols-2">
                      <form className="rounded-lg border border-black/10 bg-white p-4" onSubmit={addActivity}>
                        <h3 className="mb-4 font-semibold text-ink">Add activity</h3>
                        <div className="space-y-3">
                          <TextField
                            label="Time"
                            value={activity.timeOfDay}
                            onChange={(event) => setActivity({ ...activity, timeOfDay: event.target.value })}
                            required
                          />
                          <TextField
                            label="Title"
                            value={activity.title}
                            onChange={(event) => setActivity({ ...activity, title: event.target.value })}
                            required
                          />
                          <TextArea
                            label="Description"
                            value={activity.description}
                            onChange={(event) => setActivity({ ...activity, description: event.target.value })}
                            required
                          />
                          <TextField
                            label="Estimated cost"
                            type="number"
                            min={0}
                            value={activity.estimatedCost}
                            onChange={(event) => setActivity({ ...activity, estimatedCost: Number(event.target.value) })}
                          />
                          <SubmitButton loading={busy === "add"} className="w-full">
                            <Plus size={16} aria-hidden />
                            Add
                          </SubmitButton>
                        </div>
                      </form>

                      <div className="rounded-lg border border-black/10 bg-white p-4">
                        <h3 className="mb-4 font-semibold text-ink">Regenerate day</h3>
                        <TextArea
                          label="Instruction"
                          value={instruction}
                          onChange={(event) => setInstruction(event.target.value)}
                          placeholder="More outdoor activities, less shopping."
                        />
                        <SubmitButton
                          type="button"
                          loading={busy === `regen-${selectedDay.dayNumber}`}
                          onClick={() => regenerateDay(selectedDay)}
                          className="mt-3 w-full"
                        >
                          <RefreshCw size={16} aria-hidden />
                          Regenerate
                        </SubmitButton>
                      </div>
                    </div>
                  </article>
                ) : null}
              </div>

              <aside className="space-y-6">
                <Panel title="Budget estimate" icon={<CircleDollarSign size={18} />}>
                  <BudgetRows trip={trip} />
                </Panel>

                <Panel title="Hotels" icon={<BedDouble size={18} />}>
                  <div className="space-y-3">
                    {trip.hotels.map((hotel) => (
                      <div key={hotel.name} className="rounded-md border border-black/10 bg-mist p-3">
                        <h3 className="font-semibold text-ink">{hotel.name}</h3>
                        <p className="mt-1 text-sm text-ink/60">{hotel.neighborhood}</p>
                        <p className="mt-2 text-sm leading-6 text-ink/70">{hotel.reason}</p>
                        <p className="mt-2 text-sm font-medium text-moss">
                          {hotel.priceLevel} · {money(hotel.estimatedNightlyRate, trip.budgetEstimate?.currency)}/night
                        </p>
                      </div>
                    ))}
                  </div>
                </Panel>

                <Panel title="Trip review" icon={<CalendarDays size={18} />}>
                  <p className="text-sm leading-6 text-ink/70">{trip.qualityReview?.budgetFit}</p>
                  <p className="mt-2 text-sm leading-6 text-ink/70">{trip.qualityReview?.restBalance}</p>
                  <ListBlock label="Strengths" items={trip.qualityReview?.strengths ?? []} />
                  <ListBlock label="Warnings" items={trip.qualityReview?.warnings ?? []} />
                  <ListBlock label="Ideas" items={trip.qualityReview?.improvementIdeas ?? []} />
                </Panel>
              </aside>
            </section>
          </div>
        ) : null}
      </main>
    </ProtectedPage>
  );
}

function InfoPanel({ icon, title, value }: { icon: ReactNode; title: string; value: string }) {
  return (
    <div className="rounded-lg border border-black/10 bg-white p-4 shadow-soft">
      <div className="mb-3 text-moss">{icon}</div>
      <p className="text-xs font-semibold uppercase tracking-[0.08em] text-ink/45">{title}</p>
      <p className="mt-1 text-xl font-semibold text-ink">{value}</p>
    </div>
  );
}

function Panel({ title, icon, children }: { title: string; icon: ReactNode; children: ReactNode }) {
  return (
    <section className="rounded-lg border border-black/10 bg-white p-5 shadow-soft">
      <div className="mb-4 flex items-center gap-2 text-ink">
        <span className="text-moss">{icon}</span>
        <h2 className="font-semibold">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function BudgetRows({ trip }: { trip: Trip }) {
  const budget = trip.budgetEstimate;
  const rows = [
    ["Flights", budget?.flights],
    ["Accommodation", budget?.accommodation],
    ["Food", budget?.food],
    ["Activities", budget?.activities],
    ["Transport", budget?.localTransport],
    ["Misc.", budget?.miscellaneous]
  ];

  return (
    <div className="space-y-2">
      {rows.map(([label, value]) => (
        <div key={label} className="flex items-center justify-between gap-3 text-sm">
          <span className="text-ink/60">{label}</span>
          <span className="font-medium text-ink">{money(value as number, budget?.currency)}</span>
        </div>
      ))}
      <div className="mt-3 border-t border-black/10 pt-3 text-sm leading-6 text-ink/60">{budget?.notes}</div>
    </div>
  );
}

function ListBlock({ label, items }: { label: string; items: string[] }) {
  if (items.length === 0) {
    return null;
  }
  return (
    <div className="mt-4">
      <h3 className="text-sm font-semibold text-ink">{label}</h3>
      <ul className="mt-2 space-y-2">
        {items.map((item) => (
          <li key={item} className="text-sm leading-6 text-ink/65">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function money(value: number | undefined, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0
  }).format(value ?? 0);
}
