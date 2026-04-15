import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Helper to pack extra data into description
const packDescription = (body) => {
  const extra = {
    acquired_date: body.acquired_date,
    gardener: body.gardener,
    species: body.species,
    temp_care: body.temp_care,
    water_care: body.water_care,
    owner_name: body.owner_name,
    owner_age: body.owner_age,
    owner_details: body.owner_details,
    previous_owners: body.previous_owners,
    owner_review: body.owner_review,
    access_key: body.access_key || "1234"
  };
  return JSON.stringify({
    text: body.description || "",
    ...extra
  });
};

// Helper to unpack data from description
const unpackPlant = (p) => {
  let unpacked = { ...p };
  try {
    const data = JSON.parse(p.description);
    if (data && typeof data === 'object' && data.text !== undefined) {
      unpacked.description = data.text;
      unpacked.acquired_date = data.acquired_date;
      unpacked.gardener = data.gardener;
      unpacked.species = data.species;
      unpacked.temp_care = data.temp_care;
      unpacked.water_care = data.water_care;
      unpacked.owner_name = data.owner_name;
      unpacked.owner_age = data.owner_age;
      unpacked.owner_details = data.owner_details;
      unpacked.previous_owners = data.previous_owners;
      unpacked.owner_review = data.owner_review;
    }
  } catch (e) {
    // Description is plain text, leave as is
  }
  return unpacked;
};

export async function GET() {
  try {
    const { data: plants, error } = await supabase
      .from('plants')
      .select('id, name, description, image, created_at')
      .order('created_at', { ascending: false });

    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });

    const mappedPlants = plants.map(p => {
      const up = unpackPlant(p);
      return {
        ...up,
        emoji: "🪴",
        tagline: up.description ? up.description.substring(0, 50) + "..." : "Healthy plant record.",
        species: up.species || "Unknown Species",
        origin: "Nursery",
        acquired: up.acquired_date || new Date(up.created_at).toLocaleDateString(),
        location: "Home",
        color: "#2d6a4f",
        bgGradient: "linear-gradient(135deg, #1b4332 0%, #2d6a4f 50%, #52b788 100%)",
        caretaker: {
          name: up.gardener || "Admin",
          role: "Primary Caretaker",
          avatar: (up.gardener || "AD").substring(0, 2).toUpperCase()
        },
        careInstructions: [
          { icon: "💧", label: "Watering", detail: up.water_care || "Normal" },
          { icon: "🌡️", label: "Temp", detail: up.temp_care || "Room Temp" }
        ],
        timeline: [{ date: up.created_at, event: "Profile Created", type: "acquired", detail: "Registered." }],
        nurseryDays: [{ day: 1, note: "Day 1", height: "10cm" }],
        ownershipHistory: [{ owner: up.owner_name || "Admin", period: "Present", role: "Current Owner" }],
        photos: [] 
      };
    });

    return NextResponse.json(mappedPlants);
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    
    // We ONLY use the 7 columns that definitely exist
    const newPlant = {
      name: body.name || 'New Plant',
      price: body.price || 0,
      stock: body.stock || 0,
      image: body.image || '',
      description: packDescription(body) // Pack EVERYTHING extra here
    };

    const { data: insertedData, error } = await supabase
      .from('plants')
      .insert([newPlant])
      .select()
      .single();

    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    
    return NextResponse.json({ success: true, plant: insertedData });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
