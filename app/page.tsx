"use client";

import Router from "next/router";
import { useCallback, useEffect, useState } from "react";
import { usePlaidLink } from "react-plaid-link";

export default function PlaidLink() {
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

    const onSuccess = useCallback(async (publicToken: string) => {
        await fetch("/api/exchange-public-token", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ publicToken }),
        });
        Router.push("/dash");
    }, []);

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
