const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  await prisma.mediaLink.deleteMany();
  await prisma.entryTag.deleteMany();
  await prisma.entryDrill.deleteMany();
  await prisma.trainingEntry.deleteMany();
  await prisma.weeklyBlock.deleteMany();
  await prisma.drill.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.track.deleteMany();
  await prisma.car.deleteMany();

  await prisma.car.createMany({
    data: [
      {
        name: "Super Formula Lights",
        series: "SFL",
        slug: "super-formula-lights",
        notes: "Baseline notes: neutral aero, stable rear on throttle.",
      },
    ],
  });

  await prisma.track.createMany({
    data: [
      {
        name: "Silverstone",
        config: "GP",
        location: "UK",
        slug: "silverstone-gp",
      },
      {
        name: "Sebring",
        config: "International",
        location: "USA",
        slug: "sebring-international",
      },
      {
        name: "Monza",
        config: "GP",
        location: "Italy",
        slug: "monza-gp",
      },
    ],
  });

  await prisma.tag.createMany({
    data: [
      { name: "trail braking" },
      { name: "exits" },
      { name: "rotation" },
      { name: "cold tires" },
      { name: "braking points" },
      { name: "overdriving" },
      { name: "consistency" },
    ],
  });

  await prisma.drill.createMany({
    data: [
      {
        name: "Trail Brake to Apex - 10 reps",
        purpose: "Hold brake pressure to the apex without ABS chatter.",
        steps: "- Pick one corner\n- 10 consecutive laps\n- Reduce brake 5% each lap",
        successMetric: "3/5 apex speeds within 2 km/h",
        failureModes: "Release too early, rear snap on entry",
        tags: "trail braking, rotation",
      },
      {
        name: "Exit Throttle Roll - 8 reps",
        purpose: "Build throttle without rear slip.",
        steps: "- Focus on two exits\n- Roll to 100% over 1.5s",
        successMetric: "No TC cuts, minimal steering on exit",
        failureModes: "Early throttle, exit understeer",
        tags: "exits",
      },
      {
        name: "Cold Tire Lap 1 Discipline",
        purpose: "Survive lap 1 with clean inputs.",
        steps: "- Reduce entry speed 5%\n- No curb riding",
        successMetric: "Lap 1 within +2.5s of PB",
        failureModes: "Over-commit on cold fronts",
        tags: "cold tires",
      },
      {
        name: "Brake Marker Verification",
        purpose: "Confirm reference points with repeatable braking.",
        steps: "- Use 3 markers\n- 5 laps each marker",
        successMetric: "Brake delta within 2m lap-to-lap",
        failureModes: "Inconsistent release timing",
        tags: "braking points",
      },
      {
        name: "Mid-Corner Rotation Holds",
        purpose: "Hold rotation without over-rotation.",
        steps: "- Light trail to apex\n- Tiny throttle maintenance",
        successMetric: "No correction in mid-corner",
        failureModes: "Snap oversteer",
        tags: "rotation",
      },
      {
        name: "No-Overdrive Stint (6 laps)",
        purpose: "Smooth inputs for consistency.",
        steps: "- 6-lap stint\n- Avoid 100% brake on first lap",
        successMetric: "Range under 0.6s",
        failureModes: "Chasing PB every lap",
        tags: "consistency, overdriving",
      },
      {
        name: "Apex Speed Audit (3 corners)",
        purpose: "Validate apex speed targets.",
        steps: "- Pick 3 corners\n- Record apex speeds",
        successMetric: "Within 1.5 km/h of target",
        failureModes: "Late turn-in, brake too long",
        tags: "trail braking",
      },
      {
        name: "Exit Line Discipline",
        purpose: "Stay on exit line without mid-exit corrections.",
        steps: "- Two key exits\n- 5 laps each",
        successMetric: "Zero corrections past apex",
        failureModes: "Over-rotation at apex",
        tags: "exits, rotation",
      },
      {
        name: "Entry Speed Cap",
        purpose: "Reduce entry overspeed.",
        steps: "- Cap speed at marker\n- Compare lap delta",
        successMetric: "No entry lockups",
        failureModes: "Panic brake, missed apex",
        tags: "overdriving",
      },
      {
        name: "Corner Grouping (Sector 2)",
        purpose: "Link a sequence with identical approach.",
        steps: "- Focus on 3 corners\n- Same entry cue",
        successMetric: "Sector time variance under 0.3s",
        failureModes: "Inconsistent setup on entry",
        tags: "consistency",
      },
      {
        name: "Brake Release Timing",
        purpose: "Match release point each lap.",
        steps: "- Pick one hard braking zone\n- 8 laps",
        successMetric: "Release within 0.1s variance",
        failureModes: "Release too fast",
        tags: "braking points",
      },
      {
        name: "Rotation to Throttle Blend",
        purpose: "Blend rotation with throttle pickup.",
        steps: "- Two corners\n- Smooth ramp",
        successMetric: "No mid-corner lift",
        failureModes: "Throttle spike",
        tags: "rotation, exits",
      },
    ],
  });

  const car = await prisma.car.findFirst({
    where: { slug: "super-formula-lights" },
  });
  const silverstone = await prisma.track.findFirst({
    where: { slug: "silverstone-gp" },
  });

  if (!car || !silverstone) {
    return;
  }

  const tags = await prisma.tag.findMany();
  const tagMap = new Map(tags.map((tag) => [tag.name, tag.id]));

  await prisma.trainingEntry.create({
    data: {
      date: new Date("2026-01-07T18:00:00Z"),
      carId: car.id,
      trackId: silverstone.id,
      sessionType: "PRACTICE",
      setupType: "OPEN",
      conditions: "Dry, 18C",
      bestLap: 109.321,
      optimalLap: 108.902,
      avgLap: 110.112,
      consistency: 0.62,
      incidents: 0,
      objective: "Stabilize trail braking into Vale/Club.",
      workedOn: "- Trail brake to apex\n- Exit throttle roll",
      telemetryNotes: "Garage61 session from evening stint.",
      whatChanged: "- Later release at Stowe\n- Smoother exit in Club",
      whatDidnt: "- Over-rotated into Vale twice",
      nextPlan: "- 10 reps trail brake drill\n- Focus on exit line",
      visibility: "PUBLIC",
      breakthrough: false,
      entryTags: {
        create: [
          { tagId: tagMap.get("trail braking") },
          { tagId: tagMap.get("exits") },
          { tagId: tagMap.get("rotation") },
        ].filter((entry) => entry.tagId),
      },
      mediaLinks: {
        create: [
          {
            type: "GARAGE61",
            url: "https://garage61.net/example-session-1",
          },
        ],
      },
    },
  });

  await prisma.trainingEntry.create({
    data: {
      date: new Date("2026-01-09T18:00:00Z"),
      carId: car.id,
      trackId: silverstone.id,
      sessionType: "PRACTICE",
      setupType: "OPEN",
      conditions: "Dry, 16C",
      bestLap: 108.988,
      optimalLap: 108.745,
      avgLap: 109.854,
      consistency: 0.54,
      incidents: 1,
      objective: "Reduce overdriving in Sector 2.",
      workedOn: "- Entry speed cap\n- Mid-corner rotation holds",
      telemetryNotes: "Comparative laps vs session 1.",
      whatChanged: "- Less brake pressure at Brooklands",
      whatDidnt: "- Late apex into Luffield",
      nextPlan: "- Brake release timing drill\n- Sector 2 grouping",
      visibility: "PUBLIC",
      breakthrough: true,
      entryTags: {
        create: [
          { tagId: tagMap.get("overdriving") },
          { tagId: tagMap.get("consistency") },
        ].filter((entry) => entry.tagId),
      },
      mediaLinks: {
        create: [
          {
            type: "GARAGE61",
            url: "https://garage61.net/example-session-2",
          },
        ],
      },
    },
  });

  await prisma.weeklyBlock.create({
    data: {
      startDate: new Date("2026-01-06T00:00:00Z"),
      endDate: new Date("2026-01-12T00:00:00Z"),
      targetCarId: car.id,
      targetTrackId: silverstone.id,
      goals: "- PB under 1:49.0\n- Zero offs",
      focusSkills: "trail braking, exits",
      plannedSessions: 4,
    },
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
