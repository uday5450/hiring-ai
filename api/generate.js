export const config = {
    api: {
        bodyParser: false, // Disabling body parser to handle raw body
    },
};

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    try {
        const targetUrl = 'https://ai.twoblk.workers.dev/generate';

        // 1. Buffer the body to calculate correct Content-Length and avoid stream issues
        const chunks = [];
        for await (const chunk of req) {
            chunks.push(chunk);
        }
        const bodyBuffer = Buffer.concat(chunks);

        // 2. Prepare headers
        const headers = new Headers();
        // Copy safe headers from original request
        Object.entries(req.headers).forEach(([key, value]) => {
            const lowerKey = key.toLowerCase();
            // Skip headers that we will manage explicitly or that are hop-by-hop
            if (!['host', 'content-length', 'connection'].includes(lowerKey)) {
                if (Array.isArray(value)) {
                    value.forEach(v => headers.append(key, v));
                } else {
                    headers.append(key, value);
                }
            }
        });

        // 3. FORCE the required custom header (Override if exists)
        headers.set('X-Platform', 'imageeditor');

        // 4. Set Content-Length explicitly
        headers.set('Content-Length', bodyBuffer.length.toString());

        // Debugging logs to verify headers in Vercel functionality
        console.log('Proxying request to:', targetUrl);
        console.log('X-Platform Header Status:', headers.get('X-Platform'));

        // 5. Make the request
        const response = await fetch(targetUrl, {
            method: 'POST',
            headers: headers,
            body: bodyBuffer
        });

        // 6. Handle Response
        const responseBody = await response.arrayBuffer();

        // Forward response headers
        res.setHeader('Content-Type', response.headers.get('content-type') || 'application/json');
        if (response.headers.get('content-disposition')) {
            res.setHeader('Content-Disposition', response.headers.get('content-disposition'));
        }

        // Return the upstream status and body
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
