import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Get the request body
    const body = await request.json();
    
    // Forward the request to the n8n webhook
    const response = await fetch('https://n8n-20r4.onrender.com/webhook/997cd213-78e8-4bf4-80f7-6071ffe87087', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    // If the webhook request failed
    if (!response.ok) {
      return NextResponse.json(
        { error: `Webhook request failed with status ${response.status}` },
        { status: response.status }
      );
    }

    // Get the response from the webhook
    const data = await response.json();
    
    // Return the response
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error forwarding webhook:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 