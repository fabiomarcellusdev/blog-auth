import dotenv from "dotenv";

dotenv.config();

export const sendVerificationEmail = async (
    email: string,
    name: string,
    token: string
): Promise<void> => {
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;

    const data = {
        service_id: process.env.EMAILJS_SERVICE_ID,
        template_id: process.env.EMAILJS_TEMPLATE_ID,
        user_id: process.env.EMAILJS_PUBLIC_KEY,
        accessToken: process.env.EMAILJS_PRIVATE_KEY,
        template_params: {
            targetEmail: email,
            targetName: name,
            verifyLink: verificationUrl,
        },
    };

    await fetch("https://api.emailjs.com/api/v1.0/email/send", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    }).then((response) => {
        if (response.status === 200) {
            console.log("Verification email sent successfully");
        } else {
            console.error("Failed to send email");
        }
    });
};
