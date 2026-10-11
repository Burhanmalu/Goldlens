import { NextRequest, NextResponse } from 'next/server';

interface AnalystRequestPayload {
  prompt?: string;
  context?: {
    pair?: string;
    benchmarkPrice?: number;
    gapPct?: number;
    costBandPct?: number;
    verdict?: string;
    contracts?: Array<{
      symbol: string;
      pricePerGram: number;
      expiry: string;
      purity: number;
      liquidityTier: string;
    }>;
  };
}

export async function POST(req: NextRequest) {
  try {
    const body: AnalystRequestPayload = await req.json();
    const { prompt, context } = body;

    const geminiKey = process.env.GEMINI_API_KEY?.trim();
    const openRouterKey = process.env.OPENROUTER_API_KEY?.trim();

    if (!geminiKey && !openRouterKey) {
      return NextResponse.json(
        {
          error: 'No API Key configured. Please add GEMINI_API_KEY or OPENROUTER_API_KEY to your .env.local file.',
          isConfigured: false,
        },
        { status: 400 }
      );
    }

    const systemPrompt = `You are the GoldLens Institutional Quant Analyst, a disciplined decision-support AI for MCX Indian Gold Derivative Analytics.
Your role is to explain cross-contract normalization, purity adjustments, carrying costs, and friction bounds clearly and honestly.
IMPORTANT RULES:
1. Do NOT give speculative financial advice or promise guaranteed returns.
2. Ground all answers in mathematical market realities:
   - GOLDM (995 fine, quoted per 10g)
   - GOLDTEN (999 fine, quoted per 10g)
   - GOLDGUINEA (999 fine, quoted per 8g)
   - GOLDPETAL (999 fine, quoted per 1g)
   - Benchmark Fine Gold: ~₹15,067/g
3. Stress transaction costs: CTT (Commodities Transaction Tax: 0.01% on sell side), MCX exchange fees, SEBI turnover, stamp duty, flat brokerage friction on small lots, and slippage haircuts.
4. "No edge survives costs" is an explicitly valid and praiseworthy finding when residual spread is below the cost band.
5. Provide concise, bulleted, quantitative breakdowns.`;

    const userMessage = `Current Market Context:
- Benchmark Fine Gold: ₹${context?.benchmarkPrice || 15067}/g
- Focused Pair: ${context?.pair || 'GOLDM / GOLDTEN'}
- Observed Residual Gap: ${context?.gapPct || 0.05}%
- Hurdle Cost Band: ${context?.costBandPct || 0.09}%
- Current Strategy Verdict: ${context?.verdict || 'NO_EDGE'}

User Query:
${prompt || 'Provide a quantitative audit of this spread. Why does or does not this gap survive friction?'}`;

    // 1. Try Gemini API first if configured
    if (geminiKey) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [
                {
                  role: 'user',
                  parts: [{ text: `${systemPrompt}\n\n${userMessage}` }],
                },
              ],
              generationConfig: {
                temperature: 0.2,
                maxOutputTokens: 800,
              },
            }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) {
            return NextResponse.json({
              analysis: text,
              provider: 'Gemini (gemini-1.5-flash)',
              timestamp: new Date().toISOString(),
            });
          }
        }
      } catch (err) {
        console.error('Gemini request failed, checking OpenRouter fallback:', err);
      }
    }

    // 2. Fallback to OpenRouter if configured
    if (openRouterKey) {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openRouterKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://goldlens.quant',
          'X-Title': 'GoldLens Derivatives Quant',
        },
        body: JSON.stringify({
          model: 'meta-llama/llama-3.3-70b-instruct',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userMessage },
          ],
          temperature: 0.2,
          max_tokens: 800,
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        return NextResponse.json(
          { error: `OpenRouter API error: ${response.status}`, details: errText },
          { status: response.status }
        );
      }

      const data = await response.json();
      const text = data?.choices?.[0]?.message?.content;
      return NextResponse.json({
        analysis: text,
        provider: 'OpenRouter (Llama 3.3 70B)',
        timestamp: new Date().toISOString(),
      });
    }

    return NextResponse.json(
      { error: 'AI provider request failed. Please check the validity of your API key.' },
      { status: 500 }
    );
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error while generating analysis.' },
      { status: 500 }
    );
  }
}
