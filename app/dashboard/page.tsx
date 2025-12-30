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

    const access_token = session.accessToken;

    if (!access_token) {
        redirect("/");
    }

    const response = await plaidClient.accountsBalanceGet({ access_token });

    console.log(response.data);

    return <h1>Dashboard</h1>;
}
