export const config = {
    api: {
        bodyParser: false,
    },
};

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    try {
        const targetUrl = 'https://ai.twoblk.workers.dev/generate';

        // Construct headers, filtering out those that node-fetch/underlying http handles automatically
        // or that cause issues (like host)
        const headers = new Headers();
        Object.entries(req.headers).forEach(([key, value]) => {
            // Filter out standard hop-by-hop headers and Host
            if (!['host', 'connection', 'content-length', 'transfer-encoding', 'content-encoding'].includes(key.toLowerCase())) {
                headers.append(key, value);
            }
        });

        // Explicitly inject the X-Platform header
        headers.set('X-Platform', 'imageeditor');

        // Fetch from external API
        // We pass req as the body stream. 'duplex: half' is required for Node.js fetch with streams.
        const response = await fetch(targetUrl, {
            method: 'POST',
            headers: headers,
            body: req,
            // @ts-ignore - duplex is needed for Node 18+ streams
            duplex: 'half'
        });

        // Handle the response
        const responseBody = await response.arrayBuffer();

        // Forward relevant response headers
        res.setHeader('Content-Type', response.headers.get('content-type') || 'application/json');
        if (response.headers.get('content-disposition')) {
            res.setHeader('Content-Disposition', response.headers.get('content-disposition'));
        }

        return res.status(response.status).send(Buffer.from(responseBody));

    } catch (error) {
        console.error('Proxy Function Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal Proxy Error',
            error: error.message
        });
    }
}
