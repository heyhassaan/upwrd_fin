const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { endpoint } = await req.json();

    const allowedPrefixes = ['market-watch', 'timeseries/int/', 'timeseries/eod/'];
    const isAllowed = allowedPrefixes.some((prefix) => endpoint?.startsWith(prefix));

    if (!endpoint || !isAllowed) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid endpoint' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const url = `https://dps.psx.com.pk/${endpoint}`;
    console.log('Fetching PSX data from:', url);

    // Try fetching with XMLHttpRequest-like headers to get JSON response
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json, text/html, */*',
        'Accept-Language': 'en-US,en;q=0.5',
        'X-Requested-With': 'XMLHttpRequest',
        'Referer': 'https://dps.psx.com.pk/',
      },
    });

    if (!response.ok) {
      console.error('PSX API returned status:', response.status);
      return new Response(
        JSON.stringify({ success: false, error: `PSX returned ${response.status}` }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const text = await response.text();
    let data;

    // Try parsing as JSON first
    try {
      data = JSON.parse(text);
    } catch {
      // If not JSON, parse the HTML
      data = parseMarketWatch(text);
    }

    return new Response(
      JSON.stringify({ success: true, data }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error fetching PSX data:', error);
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function parseMarketWatch(html: string): any[] {
  const stocks: any[] = [];
  
  // Find the data table - PSX uses a specific table structure
  // Look for rows with data-symbol attributes or standard table rows
  const rowRegex = /<tr[^>]*?(?:data-symbol="([^"]*)")?[^>]*>([\s\S]*?)<\/tr>/gi;
  const cellRegex = /<td[^>]*?>([\s\S]*?)<\/td>/gi;
  const stripHtml = (s: string) => s.replace(/<[^>]*>/g, '').trim();

  let match;
  while ((match = rowRegex.exec(html)) !== null) {
    const dataSymbol = match[1];
    const rowHtml = match[2];
    const cells: string[] = [];
    let cellMatch;

    cellRegex.lastIndex = 0;
    while ((cellMatch = cellRegex.exec(rowHtml)) !== null) {
      cells.push(stripHtml(cellMatch[1]));
    }

    // Need at least enough cells for meaningful data
    if (cells.length < 6) continue;

    // Try to find the symbol
    const symbol = dataSymbol || cells[0];
    if (!symbol || symbol.length > 10 || /^(SYMBOL|SECTOR|S#)/i.test(symbol)) continue;

    const parseNum = (s: string) => {
      if (!s) return 0;
      const n = parseFloat(s.replace(/,/g, ''));
      return isNaN(n) ? 0 : n;
    };

    // PSX market-watch columns can vary, try to identify based on number of cells
    // Typical: Symbol, Sector, LDCP, Open, High, Low, Current, Change, Change%, Volume, Value
    if (cells.length >= 10) {
      stocks.push({
        symbol: cells[0],
        sector: cells[1],
        ldcp: parseNum(cells[2]),
        open: parseNum(cells[3]),
        high: parseNum(cells[4]),
        low: parseNum(cells[5]),
        current: parseNum(cells[6]),
        change: parseNum(cells[7]),
        changePercent: parseNum(cells[8]),
        volume: parseNum(cells[9]),
      });
    } else if (cells.length >= 6) {
      // Minimal data
      stocks.push({
        symbol,
        sector: cells.length > 7 ? cells[1] : '',
        ldcp: parseNum(cells[cells.length - 5] || '0'),
        open: parseNum(cells[cells.length - 5] || '0'),
        high: parseNum(cells[cells.length - 4] || '0'),
        low: parseNum(cells[cells.length - 3] || '0'),
        current: parseNum(cells[cells.length - 2] || '0'),
        change: parseNum(cells[cells.length - 1] || '0'),
        changePercent: 0,
        volume: 0,
      });
    }
  }

  return stocks;
}
