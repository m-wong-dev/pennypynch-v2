import { CountryCode, Products } from "plaid";
import { plaidClient } from "../../../lib/plaid";

export async function POST() {
    const tokenResponse = await plaidClient.linkTokenCreate({
        user: { client_user_id: process.env.PLAID_CLIENT_ID ?? "" },
        client_name: "Plaid's Tiny Quickstart",
        language: "en",
        products: [Products.Auth],
        country_codes: [CountryCode.Us],
        redirect_uri: process.env.PLAID_SANDBOX_REDIRECT_URI,
    });

    return Response.json(tokenResponse.data);
}
