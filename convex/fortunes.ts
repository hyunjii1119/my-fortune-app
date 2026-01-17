import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// 운세 저장
export const saveFortune = mutation({
    args: {
        name: v.string(),
        birthDate: v.string(),
        topic: v.string(),
        topicLabel: v.string(),
        fortune: v.string(),
        temperature: v.number(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();

        if (!identity) {
            throw new Error("Not authenticated");
        }

        const fortuneId = await ctx.db.insert("fortunes", {
            userId: identity.subject,
            name: args.name,
            birthDate: args.birthDate,
            topic: args.topic,
            topicLabel: args.topicLabel,
            fortune: args.fortune,
            temperature: args.temperature,
            createdAt: Date.now(),
        });

        return fortuneId;
    },
});

// 사용자의 운세 목록 조회 (최신순)
export const getUserFortunes = query({
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();

        if (!identity) {
            return [];
        }

        const fortunes = await ctx.db
            .query("fortunes")
            .withIndex("by_user_and_created", (q) =>
                q.eq("userId", identity.subject)
            )
            .order("desc")
            .collect();

        return fortunes;
    },
});

// 특정 운세 조회
export const getFortune = query({
    args: { id: v.id("fortunes") },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();

        if (!identity) {
            throw new Error("Not authenticated");
        }

        const fortune = await ctx.db.get(args.id);

        if (!fortune || fortune.userId !== identity.subject) {
            throw new Error("Fortune not found or unauthorized");
        }

        return fortune;
    },
});
