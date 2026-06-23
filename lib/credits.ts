import { supabaseAdmin } from "./supabase"
import { auth } from "./auth"

export async function checkAndDeductCredits(cost: number = 1) {
  const session = await auth();
  
  if (!session?.user?.id) {
    throw new Error("Authentication required");
  }

  const userId = session.user.id;

  // 1. Get current credits
  const { data: user, error: fetchError } = await supabaseAdmin
    .from('users')
    .select('credits')
    .eq('id', userId)
    .single();

  if (fetchError || !user) {
    throw new Error("User profile not found");
  }

  if (user.credits < cost) {
    throw new Error("Insufficient credits");
  }

  // 2. Deduct credits
  const { error: updateError } = await supabaseAdmin
    .from('users')
    .update({ credits: user.credits - cost })
    .eq('id', userId);

  if (updateError) {
    throw new Error("Failed to deduct credits");
  }

  return { success: true, remaining: user.credits - cost };
}

export async function getUserCredits() {
    const session = await auth();
    if (!session?.user?.id) return 0;

    const { data: user } = await supabaseAdmin
        .from('users')
        .select('credits')
        .eq('id', session.user.id)
        .single();
    
    return user?.credits || 0;
}
