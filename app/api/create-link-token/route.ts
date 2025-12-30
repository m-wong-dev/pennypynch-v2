import { CountryCode, Products } from "plaid";
import { plaidClient } from "../../../lib/plaid";

export async function POST() {
    const userResponse = await plaidClient.userCreate({
        client_id: process.env.PLAID_CLIENT_ID ?? "",
        secret: process.env.PLAID_SECRET ?? "",
        client_user_id: process.env.PLAID_CLIENT_ID ?? "",
    });

    if (userResponse.status !== 200) {
        return Response.json({ error: "Failed to create user" });
    }

    const tokenResponse = await plaidClient.linkTokenCreate({
        user: { client_user_id: process.env.PLAID_CLIENT_ID ?? "" },
        client_name: "Plaid's Tiny Quickstart",
        language: "en",
        products: [Products.Auth],
        country_codes: [CountryCode.Us],
        redirect_uri: process.env.PLAID_SANDBOX_REDIRECT_URI,
        enable_multi_item_link: true,
        user_id: userResponse.data.user_id,
    });

    return Response.json(tokenResponse.data);
}
