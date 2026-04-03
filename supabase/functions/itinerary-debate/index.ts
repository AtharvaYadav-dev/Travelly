// @ts-nocheck
// supabase/functions/itinerary-debate/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { destination, budget, type } = await req.json()

    // 🏛️ SOVEREIGN NEGOTIATION PROTOCOL (v2)
    // Architect Agent: Focuses on "Cinematic Quality"
    // Budget Agent: Focuses on "JSON Constraint Check"
    
    let currentProposal = {
      location: destination,
      activities: [`Arrival in ${destination}`, "Signature Dinner"],
      estimated_cost: budget * 0.4
    };

    const negotiationRounds = [];

    // Round 1: Architect Proposes
    negotiationRounds.push({ 
      agent: 'Architect', 
      reasoning: "Hum cinematic vibes create kar rahe hain, boss. First proposal ready!",
      proposal: { ...currentProposal, style: 'Cinematic' }
    });

    // Round 2: Budget Agent Counters
    const budgetOverage = (currentProposal.estimated_cost * 1.5) > budget;
    if (budgetOverage) {
      negotiationRounds.push({ 
        agent: 'Budget', 
        reasoning: "Bhai, Architect ka plan mehenga hai, jeb dheeli ho jayegi. Cutting costs now.",
        adjustment: "Swapping 5-star dinner for authentic street food tour.",
        new_cost: currentProposal.estimated_cost * 0.8
      });
      currentProposal.estimated_cost *= 0.8;
    } else {
      negotiationRounds.push({
        agent: 'Budget',
        reasoning: "Paisa toh boss ke paas hai. Plan approved as is.",
        status: "APPROVED"
      });
    }

    // Round 3: Supervisor Finalizes JSON deal
    const finalDeal = {
      status: "SOVEREIGN_RESOLVED",
      final_vibe: type + " (Balanced)",
      deal_token: btoa(JSON.stringify(currentProposal)),
      instructions: "Generate the itinerary using the negotiated constants."
    };

    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      async start(controller) {
        for (const round of negotiationRounds) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'negotiation', ...round })}\n\n`));
          await new Promise(r => setTimeout(r, 1200)); 
        }

        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'deal', ...finalDeal })}\n\n`));
        controller.close();
      }
    })

    return new Response(stream, {
      headers: { ...corsHeaders, 'Content-Type': 'text/event-stream' },
    })
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
