"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DANCE_STYLES } from "@/lib/constants";
import type { Event } from "@/lib/db/schema";

type EventFormProps = {
  action: (formData: FormData) => Promise<unknown>;
  event?: Event;
};

export function EventForm({ action, event }: EventFormProps) {
  async function handleSubmit(formData: FormData) {
    await action(formData);
  }
  const [eventType, setEventType] = useState<string>(event?.eventType ?? "other");
  const [status, setStatus] = useState<string>(event?.status ?? "draft");

  const defaultStart = event?.startDate
    ? new Date(event.startDate).toISOString().slice(0, 16)
    : "";
  const defaultEnd = event?.endDate
    ? new Date(event.endDate).toISOString().slice(0, 16)
    : "";

  return (
    <form action={handleSubmit} className="space-y-6">
      <input type="hidden" name="eventType" value={eventType} />
      <input type="hidden" name="status" value={status} />

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="title">Event Title</Label>
          <Input id="title" name="title" defaultValue={event?.title} required />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            rows={5}
            defaultValue={event?.description}
            required
          />
        </div>

        <div className="space-y-2">
          <Label>Dance Style</Label>
          <Select value={eventType} onValueChange={setEventType}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {DANCE_STYLES.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Status</Label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="imageUrl">Image URL</Label>
          <Input
            id="imageUrl"
            name="imageUrl"
            type="url"
            placeholder="https://..."
            defaultValue={event?.imageUrl ?? ""}
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="location">Venue / Location</Label>
          <Input
            id="location"
            name="location"
            defaultValue={event?.location}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
          <Input id="city" name="city" defaultValue={event?.city} required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="country">Country</Label>
          <Input
            id="country"
            name="country"
            defaultValue={event?.country}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="startDate">Start Date & Time</Label>
          <Input
            id="startDate"
            name="startDate"
            type="datetime-local"
            defaultValue={defaultStart}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="endDate">End Date & Time</Label>
          <Input
            id="endDate"
            name="endDate"
            type="datetime-local"
            defaultValue={defaultEnd}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="capacity">Capacity</Label>
          <Input
            id="capacity"
            name="capacity"
            type="number"
            min={1}
            defaultValue={event?.capacity ?? 50}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="price">Price (EUR)</Label>
          <Input
            id="price"
            name="price"
            type="number"
            min={0}
            step={0.01}
            defaultValue={event ? event.price / 100 : 0}
            required
          />
        </div>
      </div>

      <Button type="submit" size="lg">
        {event ? "Update Event" : "Create Event"}
      </Button>
    </form>
  );
}
