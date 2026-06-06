import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { verifyEmail } from "../services/auth.service";

function VerifyEmail() {
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const token =
            searchParams.get("token");

        const verify = async () => {
            try {
                await verifyEmail(token);

                alert("Email Verified");
            } catch (error) {
                alert("Verification Failed");
            }
        };

        if (token) {
            verify();
        }
    }, []);

    return (
        <>
        <h1> Email Verified </h1>
        <a href="/login">Login</a>
        </>
    );
}

export default VerifyEmail;