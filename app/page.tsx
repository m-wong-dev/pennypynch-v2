"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { usePlaidLink } from "react-plaid-link";

export default function PlaidLink() {
    const router = useRouter();
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const createLinkToken = async () => {
            const response = await fetch("/api/create-link-token", {
                method: "POST",
            });
            const data = await response.json();
            setToken(data.link_token);
        };

        createLinkToken();
    }, []);

    const onSuccess = async (publicToken: string) => {
        await fetch("/api/exchange-public-token", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ publicToken }),
        });
        router.push("/dashboard");
    };

    const { open, ready } = usePlaidLink({
        token: token!,
        onSuccess,
    });

    return (
        <button onClick={() => open()} disabled={!ready}>
            <strong>Link account</strong>
        </button>
    );
}
