import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { plaidClient, sessionOptions } from "../../../lib/plaid";
import { Session } from "../../../lib/types/session";

interface ExchangePublicTokenRequestBody {
    publicToken: string;
}

export async function POST(req: NextRequest) {
    const session = await getIronSession<Session>(
        await cookies(),
        sessionOptions
    );

    const body: ExchangePublicTokenRequestBody = await req.json();

    const exchangeResponse = await plaidClient.itemPublicTokenExchange({
        public_token: body.publicToken,
    });

    session.accessToken = exchangeResponse.data.access_token;
    await session.save();
    return Response.json({ status: "success" }, { status: 200 });
}
