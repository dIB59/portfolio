"use server";

import { Resend } from "resend";
import { z } from "zod";

const resend = new Resend(process.env.RESEND_API_KEY);

const contactFormSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters." }),
    email: z.string().email({ message: "Please enter a valid email address." }),
    message: z.string().min(10, { message: "Message must be at least 10 characters." }),
});

export type ContactFormState = {
    success: boolean;
    message: string;
    errors?: {
        name?: string[];
        email?: string[];
        message?: string[];
    };
};

export async function sendEmail(prevState: ContactFormState, formData: FormData): Promise<ContactFormState> {
    const validatedFields = contactFormSchema.safeParse({
        name: formData.get("name"),
        email: formData.get("email"),
        message: formData.get("message"),
    });

    if (!validatedFields.success) {
        return {
            success: false,
            message: "Please fix the errors below.",
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    const { name, email, message } = validatedFields.data;

    try {
        const data = await resend.emails.send({
            from: "Portfolio Contact <onboarding@resend.dev>",
            to: ["ibrahimiqbal101@outlook.com"],
            subject: `New Contact Form Submission from ${name}`,
            replyTo: email,
            text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
        });

        if (data.error) {
            return {
                success: false,
                message: "Failed to send email. Please try again later.",
            };
        }

        return {
            success: true,
            message: "Message sent successfully! I'll get back to you soon.",
        };
    } catch (error) {
        return {
            success: false,
            message: "Something went wrong. Please try again later.",
        };
    }
}
