import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

import User from "../models/User.model.js";
import Post from "../models/Post.model.js";

dotenv.config();

const seedUsers = [
  {
    username: "test_alice",
    email: "test.alice@signal.local",
    password: "Password123!",
    bio: "Backend engineer focused on APIs and data pipelines.",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
    skills: [
      { skill: "Node.js", score: 78 },
      { skill: "MongoDB", score: 73 },
    ],
    reputationScore: 140,
    trustLevel: "trusted",
  },
  {
    username: "test_bob",
    email: "test.bob@signal.local",
    password: "Password123!",
    bio: "Frontend engineer working on accessibility-first UIs.",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
    skills: [
      { skill: "React", score: 81 },
      { skill: "CSS", score: 74 },
    ],
    reputationScore: 110,
    trustLevel: "trusted",
  },
  {
    username: "test_carla",
    email: "test.carla@signal.local",
    password: "Password123!",
    bio: "Data scientist interested in ranking quality and recommendation systems.",
    avatar:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=400&q=80",
    skills: [
      { skill: "Python", score: 88 },
      { skill: "ML", score: 82 },
    ],
    reputationScore: 190,
    trustLevel: "Expert",
  },
];

const seedPosts = [
  {
    username: "test_alice",
    title: "Designing resilient retry logic for distributed APIs",
    content:
      "A practical approach to idempotency keys, backoff, and failure budget handling in high-throughput systems.",
    imageUrl:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
    tags: ["backend", "architecture", "reliability"],
    isPublished: true,
    valueTags: {
      insightful: 3,
      wellResearched: 2,
      practical: 3,
      challenging: 1,
      constructive: 2,
    },
  },
  {
    username: "test_bob",
    title: "Building accessible component libraries at scale",
    content:
      "Patterns for keyboard navigation, semantic structure, and design token governance across teams.",
    imageUrl:
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1200&q=80",
    tags: ["frontend", "accessibility", "design-system"],
    isPublished: true,
    valueTags: {
      insightful: 2,
      wellResearched: 2,
      practical: 3,
      challenging: 1,
      constructive: 2,
    },
  },
  {
    username: "test_carla",
    title: "Evaluating ranking quality using offline and online signals",
    content:
      "How to combine engagement metrics with qualitative feedback loops to improve feed relevance.",
    imageUrl:
      "https://images.unsplash.com/photo-1551281044-8b9a7a7272d8?auto=format&fit=crop&w=1200&q=80",
    tags: ["ranking", "metrics", "ml"],
    isPublished: true,
    valueTags: {
      insightful: 4,
      wellResearched: 4,
      practical: 2,
      challenging: 2,
      constructive: 2,
    },
  },
  {
    username: "test_alice",
    title: "Schema migration checklist for zero-downtime releases",
    content:
      "A phased migration checklist covering dual writes, backfills, and traffic shifting strategies.",
    imageUrl:
      "https://images.unsplash.com/photo-1516110833967-0b5716ca1387?auto=format&fit=crop&w=1200&q=80",
    tags: ["database", "migrations", "devops"],
    isPublished: true,
    valueTags: {
      insightful: 3,
      wellResearched: 3,
      practical: 4,
      challenging: 1,
      constructive: 3,
    },
  },
];

const connect = async () => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error("Missing MONGO_URI in environment.");
  }

  await mongoose.connect(mongoUri);
};

const createOrUpdateUsers = async () => {
  const createdUsersByUsername = new Map();

  for (const item of seedUsers) {
    const hashedPassword = await bcrypt.hash(item.password, 10);

    const user = await User.findOneAndUpdate(
      { email: item.email },
      {
        username: item.username,
        email: item.email,
        password: hashedPassword,
        bio: item.bio,
        avatar: item.avatar,
        skills: item.skills,
        reputationScore: item.reputationScore,
        trustLevel: item.trustLevel,
      },
      {
        returnDocument: "after",
        upsert: true,
        setDefaultsOnInsert: true,
      }
    );

    createdUsersByUsername.set(item.username, user);
  }

  return createdUsersByUsername;
};

const createPosts = async (usersByUsername) => {
  for (const item of seedPosts) {
    const author = usersByUsername.get(item.username);

    if (!author) {
      throw new Error(`User ${item.username} is missing. Cannot create post.`);
    }

    await Post.create({
      author: author._id,
      title: item.title,
      content: item.content,
      imageUrl: item.imageUrl,
      tags: item.tags,
      isPublished: item.isPublished,
      valueTags: item.valueTags,
    });
  }
};

const cleanupSeedPosts = async (usersByUsername) => {
  const userIds = Array.from(usersByUsername.values()).map((user) => user._id);
  await Post.deleteMany({ author: { $in: userIds } });
};

const run = async () => {
  try {
    await connect();

    const usersByUsername = await createOrUpdateUsers();
    await cleanupSeedPosts(usersByUsername);
    await createPosts(usersByUsername);

    console.log(`Seeded ${usersByUsername.size} users and ${seedPosts.length} posts.`);
    console.log("Image fields saved to User.avatar and Post.imageUrl.");
    // Print a demo user's credentials (useful for local development/testing)
    const demoUser = seedUsers.find((u) => u.username === "test_alice") || seedUsers[0];
    if (demoUser) {
      console.log("Demo credentials (local only):");
      console.log(`Email: ${demoUser.email}`);
      console.log(`Password: ${demoUser.password}`);
    }
  } catch (error) {
    console.error("Seeding failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
};

run();
