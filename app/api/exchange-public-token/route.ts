import { getIronSession } from "iron-session";
import { NextApiRequest, NextApiResponse } from "next";
import { plaidClient, sessionOptions } from "../../../lib/plaid";
import { Session } from "../../../lib/types/session";

interface ExchangePublicTokenRequestBody {
    publicToken: string;
}

interface TypedNextApiRequest<T> extends NextApiRequest {
    body: T;
}

export default async function POST(
    req: TypedNextApiRequest<ExchangePublicTokenRequestBody>,
    res: NextApiResponse
) {
    const session = await getIronSession<Session>(req, res, sessionOptions);

    const exchangeResponse = await plaidClient.itemPublicTokenExchange({
        public_token: req.body.publicToken,
    });

    session.accessToken = exchangeResponse.data.access_token;
    await session.save();
    res.send({ ok: true });
}
