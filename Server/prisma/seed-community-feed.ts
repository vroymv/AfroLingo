import { PrismaClient, type CommunityPostCategory } from "@prisma/client";

const prisma = new PrismaClient();

type SeedPost = {
  externalId: string;
  authorEmail: string;
  title: string;
  content: string;
  language?: string;
  category: CommunityPostCategory;
  tags: string[];
  isTrending?: boolean;
  likeUserEmails?: string[];
  reactions?: Array<{ emoji: string; userEmails: string[] }>;
  comments?: Array<{
    authorEmail: string;
    body: string;
    replies?: Array<{ authorEmail: string; body: string }>;
  }>;
};

function emailForSeedUser(slug: string): string {
  return `${slug}@seed.afrolingo.local`;
}

async function ensureUser(params: {
  email: string;
  name: string;
  userType?: "LEARNER" | "NATIVE" | "TUTOR";
  profileImageUrl?: string | null;
  languages?: string[];
  bio?: string | null;
}): Promise<{ id: string; email: string; name: string }> {
  const user = await prisma.user.upsert({
    where: { email: params.email },
    create: {
      email: params.email,
      name: params.name,
      userType: params.userType ?? "LEARNER",
      languages: params.languages ?? [],
      bio: params.bio ?? null,
      profileImageUrl: params.profileImageUrl ?? null,
    },
    update: {
      name: params.name,
      userType: params.userType ?? "LEARNER",
      languages: params.languages ?? [],
      bio: params.bio ?? null,
      profileImageUrl: params.profileImageUrl ?? null,
    },
    select: { id: true, email: true, name: true },
  });

  return user;
}

const SEED_POSTS: SeedPost[] = [
  {
    externalId: "community-post-1",
    authorEmail: emailForSeedUser("sarah"),
    title: "Pronunciation tips for beginners",
    content:
      "I've been struggling with certain sounds in Yoruba. Any native speakers willing to help with the tones?",
    language: "Yoruba",
    category: "PRONUNCIATION",
    tags: ["Yoruba", "Pronunciation", "Beginner"],
    isTrending: true,
    likeUserEmails: [emailForSeedUser("kwame"), emailForSeedUser("amina")],
    reactions: [
      { emoji: "👍", userEmails: [emailForSeedUser("kwame")] },
      { emoji: "🔥", userEmails: [emailForSeedUser("amina")] },
    ],
    comments: [
      {
        authorEmail: emailForSeedUser("kwame"),
        body: "Tone can be tricky—try shadowing slow recordings and exaggerating the contour at first.",
        replies: [
          {
            authorEmail: emailForSeedUser("sarah"),
            body: "This helps a lot—do you have any favorite recordings?",
          },
        ],
      },
    ],
  },
  {
    externalId: "community-post-2",
    authorEmail: emailForSeedUser("kwame"),
    title: "Best resources for intermediate level",
    content:
      "Looking for recommendations beyond the basic courses. What helped you progress from intermediate to advanced?",
    language: "General",
    category: "DISCUSSION",
    tags: ["Resources", "Intermediate", "Study Tips"],
    likeUserEmails: [emailForSeedUser("sarah")],
    reactions: [{ emoji: "💡", userEmails: [emailForSeedUser("amina")] }],
    comments: [
      {
        authorEmail: emailForSeedUser("amina"),
        body: "What helped me most was weekly speaking practice with consistent feedback + keeping a vocab journal.",
      },
    ],
  },
  {
    externalId: "community-post-3",
    authorEmail: emailForSeedUser("amina"),
    title: "Weekly Challenge: Cultural phrases",
    content:
      "This week's challenge: Share common cultural expressions from your target language and explain their meaning!",
    language: "General",
    category: "CULTURAL",
    tags: ["Challenge", "Culture", "Weekly"],
    likeUserEmails: [emailForSeedUser("sarah"), emailForSeedUser("kwame")],
    reactions: [
      { emoji: "🌍", userEmails: [emailForSeedUser("kwame")] },
      { emoji: "🎯", userEmails: [emailForSeedUser("sarah")] },
    ],
  },
];

async function main() {
  console.log("🌱 Seeding Community Feed (non-destructive)...\n");

  const sarah = await ensureUser({
    email: emailForSeedUser("sarah"),
    name: "Sarah Learns",
    userType: "LEARNER",
    profileImageUrl: "👩🏽‍🎓",
    languages: ["Yoruba", "English"],
    bio: "Learning African languages—currently focused on Yoruba tones.",
  });

  const kwame = await ensureUser({
    email: emailForSeedUser("kwame"),
    name: "Kwame Asante",
    userType: "NATIVE",
    profileImageUrl: "👨🏿‍🏫",
    languages: ["Akan", "English"],
    bio: "Native speaker happy to help learners improve pronunciation.",
  });

  const amina = await ensureUser({
    email: emailForSeedUser("amina"),
    name: "Amina Hassan",
    userType: "TUTOR",
    profileImageUrl: "👩🏿‍💼",
    languages: ["Swahili", "English"],
    bio: "Tutor—weekly challenges and speaking practice.",
  });

  const userIdByEmail = new Map<string, string>([
    [sarah.email, sarah.id],
    [kwame.email, kwame.id],
    [amina.email, amina.id],
  ]);

  for (const post of SEED_POSTS) {
    const authorId = userIdByEmail.get(post.authorEmail);
    if (!authorId) {
      throw new Error(`Seed author not found for email: ${post.authorEmail}`);
    }

    const created = await prisma.communityPost.upsert({
      where: { externalId: post.externalId },
      create: {
        externalId: post.externalId,
        authorId,
        title: post.title,
        content: post.content,
        language: post.language,
        category: post.category,
        tags: post.tags,
        isTrending: post.isTrending ?? false,
        isActive: true,
      },
      update: {
        authorId,
        title: post.title,
        content: post.content,
        language: post.language,
        category: post.category,
        tags: post.tags,
        isTrending: post.isTrending ?? false,
        isActive: true,
      },
      select: { id: true, externalId: true },
    });

    const likeEmails = Array.from(new Set(post.likeUserEmails ?? []));
    for (const email of likeEmails) {
      const userId = userIdByEmail.get(email);
      if (!userId) continue;
      await prisma.communityPostLike
        .create({
          data: { postId: created.id, userId },
          select: { id: true },
        })
        .catch((e: any) => {
          if (e?.code === "P2002") return null;
          throw e;
        });
    }

    for (const reaction of post.reactions ?? []) {
      for (const email of reaction.userEmails) {
        const userId = userIdByEmail.get(email);
        if (!userId) continue;
        await prisma.communityPostReaction
          .create({
            data: { postId: created.id, userId, emoji: reaction.emoji },
            select: { id: true },
          })
          .catch((e: any) => {
            if (e?.code === "P2002") return null;
            throw e;
          });
      }
    }

    for (const comment of post.comments ?? []) {
      const authorId = userIdByEmail.get(comment.authorEmail);
      if (!authorId) continue;

      const top = await prisma.communityPostComment.create({
        data: {
          postId: created.id,
          authorId,
          body: comment.body,
        },
        select: { id: true },
      });

      for (const reply of comment.replies ?? []) {
        const replyAuthorId = userIdByEmail.get(reply.authorEmail);
        if (!replyAuthorId) continue;
        await prisma.communityPostComment.create({
          data: {
            postId: created.id,
            authorId: replyAuthorId,
            parentId: top.id,
            body: reply.body,
          },
          select: { id: true },
        });
      }
    }
  }

  console.log(`✅ Community feed seeded (${SEED_POSTS.length} posts)`);
}

main()
  .catch((e) => {
    console.error("Error seeding community feed:", e);
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
