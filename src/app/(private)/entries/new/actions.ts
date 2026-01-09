"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { SessionType } from "@prisma/client";
import { prisma } from "@/lib/prisma";

function toNumber(value: FormDataEntryValue | null) {
  if (!value || typeof value !== "string") {
    return null;
  }
  const parsed = Number.parseFloat(value);
  return Number.isNaN(parsed) ? null : parsed;
}

function toInt(value: FormDataEntryValue | null) {
  if (!value || typeof value !== "string") {
    return null;
  }
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? null : parsed;
}

function toSessionType(value: FormDataEntryValue | null): SessionType {
  if (!value || typeof value !== "string") {
    return SessionType.PRACTICE;
  }
  const normalized = value.toString();
  return Object.values(SessionType).includes(normalized as SessionType)
    ? (normalized as SessionType)
    : SessionType.PRACTICE;
}

export async function createTrainingEntry(formData: FormData) {
  const dateValue = formData.get("date");
  const date = dateValue ? new Date(dateValue.toString()) : new Date();

  const carId = formData.get("carId")?.toString();
  const trackId = formData.get("trackId")?.toString();
  const sessionType = toSessionType(formData.get("sessionType"));

  if (!carId || !trackId) {
    redirect("/entries/new?error=missing");
  }

  #const setupType = formData.get("setupType")?.toString() || undefined;
  const setupType = toSetupType(formData.get("setupType"));
  const visibility = formData.get("visibility")?.toString() ?? "PRIVATE";
  const breakthrough = formData.get("breakthrough") === "on";
  const telemetryLinks = formData.get("telemetryLinks")?.toString() ?? "";
  const tagIds = formData.getAll("tags").map((value) => value.toString());

  const links = telemetryLinks
    .split(/\r?\n/)
    .map((link) => link.trim())
    .filter(Boolean);

  const entryTags =
    tagIds.length > 0
      ? {
          create: tagIds.map((tagId) => ({
            tagId,
          })),
        }
      : undefined;

  const mediaLinks =
    links.length > 0
      ? {
          create: links.map((url) => ({
            url,
            type: "GARAGE61",
          })),
        }
      : undefined;

  await prisma.trainingEntry.create({
    data: {
      date,
      carId,
      trackId,
      sessionType,
      setupType: setupType,
      conditions: formData.get("conditions")?.toString() || undefined,
      fuel: toNumber(formData.get("fuel")),
      tires: formData.get("tires")?.toString() || undefined,
      bestLap: toNumber(formData.get("bestLap")),
      optimalLap: toNumber(formData.get("optimalLap")),
      avgLap: toNumber(formData.get("avgLap")),
      consistency: toNumber(formData.get("consistency")),
      incidents: toInt(formData.get("incidents")) ?? undefined,
      objective: formData.get("objective")?.toString() || undefined,
      workedOn: formData.get("workedOn")?.toString() || undefined,
      telemetryNotes: formData.get("telemetryNotes")?.toString() || undefined,
      whatChanged: formData.get("whatChanged")?.toString() || undefined,
      whatDidnt: formData.get("whatDidnt")?.toString() || undefined,
      nextPlan: formData.get("nextPlan")?.toString() || undefined,
      visibility,
      breakthrough,
      entryTags,
      mediaLinks,
    },
  });

  revalidatePath("/log");
  revalidatePath("/");

  const intent = formData.get("intent")?.toString();
  if (intent === "add-another") {
    redirect("/entries/new?saved=1");
  }
  redirect("/log");
}
