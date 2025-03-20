export const ERROR_MESSAGES = {
    REGISTER_DETAILS_REQUIRED: "Name, Email, and Password are all required.",
    LOGIN_DETAILS_REQUIRED: "Email and Password are required.",
    EMAIL_ALREADY_IN_USE: "Email already in use.",
    INVALID_EMAIL_OR_PASSWORD: "Invalid email or password.",
    PROVIDER_ACCOUNT: (provider: string) =>
        `This email is associated with a ${provider} account. Please log in using ${provider}.`,
    DATABASE_ERROR: "Database error occurred.",
    INTERNAL_SERVER_ERROR: "Internal server error.",
    INVALID_TOKEN: "Invalid Token.",
    FAILED_VERIFICATION_EMAIL: "Failed to send email.",
};

export const SUCCESS_MESSAGES = {
    USER_REGISTERED: "User registered successfully.",
    USER_LOGGED_IN: "User successfully logged in.",
    USER_UPDATED: "User updated successfully.",
    USER_DELETED: "User deleted successfully.",
    EMAIL_VERIFIED: "Email verified successfully.",
    VERIFICATION_EMAIL_SENT: "Verification email sent successfully.",
};
