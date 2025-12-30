import { plaidClient, sessionOptions } from "@/lib/plaid";
import { Session } from "@/lib/types/session";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Dashboard() {
    const session = await getIronSession<Session>(
        await cookies(),
        sessionOptions
    );

    const access_tokens = session.accessTokens;

    if (!access_tokens || access_tokens.length === 0) {
        redirect("/");
    }

    Promise.all(
        access_tokens.map(async (access_token) => {
            const response = await plaidClient.accountsGet({
                access_token,
            });
            console.log(response.data);
        })
    );

    return <h1>Dashboard</h1>;
}
