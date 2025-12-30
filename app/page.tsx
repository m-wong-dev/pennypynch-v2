"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
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

    const onSuccess = React.useCallback(async () => {
        await fetch("/api/exchange-public-token", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ linkToken: token }),
        });
        router.push("/dashboard");
    }, [token, router]);

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
