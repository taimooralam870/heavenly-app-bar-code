import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

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
    previous_owners: body.previous_owners
  };
  return JSON.stringify({
    text: body.description || "",
    ...extra
  });
};

export async function PUT(request, { params }) {
  try {
    const id = params.id;
    const body = await request.json();
    
    const updateData = {
      name: body.name,
      price: body.price,
      stock: body.stock,
      image: body.image || body.photoBase64,
      description: packDescription(body)
    };

    const { data: updatedPlant, error } = await supabase
      .from('plants')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    return NextResponse.json({ success: true, plant: updatedPlant });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const id = params.id;
    const { error } = await supabase.from('plants').delete().eq('id', id);
    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
