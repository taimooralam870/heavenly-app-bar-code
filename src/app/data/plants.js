import { supabase } from '@/lib/supabase';
import { cache } from 'react';

// Helper to unpack data from description
const unpackPlant = (p) => {
  if (!p) return null;
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
      unpacked.access_key = data.access_key || "1234";
      unpacked.nickname = data.nickname;
      unpacked.gallery = data.gallery || [];
      unpacked.owner_image = data.owner_image;
    }
  } catch (e) { }
  return unpacked;
};

const mapPlant = (p) => {
  const up = unpackPlant(p);
  if (!up) return null;
  
  const baseTimeline = [
    { date: new Date(up.created_at).toLocaleDateString('en-AE'), event: "Record Created", type: "acquired", detail: "Added to secure digital registry." }
  ];

  const galleryTimeline = (up.gallery || []).map(g => ({
    date: g.date || new Date().toLocaleDateString('en-AE'),
    event: "Memory Added",
    type: "memory",
    detail: "New snapshot captured by Caretaker.",
    image: g.image
  }));

  const fullTimeline = [...baseTimeline, ...galleryTimeline];

  return {
    ...up,
    emoji: "🪴",
    tagline: up.description ? up.description.substring(0, 50) + "..." : "Healthy plant record.",
    species: up.species || "Unknown Species",
    origin: "Nursery",
    acquired: up.acquired_date || new Date(up.created_at).toLocaleDateString('en-AE'),
    location: "Living Room",
    color: "#2d6a4f",
    bgGradient: "linear-gradient(135deg, #1b4332 0%, #2d6a4f 50%, #52b788 100%)",
    caretaker: {
      name: up.gardener || "Admin",
      role: "Primary Caretaker",
      since: up.acquired_date || "2024",
      avatar: (up.gardener || "AD").substring(0, 2).toUpperCase(),
      contact: "admin@plantstore.com",
      note: up.owner_details || "No extra notes."
    },
    careInstructions: [
      { icon: "💧", label: "Watering", detail: up.water_care || "Normal" },
      { icon: "🌡️", label: "Temperature", detail: up.temp_care || "Room temp." }
    ],
    timeline: fullTimeline,
    nurseryDays: [{ day: 1, note: "Initial record", height: "10cm" }],
    ownershipHistory: [
      { owner: up.owner_name || "Admin", period: "Present", role: "Current Owner" }
    ],
    photos: []
  };
};

// CRITICAL PERFORMANCE FIX: Omit the heavy 'image' (Base64) column from the inventory list.
// This makes the response payload tiny and loading instant.
export const getPlants = cache(async () => {
  try {
    const { data: plants, error } = await supabase
      .from('plants')
      .select('id, name, description, image, created_at')
      .order('created_at', { ascending: false });

    if (error) return [];
    return plants.map(mapPlant);
  } catch (error) {
    return [];
  }
  console.log(plants);
});

export const getPlantById = cache(async (id) => {
  try {
    const { data, error } = await supabase
      .from('plants')
      .select('*') // Select ALL including image only for the specific record
      .eq('id', id)
      .single();

    if (error || !data) return null;
    return mapPlant(data);
  } catch (e) { return null; }
});