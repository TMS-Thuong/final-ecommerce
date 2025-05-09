export type EmailSentResultType = {
  success: boolean;
  message: string;
};

export type EmailVerificationToken = {
  token: string;
  expiresAt: Date;
};
