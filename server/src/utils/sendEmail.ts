import nodemailer from 'nodemailer';

export const sendOtpEmail = async (email: string, otp: string): Promise<boolean> => {
  const gmailUser = process.env.GMAIL_USER;
  const gmailPass = process.env.GMAIL_APP_PASSWORD;

  // Always log OTP to server console in dev mode for seamless testing
  console.log(`\n==================================================`);
  console.log(`🔑 [TECH CURIOUS] ADMIN OTP GENERATED`);
  console.log(`✉️  Recipient: ${email}`);
  console.log(`⚡ OTP Code:  >>> ${otp} <<< (Valid for 5 minutes)`);
  console.log(`==================================================\n`);

  if (!gmailUser || !gmailPass) {
    console.log(`ℹ️ Gmail credentials not configured in .env. Using console OTP delivery mode.`);
    return true;
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: gmailUser,
        pass: gmailPass,
      },
    });

    const htmlContent = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 500px; margin: 0 auto; background-color: #0A0E17; color: #F8FAFC; padding: 32px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1);">
        <h2 style="color: #00F2FE; margin-top: 0; font-size: 24px;">Tech Curious Admin Login</h2>
        <p style="color: #94A3B8; font-size: 15px; line-height: 1.6;">A login request was made for your Tech Curious administrative dashboard. Enter this verification code to proceed:</p>
        <div style="background-color: #111726; border: 1px solid rgba(0, 242, 254, 0.3); padding: 18px; border-radius: 8px; text-align: center; margin: 24px 0;">
          <span style="font-size: 32px; font-weight: 800; letter-spacing: 6px; color: #00F2FE;">${otp}</span>
        </div>
        <p style="color: #64748B; font-size: 13px;">This code expires in 5 minutes. If you did not request this code, you can safely ignore this email.</p>
      </div>
    `;

    await transporter.sendMail({
      from: `"Tech Curious Security" <${gmailUser}>`,
      to: email,
      subject: `Tech Curious Admin Login Code: ${otp}`,
      html: htmlContent,
    });

    return true;
  } catch (error) {
    console.error('Failed to send OTP email via Gmail:', error);
    // Return true in development so admin can still log in using the console OTP
    return process.env.NODE_ENV !== 'production';
  }
};

export const sendContactNotification = async (name: string, email: string, message: string): Promise<boolean> => {
  console.log(`\n📬 [CONTACT MESSAGE RECEIVED]`);
  console.log(`From: ${name} <${email}>`);
  console.log(`Message: ${message}\n`);
  return true;
};
