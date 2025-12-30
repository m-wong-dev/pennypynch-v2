import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { plaidClient, sessionOptions } from "../../../lib/plaid";
import { Session } from "../../../lib/types/session";

interface ExchangePublicTokenRequestBody {
    linkToken: string;
}

export async function POST(req: NextRequest) {
    const session = await getIronSession<Session>(
        await cookies(),
        sessionOptions
    );

    const body: ExchangePublicTokenRequestBody = await req.json();

    const tokenResponse = await plaidClient.linkTokenGet({
        link_token: body.linkToken,
    });

    if (tokenResponse.status !== 200) {
        return Response.json({ error: "Failed to get link token info" });
    }

    const linkSession = tokenResponse.data.link_sessions?.[0];

    if (!linkSession || !linkSession.results?.item_add_results) {
        return Response.json({ error: "No link session results found" });
    }

    const publicTokens = linkSession.results?.item_add_results.map(
        (item) => item.public_token
    );

    console.log("Public tokens:", publicTokens);

    if (!publicTokens || publicTokens.length === 0) {
        return Response.json({ error: "No public tokens found" });
    }

    const accessTokens: string[] = [];

    await Promise.all(
        publicTokens.map(async (publicToken) => {
            const exchangeResponse = await plaidClient.itemPublicTokenExchange({
                public_token: publicToken,
            });

            console.log("Exchange response:", exchangeResponse.data);
            accessTokens.push(exchangeResponse.data.access_token);
        })
    );

    session.accessTokens = accessTokens;

    await session.save();
    return Response.json({ status: "success" }, { status: 200 });
}
