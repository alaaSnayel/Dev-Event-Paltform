"use server";

import connectDB from "../mongodb";
import Event from "@/app/database/event.model";

export const gitSimilarEventsBySlug = async (slug: string) => {
  try {
    await connectDB();

    const event = await Event.findOne({ slug });
    if (!event) return [];

    const similarEvents = await Event.find({
      _id: { $ne: event._id },
      tags: { $in: event.tags },
    })
      .limit(4)
      .lean();

    return similarEvents;
  } catch (error) {
    console.error("getSimilarEventsBySlug error:", error);
    return [];
  }
};

// "use server";

// import connectDB from "../mongodb";
// import Event from "@/app/database/event.model";

// export const gitSimilarEventsBySlug = async (slug: string) => {
//   try {
//     await connectDB();

//     const event = await Event.findOne({ slug });
//     return await Event.find({
//       _id: { $ne: event._id },
//       tag: { $in: event.tsgs },
//     }).lean();
//   } catch {
//     return [];
//   }
// };
