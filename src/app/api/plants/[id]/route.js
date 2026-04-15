import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Helper to unpack data from description
const unpackDescription = (description) => {
  try {
    const data = JSON.parse(description);
    if (data && typeof data === 'object' && data.text !== undefined) {
      return data;
    }
  } catch (e) {}
  return { text: description };
};

// Helper to pack extra data into description
const packDescription = (body, existingDesc = "") => {
  const existing = unpackDescription(existingDesc);
  
  const extra = {
    acquired_date: body.acquired_date || existing.acquired_date,
    gardener: body.gardener || existing.gardener,
    species: body.species || existing.species,
    temp_care: body.temp_care || existing.temp_care,
    water_care: body.water_care || existing.water_care,
    owner_name: body.owner_name || existing.owner_name,
    owner_age: body.owner_age || existing.owner_age,
    owner_details: body.owner_details || existing.owner_details,
    previous_owners: body.previous_owners || existing.previous_owners,
    owner_review: body.owner_review || existing.owner_review,
    access_key: body.access_key || existing.access_key,
    nickname: body.nickname || existing.nickname,
    gallery: body.gallery || existing.gallery || [],
    owner_image: body.owner_image || existing.owner_image
  };

  return JSON.stringify({
    text: body.description !== undefined ? body.description : existing.text,
    ...extra
  });
};

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    // Fetch existing plant to merge data
    const { data: existingPlant } = await supabase
      .from('plants')
      .select('*')
      .eq('id', id)
      .single();

    let updateData = {};

    if (body.action === 'transfer') {
      const unpacked = unpackDescription(existingPlant.description);
      const history = unpacked.previous_owners ? `${unpacked.previous_owners}\nTransferred to ${body.newOwner}` : `Previously owned by ${unpacked.owner_name}. Transferred to ${body.newOwner}`;
      
      updateData.description = JSON.stringify({
        ...unpacked,
        owner_name: body.newOwner,
        previous_owners: history
      });
    } else if (body.action === 'updateCaretaker') {
      const unpacked = unpackDescription(existingPlant.description);
      updateData.description = JSON.stringify({ 
        ...unpacked, 
        owner_name: body.owner_name || unpacked.owner_name,
        owner_image: body.owner_image || unpacked.owner_image
      });
    } else if (body.action === 'addMemory') {
      const unpacked = unpackDescription(existingPlant.description);
      const gallery = unpacked.gallery || [];
      gallery.push({ image: body.photoBase64, date: new Date().toLocaleDateString('en-AE') });
      updateData.description = JSON.stringify({ ...unpacked, gallery });
    } else if (body.action === 'rename') {
      const unpacked = unpackDescription(existingPlant.description);
      updateData.description = JSON.stringify({ ...unpacked, nickname: body.nickname });
    } else if (body.action === 'addPhoto') {
      updateData.image = body.photoBase64;
    } else {
      updateData = {
        name: body.name,
        price: body.price,
        stock: body.stock,
        image: body.image || body.photoBase64,
        description: packDescription(body, existingPlant?.description)
      };
    }

    const { data: updatedPlant, error } = await supabase
      .from('plants')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    
    // Clear Next.js cache so the page immediately reflects changes on reload
    try {
      const { revalidatePath } = require('next/cache');
      revalidatePath(`/plant/${id}`);
      revalidatePath(`/`);
    } catch(e) {}

    return NextResponse.json({ success: true, plant: updatedPlant });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const { error } = await supabase.from('plants').delete().eq('id', id);
    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
