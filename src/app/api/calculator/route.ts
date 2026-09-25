import { type NextRequest, NextResponse } from "next/server";

import { computeConsumption } from "@/components/calculator/computeConsumption";
import type { UserProductConsumption } from "@/components/calculator/types";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = (await request.json()) as { products?: unknown };

    if (!Array.isArray(body.products) || body.products.length === 0) {
      return NextResponse.json(
        { error: "products must be a non-empty array" },
        { status: 400 },
      );
    }

    const result = computeConsumption(
      body.products as UserProductConsumption[],
    );

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: `Internal error: ${(error as Error).message}` },
      { status: 500 },
    );
  }
}
