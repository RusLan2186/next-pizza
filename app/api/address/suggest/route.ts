import { NextRequest, NextResponse } from "next/server";

type NominatimItem = {
  place_id: number;
  display_name: string;
  address?: {
    city?: string;
    town?: string;
    village?: string;
    municipality?: string;
    hamlet?: string;
    county?: string;
    state?: string;
    region?: string;
    province?: string;
    road?: string;
    pedestrian?: string;
    footway?: string;
    street?: string;
    house_number?: string;
  };
};

type Suggestion = {
  id: string;
  label: string;
};

const formatSuggestionLabel = (item: NominatimItem) => {
  const city =
    item.address?.city ??
    item.address?.town ??
    item.address?.village ??
    item.address?.municipality ??
    item.address?.hamlet ??
    item.address?.county;

  const region =
    item.address?.state ?? item.address?.region ?? item.address?.province;

  const street =
    item.address?.road ??
    item.address?.street ??
    item.address?.pedestrian ??
    item.address?.footway;

  const houseNumber = item.address?.house_number;
  const streetWithHouse = [street, houseNumber].filter(Boolean).join(" ");

  const compactLabel = [city, region, streetWithHouse]
    .filter(Boolean)
    .join(", ");

  if (compactLabel) {
    return compactLabel;
  }

  return item.display_name.split(",").slice(0, 3).join(",").trim();
};

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("query")?.trim() ?? "";
  const scope = request.nextUrl.searchParams.get("scope") ?? "ua";

  if (query.length < 3) {
    return NextResponse.json([] as Suggestion[]);
  }

  const params = new URLSearchParams({
    q: query,
    format: "jsonv2",
    addressdetails: "1",
    limit: "8",
    "accept-language": "uk,en",
  });

  if (scope === "ua") {
    params.set("countrycodes", "ua");
  }

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?${params.toString()}`,
      {
        headers: {
          "User-Agent": "next-pizza-checkout/1.0",
        },
        next: {
          revalidate: 0,
        },
      },
    );

    if (!response.ok) {
      return NextResponse.json([] as Suggestion[], { status: 200 });
    }

    const data = (await response.json()) as NominatimItem[];

    const suggestions: Suggestion[] = data.map((item) => ({
      id: String(item.place_id),
      label: formatSuggestionLabel(item),
    }));

    return NextResponse.json(suggestions);
  } catch {
    return NextResponse.json([] as Suggestion[], { status: 200 });
  }
}
