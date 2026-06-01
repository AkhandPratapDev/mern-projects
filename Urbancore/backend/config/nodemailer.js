import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // your Gmail
    pass: process.env.EMAIL_PASS, // app password
  },
});

export const sendVerificationEmail = async (email, otp) => {
  const mailOptions = {
    from: `"Urbancore" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Verify Your Email - Urbancore",
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; background-color: #f8f9fb; padding: 0; margin: 0;">
        <div style="max-width: 600px; margin: 30px auto; background: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
          
          <!-- Header -->
          <div style="background-color: #111111; padding: 20px 30px;">
            <h2 style="margin: 0; color: #ffffff; font-size: 22px; letter-spacing: 1px; text-align:center;">Urbancore</h2>
          </div>
          
          <!-- Body -->
          <div style="padding: 30px;">
            <h3 style="color: #333333; margin-bottom: 10px;">Email Verification</h3>
            <p style="color: #555555; font-size: 15px; line-height: 1.6;">
              Thank you for choosing Urbancore. Please use the verification code below to complete your signup process:
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <span style="background-color: #111111; color: #ffffff; font-size: 28px; letter-spacing: 4px; padding: 12px 30px; border-radius: 6px; display: inline-block;">
                ${otp}
              </span>
            </div>
            
            <p style="color: #777777; font-size: 14px; margin-top: 10px;">
              This code will expire in <strong>10 minutes</strong>. If you didn’t request this, please ignore this email.
            </p>
          </div>

          <!-- Footer -->
          <div style="background-color: #f2f2f2; padding: 15px 30px; text-align: center; font-size: 13px; color: #999999;">
            &copy; ${new Date().getFullYear()} Urbancore. All rights reserved.
          </div>

        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};
