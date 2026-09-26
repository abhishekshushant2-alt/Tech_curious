import { Resend } from 'resend';
import nodemailer from 'nodemailer';

const getResendClient = (): Resend | null => {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || apiKey.trim() === '') {
    return null;
  }
  return new Resend(apiKey.trim());
};

const getFromEmail = (senderTitle: string = 'Tech Curious'): string => {
  const customFrom = process.env.RESEND_FROM_EMAIL;
  if (customFrom && customFrom.trim() !== '') {
    return customFrom.includes('<') ? customFrom : `"${senderTitle}" <${customFrom.trim()}>`;
  }
  // Default Resend testing sender address
  return `"${senderTitle}" <onboarding@resend.dev>`;
};

const getAdminRecipientEmails = (): string[] => {
  const configured =
    process.env.CONTACT_RECEIVER_EMAIL ||
    process.env.ADMIN_EMAIL ||
    'admin@techcurious.com';
  return configured
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
};

/**
 * Dispatches a 6-digit OTP code to the administrator using Resend (or Nodemailer fallback).
 */
export const sendOtpEmail = async (email: string, otp: string): Promise<boolean> => {
  // Always log OTP to server console in dev mode for instant testing without waiting for inbox
  console.log(`\n==================================================`);
  console.log(`🔑 [TECH CURIOUS] ADMIN OTP GENERATED`);
  console.log(`✉️  Recipient: ${email}`);
  console.log(`⚡ OTP Code:  >>> ${otp} <<< (Valid for 5 minutes)`);
  console.log(`==================================================\n`);

  const resend = getResendClient();
  const gmailUser = process.env.GMAIL_USER;
  const gmailPass = process.env.GMAIL_APP_PASSWORD;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Tech Curious Admin Verification Code</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #050811; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #050811; padding: 40px 16px;">
          <tr>
            <td align="center">
              <table role="presentation" width="100%" style="max-width: 520px; background-color: #0C1220; border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 16px; overflow: hidden; box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);">
                <!-- Header Banner -->
                <tr>
                  <td style="padding: 32px 32px 20px 32px; border-bottom: 1px solid rgba(255, 255, 255, 0.06);">
                    <div style="font-size: 20px; font-weight: 800; letter-spacing: -0.5px; color: #FFFFFF; display: flex; align-items: center;">
                      <span style="display: inline-block; width: 12px; height: 12px; background: #00F2FE; border-radius: 3px; margin-right: 8px;"></span>
                      TECH CURIOUS
                    </div>
                    <div style="font-size: 11px; font-family: monospace; color: #64748B; margin-top: 4px; text-transform: uppercase; letter-spacing: 1.5px;">
                      Security Verification & Authentication
                    </div>
                  </td>
                </tr>

                <!-- Content Area -->
                <tr>
                  <td style="padding: 32px;">
                    <h2 style="color: #F8FAFC; font-size: 20px; font-weight: 700; margin: 0 0 12px 0;">CMS Portal Login</h2>
                    <p style="color: #94A3B8; font-size: 14px; line-height: 1.6; margin: 0 0 24px 0;">
                      A verification code was requested for your administrator dashboard access. Use the secure single-use code below to complete sign in:
                    </p>

                    <!-- OTP Block -->
                    <div style="background: linear-gradient(135deg, rgba(0, 242, 254, 0.08), rgba(79, 70, 229, 0.08)); border: 1px solid rgba(0, 242, 254, 0.35); border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 24px;">
                      <div style="font-size: 11px; font-family: monospace; color: #00F2FE; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 8px;">
                        One-Time Passcode
                      </div>
                      <div style="font-size: 38px; font-weight: 800; letter-spacing: 10px; color: #FFFFFF; text-shadow: 0 0 20px rgba(0, 242, 254, 0.5); font-family: 'SF Mono', Consolas, Monaco, monospace;">
                        ${otp}
                      </div>
                    </div>

                    <p style="color: #64748B; font-size: 12px; line-height: 1.5; margin: 0 0 16px 0;">
                      ⏱️ <strong>Validity:</strong> This code expires in <strong>5 minutes</strong> and can only be used once.
                    </p>
                    <p style="color: #475569; font-size: 12px; line-height: 1.5; margin: 0;">
                      🔒 <strong>Notice:</strong> If you did not request this login, your account is safe, but please ensure your email access remains secure.
                    </p>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="padding: 20px 32px; background-color: #070B14; border-top: 1px solid rgba(255, 255, 255, 0.05); text-align: center;">
                    <p style="color: #475569; font-size: 11px; margin: 0;">
                      © ${new Date().getFullYear()} Tech Curious Hardware & Robotics Engineering.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;

  // 1. Prioritize Resend API if RESEND_API_KEY is configured
  if (resend) {
    try {
      const fromEmail = getFromEmail('Tech Curious Security');
      const { data, error } = await resend.emails.send({
        from: fromEmail,
        to: email,
        subject: `Tech Curious Admin Login Code: ${otp}`,
        html: htmlContent,
      });

      if (error) {
        console.error('❌ Resend failed to deliver OTP email:', error);
        // Fallback to Gmail if configured, otherwise rely on dev mode console
        if (!gmailUser || !gmailPass) {
          return process.env.NODE_ENV !== 'production';
        }
      } else {
        console.log(`✅ [Resend] Admin OTP dispatched to ${email} (Message ID: ${data?.id})`);
        return true;
      }
    } catch (err) {
      console.error('❌ Resend API exception:', err);
      if (!gmailUser || !gmailPass) {
        return process.env.NODE_ENV !== 'production';
      }
    }
  }

  // 2. Fallback to Gmail Nodemailer if configured
  if (gmailUser && gmailPass) {
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: gmailUser,
          pass: gmailPass,
        },
      });

      await transporter.sendMail({
        from: `"Tech Curious Security" <${gmailUser}>`,
        to: email,
        subject: `Tech Curious Admin Login Code: ${otp}`,
        html: htmlContent,
      });

      console.log(`✅ [Gmail Nodemailer] Admin OTP sent to ${email}`);
      return true;
    } catch (error) {
      console.error('❌ Failed to send OTP email via Gmail:', error);
      return process.env.NODE_ENV !== 'production';
    }
  }

  // 3. Fallback: No external email provider configured; console OTP used in dev
  console.log(`ℹ️ No RESEND_API_KEY or Gmail credentials configured. Delivered OTP via server console.`);
  return true;
};

/**
 * Dispatches a Contact Us message notification to the admin via Resend and sends a confirmation receipt.
 */
export const sendContactNotification = async (
  name: string,
  email: string,
  message: string
): Promise<boolean> => {
  console.log(`\n==================================================`);
  console.log(`📬 [CONTACT INQUIRY RECEIVED]`);
  console.log(`👤 Name:    ${name}`);
  console.log(`✉️  Email:   ${email}`);
  console.log(`💬 Message: ${message}`);
  console.log(`==================================================\n`);

  const resend = getResendClient();
  const adminRecipients = getAdminRecipientEmails();
  const gmailUser = process.env.GMAIL_USER;
  const gmailPass = process.env.GMAIL_APP_PASSWORD;

  const adminNotificationHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Contact Message - Tech Curious</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #050811; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #050811; padding: 40px 16px;">
          <tr>
            <td align="center">
              <table role="presentation" width="100%" style="max-width: 580px; background-color: #0C1220; border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 16px; overflow: hidden; box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);">
                <!-- Header -->
                <tr>
                  <td style="padding: 28px 32px; border-bottom: 1px solid rgba(255, 255, 255, 0.06); background: linear-gradient(90deg, #0C1220 0%, #111A2E 100%);">
                    <div style="font-size: 18px; font-weight: 800; color: #FFFFFF;">
                      📬 New Contact Form Submission
                    </div>
                    <div style="font-size: 12px; color: #00F2FE; margin-top: 4px; font-family: monospace;">
                      Tech Curious Public Portal Inquiry
                    </div>
                  </td>
                </tr>

                <!-- Content -->
                <tr>
                  <td style="padding: 32px;">
                    <!-- Sender Details Table -->
                    <table role="presentation" width="100%" style="margin-bottom: 24px; border-collapse: collapse;">
                      <tr>
                        <td style="padding: 8px 0; color: #64748B; font-size: 12px; width: 80px; font-weight: 600; text-transform: uppercase;">From</td>
                        <td style="padding: 8px 0; color: #F8FAFC; font-size: 14px; font-weight: 600;">${name}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #64748B; font-size: 12px; font-weight: 600; text-transform: uppercase;">Email</td>
                        <td style="padding: 8px 0; color: #00F2FE; font-size: 14px;">
                          <a href="mailto:${email}" style="color: #00F2FE; text-decoration: none;">${email}</a>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #64748B; font-size: 12px; font-weight: 600; text-transform: uppercase;">Date</td>
                        <td style="padding: 8px 0; color: #94A3B8; font-size: 13px;">${new Date().toLocaleString()}</td>
                      </tr>
                    </table>

                    <!-- Message Box -->
                    <div style="font-size: 12px; font-weight: 700; color: #CBD5E1; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px;">
                      Message Content:
                    </div>
                    <div style="background-color: #111726; border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 10px; padding: 18px; color: #E2E8F0; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">
${message}
                    </div>

                    <!-- Quick Reply Hint -->
                    <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid rgba(255, 255, 255, 0.06); text-align: center;">
                      <a href="mailto:${email}?subject=Re: Tech Curious Inquiry" style="display: inline-block; background-color: #00F2FE; color: #050811; font-size: 13px; font-weight: 700; padding: 10px 24px; border-radius: 8px; text-decoration: none;">
                        Reply Directly to ${name}
                      </a>
                    </div>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="padding: 16px 32px; background-color: #070B14; border-top: 1px solid rgba(255, 255, 255, 0.05); text-align: center;">
                    <p style="color: #475569; font-size: 11px; margin: 0;">
                      Dispatched from Tech Curious Backend Service
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;

  // 1. Send using Resend
  if (resend) {
    try {
      const fromEmail = getFromEmail('Tech Curious Inquiries');
      
      // Dispatch notification to admin
      const { data, error } = await resend.emails.send({
        from: fromEmail,
        to: adminRecipients,
        replyTo: email,
        subject: `📬 [Tech Curious] Contact Inquiry from ${name}`,
        html: adminNotificationHtml,
      });

      if (error) {
        console.error('❌ Resend failed to dispatch contact notification to admin:', error);
      } else {
        console.log(`✅ [Resend] Contact notification dispatched to admin (${adminRecipients.join(', ')}) [ID: ${data?.id}]`);
      }

      // Optional: Auto-responder receipt to the user
      try {
        const userReceiptHtml = `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 500px; margin: 0 auto; background-color: #0C1220; color: #F8FAFC; padding: 32px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.08);">
            <h3 style="color: #00F2FE; margin-top: 0;">Thank you for contacting Tech Curious</h3>
            <p style="color: #94A3B8; font-size: 14px; line-height: 1.6;">
              Hi ${name},<br><br>
              We have received your message regarding robotics, IoT hardware, or collaboration. We'll review your inquiry and get back to you shortly.
            </p>
            <div style="background-color: #111726; border-left: 3px solid #00F2FE; padding: 12px 16px; margin: 20px 0; font-size: 13px; color: #CBD5E1;">
              <em>"${message.length > 120 ? message.substring(0, 120) + '...' : message}"</em>
            </div>
            <p style="color: #64748B; font-size: 12px; margin-bottom: 0;">
              Best regards,<br>
              <strong>The Tech Curious Team</strong><br>
              <a href="https://www.youtube.com/@TechCuriousYT" style="color: #00F2FE; text-decoration: none;">youtube.com/@TechCuriousYT</a>
            </p>
          </div>
        `;

        await resend.emails.send({
          from: fromEmail,
          to: email,
          subject: `Thanks for reaching out to Tech Curious!`,
          html: userReceiptHtml,
        });
        console.log(`✅ [Resend] Confirmation receipt sent to visitor (${email})`);
      } catch (receiptErr) {
        // Receipt is best-effort; don't fail main request
        console.warn('⚠️ Could not send confirmation receipt to visitor:', receiptErr);
      }

      return true;
    } catch (err) {
      console.error('❌ Resend contact notification exception:', err);
    }
  }

  // 2. Fallback to Gmail Nodemailer
  if (gmailUser && gmailPass) {
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: gmailUser,
          pass: gmailPass,
        },
      });

      await transporter.sendMail({
        from: `"Tech Curious Inquiries" <${gmailUser}>`,
        to: adminRecipients,
        replyTo: email,
        subject: `📬 [Tech Curious] Contact Inquiry from ${name}`,
        html: adminNotificationHtml,
      });

      console.log(`✅ [Gmail Nodemailer] Contact notification sent to admin`);
      return true;
    } catch (error) {
      console.error('❌ Failed to send contact notification via Gmail:', error);
    }
  }

  return true;
};
