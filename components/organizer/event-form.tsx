"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { ArrowLeft, ArrowRight, Check, ImagePlus, Plus } from "lucide-react";
import { useApi } from "@/lib/api";
import type { ManagedEventDto, ManagedSession, ManagedTicketType, ManagedVenue } from "@/lib/catalog";
import type { EventCategory } from "@/lib/mock/events";

const steps = ["Basics", "Images", "Date & location", "Tickets", "Review"];
const defaultDate = "2026-11-15";

export function EventForm({ eventId }: { eventId?: string }) {
  const api = useApi();
  const [existing, setExisting] = useState<ManagedEventDto>();
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [category, setCategory] = useState<EventCategory>("technology");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [venue, setVenue] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("Ho Chi Minh City");
  const [startDate, setStartDate] = useState(defaultDate);
  const [startTime, setStartTime] = useState("10:00");
  const [endDate, setEndDate] = useState(defaultDate);
  const [endTime, setEndTime] = useState("18:00");
  const [price, setPrice] = useState(250000);
  const [quantity, setQuantity] = useState(250);
  const [ticketName, setTicketName] = useState("General Admission");
  const [existingTicket, setExistingTicket] = useState<ManagedTicketType>();
  const [loading, setLoading] = useState(Boolean(eventId));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>();
  const [done, setDone] = useState(false);
  const [published, setPublished] = useState(false);

  useEffect(() => {
    if (!eventId) return;
    const controller = new AbortController();
    void api<ManagedEventDto>(`/api/v1/management/events/${eventId}`, controller.signal)
      .then(async (item) => {
        const session = item.sessions[0];
        setExisting(item);
        setName(item.name);
        setCategory(item.category.toLowerCase() as EventCategory);
        setDescription(item.description);
        setImageUrl(item.imageUrl ?? "");
        setVenue(item.venue?.name ?? "");
        setAddress(item.venue?.addressLine ?? "");
        setCity(item.venue?.city ?? "Ho Chi Minh City");
        if (session) {
          const start = dateParts(session.startsAtUtc);
          const end = dateParts(session.endsAtUtc);
          setStartDate(start.date); setStartTime(start.time);
          setEndDate(end.date); setEndTime(end.time);
          const tickets = await api<ManagedTicketType[]>(
            `/api/v1/management/event-sessions/${session.id}/ticket-types`, controller.signal,
          );
          const ticket = tickets[0];
          if (ticket) {
            setExistingTicket(ticket);
            setTicketName(ticket.name);
            setPrice(ticket.price);
            setQuantity(ticket.capacity);
          }
        }
      })
      .catch((cause) => { if (!controller.signal.aborted) setError(messageOf(cause)); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [api, eventId]);

  async function save(formEvent: FormEvent<HTMLFormElement>) {
    formEvent.preventDefault();
    const submitter = (formEvent.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null;
    const shouldPublish = submitter?.value === "published";
    setSaving(true);
    setError(undefined);
    try {
      const venuePayload = JSON.stringify({
        name: venue, addressLine: address, city, countryCode: "VN", timeZone: "Asia/Ho_Chi_Minh",
      });
      const savedVenue = existing?.venue
        ? await api<ManagedVenue>(`/api/v1/management/venues/${existing.venue.id}`, { method: "PUT", body: venuePayload })
        : await api<ManagedVenue>("/api/v1/management/venues", { method: "POST", body: venuePayload });

      const startsAtUtc = localDateTime(startDate, startTime);
      const endsAtUtc = localDateTime(endDate, endTime);
      const eventPayload = JSON.stringify({
        name, slug: existing?.slug, description, category, venueId: savedVenue.id,
        imageUrl: imageUrl || undefined,
        saleStartsAtUtc: new Date().toISOString(), saleEndsAtUtc: startsAtUtc,
        version: existing?.version ?? 0,
      });
      let savedEvent = existing
        ? await api<ManagedEventDto>(`/api/v1/management/events/${existing.id}`, { method: "PATCH", body: eventPayload })
        : await api<ManagedEventDto>("/api/v1/management/events", { method: "POST", body: eventPayload });

      const currentSession = existing?.sessions[0];
      const sessionPayload = JSON.stringify({
        name: currentSession?.name ?? "Main session", startsAtUtc, endsAtUtc,
        version: currentSession?.version ?? 0,
      });
      let savedSession: ManagedSession;
      if (currentSession) {
        savedSession = await api<ManagedSession>(`/api/v1/management/event-sessions/${currentSession.id}`, {
          method: "PUT", body: sessionPayload,
        });
      } else {
        savedSession = await api<ManagedSession>(`/api/v1/management/events/${savedEvent.id}/sessions`, {
          method: "POST", body: sessionPayload,
        });
      }

      const ticketPayload = JSON.stringify({
        name: ticketName,
        code: ticketCode(ticketName),
        description: "Standard event access",
        price,
        inventoryMode: "GeneralAdmission",
        capacity: quantity,
        maxPerOrder: 10,
        saleStartsAtUtc: new Date().toISOString(),
        saleEndsAtUtc: startsAtUtc,
      });
      if (existingTicket) {
        const updatedTicket = await api<ManagedTicketType>(
          `/api/v1/management/ticket-types/${existingTicket.id}`,
          {
            method: "PATCH",
            body: JSON.stringify({ ...JSON.parse(ticketPayload), version: existingTicket.version }),
          },
        );
        if (updatedTicket.capacity !== quantity) {
          await api<ManagedTicketType>(`/api/v1/management/ticket-types/${existingTicket.id}/capacity`, {
            method: "PUT", body: JSON.stringify({ capacity: quantity, version: updatedTicket.version }),
          });
        }
      } else {
        const ticket = await api<ManagedTicketType>(
          `/api/v1/management/event-sessions/${savedSession.id}/ticket-types`,
          { method: "POST", body: ticketPayload },
        );
        setExistingTicket(ticket);
      }

      if (shouldPublish && savedEvent.status.toLowerCase() === "draft") {
        savedEvent = await api<ManagedEventDto>(`/api/v1/management/events/${savedEvent.id}/publish`, {
          method: "POST", body: JSON.stringify({ version: savedEvent.version }),
        });
      }
      setExisting(savedEvent);
      setPublished(savedEvent.status.toLowerCase() === "published");
      setDone(true);
    } catch (cause) {
      setError(messageOf(cause));
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="rounded-2xl border border-slate-100 bg-white p-8 text-sm text-slate-500">Loading event…</div>;

  return <div className="rounded-2xl border border-slate-100 bg-white p-5 sm:p-7"><div className="mb-6 flex flex-wrap items-center justify-between gap-3"><div><p className="eyebrow">Event setup</p><h2 className="mt-1 text-xl font-extrabold">{eventId ? "Edit event" : "Create an event"}</h2></div><Link href="/organizer/events" className="text-xs font-semibold text-slate-500 hover:text-[#e7653c]">Save and exit</Link></div>
    {error && <p role="alert" className="notice mb-5">{error}</p>}
    {done ? <div className="rounded-2xl bg-emerald-50 p-8 text-center"><span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-emerald-100 text-emerald-700"><Check /></span><h3 className="mt-4 text-lg font-extrabold">Event saved {published ? "and published" : "as a draft"}</h3><p className="mt-2 text-sm text-slate-500">Organizer, venue, event and session data are now stored by TixFlow.</p><Link href="/organizer/events" className="button-primary mt-5">Back to events</Link></div> : <form onSubmit={save}>
      <ol className="mb-7 grid grid-cols-5 gap-1">{steps.map((label, index) => <li key={label} className="text-center"><div className={`mx-auto grid h-8 w-8 place-items-center rounded-full text-xs font-extrabold ${index <= step ? "bg-[#f36b3f] text-white" : "bg-slate-100 text-slate-400"}`}>{index < step ? <Check size={14} /> : index + 1}</div><span className={`mt-2 hidden text-[10px] font-bold sm:block ${index === step ? "text-slate-800" : "text-slate-400"}`}>{label}</span></li>)}</ol>
      {step === 0 && <div className="grid gap-4 sm:grid-cols-2"><label className="text-xs font-bold text-slate-600 sm:col-span-2">Event name<input required value={name} onChange={(e) => setName(e.target.value)} className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm font-normal" placeholder="Give your event a name" /></label><label className="text-xs font-bold text-slate-600">Category<select value={category} onChange={(e) => setCategory(e.target.value as EventCategory)} className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-normal"><option value="technology">IT & Tech</option><option value="business">Business</option><option value="music">Music</option><option value="education">Education</option><option value="art">Art & Design</option><option value="workshop">Workshop</option></select></label><div className="text-xs text-slate-500 sm:pt-7">Choose the category that best describes your event.</div><label className="text-xs font-bold text-slate-600 sm:col-span-2">Description<textarea required rows={5} value={description} onChange={(e) => setDescription(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 p-3 text-sm font-normal" placeholder="Tell people what makes this event worth attending" /></label></div>}
      {step === 1 && <div><div className="flex min-h-52 flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 text-center" style={imageUrl ? { backgroundImage: `linear-gradient(rgb(15 23 42 / 35%), rgb(15 23 42 / 35%)), url(${imageUrl})`, backgroundSize: "cover", backgroundPosition: "center" } : undefined}><ImagePlus size={28} className={imageUrl ? "text-white" : "text-[#e7653c]"} /><span className={`mt-3 text-sm font-bold ${imageUrl ? "text-white" : ""}`}>{imageUrl ? "Cover image preview" : "Add a cover image URL"}</span><span className={`mt-1 text-xs ${imageUrl ? "text-white/90" : "text-slate-500"}`}>Recommended 1600 × 900 px</span></div><label className="mt-4 block text-xs font-bold text-slate-600">Image URL<input type="url" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm font-normal" placeholder="https://images.example.com/event-cover.jpg" /></label><p className="mt-3 text-xs text-slate-500">TixFlow stores only the HTTP(S) image URL, not binary image data.</p></div>}
      {step === 2 && <div className="grid gap-4 sm:grid-cols-2"><label className="text-xs font-bold text-slate-600">Start date<input type="date" required value={startDate} onChange={(e) => setStartDate(e.target.value)} className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm font-normal" /></label><label className="text-xs font-bold text-slate-600">Start time<input type="time" required value={startTime} onChange={(e) => setStartTime(e.target.value)} className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm font-normal" /></label><label className="text-xs font-bold text-slate-600">End date<input type="date" required value={endDate} onChange={(e) => setEndDate(e.target.value)} className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm font-normal" /></label><label className="text-xs font-bold text-slate-600">End time<input type="time" required value={endTime} onChange={(e) => setEndTime(e.target.value)} className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm font-normal" /></label><label className="text-xs font-bold text-slate-600">Venue<input required value={venue} onChange={(e) => setVenue(e.target.value)} className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm font-normal" placeholder="Venue name" /></label><label className="text-xs font-bold text-slate-600">Address<input required value={address} onChange={(e) => setAddress(e.target.value)} className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm font-normal" placeholder="Street address" /></label><label className="text-xs font-bold text-slate-600">City<input required value={city} onChange={(e) => setCity(e.target.value)} className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm font-normal" /></label></div>}
      {step === 3 && <div><div className="mb-4 flex items-center justify-between"><div><div className="text-sm font-bold">{ticketName}</div><div className="mt-1 text-xs text-slate-500">Standard event access</div></div><button type="button" aria-label="Add ticket type" className="button-outline !min-h-9 !px-3"><Plus size={15} />Add ticket</button></div><div className="grid gap-4 rounded-xl border border-slate-100 p-4 sm:grid-cols-2"><label className="text-xs font-bold text-slate-600">Ticket name<input required value={ticketName} onChange={(e) => setTicketName(e.target.value)} className="mt-2 h-10 w-full rounded-lg border border-slate-200 px-3 text-sm font-normal" /></label><label className="text-xs font-bold text-slate-600">Price (VND)<input type="number" min="0" value={price} onChange={(e) => setPrice(Number(e.target.value))} className="mt-2 h-10 w-full rounded-lg border border-slate-200 px-3 text-sm font-normal" /></label><label className="text-xs font-bold text-slate-600">Quantity<input type="number" min="1" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} className="mt-2 h-10 w-full rounded-lg border border-slate-200 px-3 text-sm font-normal" /></label><label className="text-xs font-bold text-slate-600">Sale ends<input type="date" value={startDate} readOnly className="mt-2 h-10 w-full rounded-lg border border-slate-200 px-3 text-sm font-normal" /></label></div><p className="mt-3 text-xs text-slate-500">Price and available quantity are saved to the event inventory.</p></div>}
      {step === 4 && <div className="overflow-hidden rounded-2xl border border-slate-100"><div className="h-40 bg-[#fff0e9] bg-cover bg-center p-5" style={imageUrl ? { backgroundImage: `linear-gradient(rgb(255 240 233 / 88%), rgb(255 240 233 / 88%)), url(${imageUrl})` } : undefined}><p className="eyebrow">Event preview</p><h3 className="mt-3 max-w-xl text-2xl font-extrabold">{name || "Your event name"}</h3><p className="mt-2 text-sm text-slate-600">{description || "Your event description will appear here."}</p></div><div className="grid gap-3 p-5 text-sm sm:grid-cols-2"><div><span className="text-slate-400">Venue</span><div className="mt-1 font-bold">{venue || "Venue not set"}</div></div><div><span className="text-slate-400">Tickets</span><div className="mt-1 font-bold">{Number(price).toLocaleString()} VND · {quantity} planned</div></div></div></div>}
      <div className="mt-8 flex justify-between border-t border-slate-100 pt-5"><button type="button" disabled={step === 0 || saving} onClick={() => setStep((value) => value - 1)} className="button-outline disabled:opacity-40"><ArrowLeft size={15} />Back</button>{step < steps.length - 1 ? <button type="button" onClick={() => setStep((value) => value + 1)} className="button-primary">Continue<ArrowRight size={15} /></button> : <div className="flex gap-2"><button type="submit" value="draft" disabled={saving} className="button-outline">{saving ? "Saving…" : "Save draft"}</button><button type="submit" value="published" disabled={saving} className="button-primary">Publish event<Check size={15} /></button></div>}</div>
    </form>}
  </div>;
}

function localDateTime(date: string, time: string): string {
  const value = new Date(`${date}T${time}:00+07:00`);
  if (Number.isNaN(value.getTime())) throw new Error("Event date and time are invalid.");
  return value.toISOString();
}

function dateParts(value: string): { date: string; time: string } {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Ho_Chi_Minh", year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", hourCycle: "h23",
  });
  const parts = Object.fromEntries(formatter.formatToParts(new Date(value)).map((part) => [part.type, part.value]));
  return { date: `${parts.year}-${parts.month}-${parts.day}`, time: `${parts.hour}:${parts.minute}` };
}

function messageOf(cause: unknown): string {
  return cause instanceof Error ? cause.message : "Unable to save the event. Please try again.";
}

function ticketCode(value: string): string {
  return value.trim().toUpperCase().replace(/[^A-Z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40) || "GENERAL";
}
