"use client";

import { useActionState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { sendEmail } from "@/app/actions/send-email";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useEffect, useRef } from "react";
import { Loader2, Send } from "lucide-react";

const contactFormSchema = z.object({
    name: z.string().min(2, "Name is required"),
    email: z.string().email("Invalid email address"),
    message: z.string().min(10, "Message is too short"),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

export function ContactForm() {
    const [state, formAction, isPending] = useActionState(sendEmail, {
        success: false,
        message: "",
    });

    const form = useForm<ContactFormData>({
        resolver: zodResolver(contactFormSchema),
        defaultValues: {
            name: "",
            email: "",
            message: "",
        },
    });

    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        if (state.message) {
            if (state.success) {
                toast.success(state.message);
                form.reset();
            } else {
                toast.error(state.message);
            }
        }
    }, [state, form]);

    return (
        <section className="py-24 relative z-10" id="contact">
            <div className="container px-4 md:px-6 mx-auto max-w-3xl">
                <div className="text-center mb-12 space-y-4">
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tighter">
                        Get in Touch
                    </h2>
                    <p className="text-muted-foreground text-lg max-w-[600px] mx-auto">
                        Have a project in mind or just want to say hi? I'd love to hear from you.
                    </p>
                </div>

                <div className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-sm">
                    <form
                        ref={formRef}
                        action={formAction}
                        className="space-y-6"
                        onSubmit={(evt) => {
                            evt.preventDefault();
                            form.handleSubmit(() => {
                                formAction(new FormData(formRef.current!));
                            })(evt);
                        }}
                    >
                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <label
                                    htmlFor="name"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    Name
                                </label>
                                <Input
                                    id="name"
                                    placeholder="John Doe"
                                    {...form.register("name")}
                                    aria-invalid={!!form.formState.errors.name}
                                />
                                {form.formState.errors.name && (
                                    <p className="text-sm text-destructive">
                                        {form.formState.errors.name.message}
                                    </p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <label
                                    htmlFor="email"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    Email
                                </label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="john@example.com"
                                    {...form.register("email")}
                                    aria-invalid={!!form.formState.errors.email}
                                />
                                {form.formState.errors.email && (
                                    <p className="text-sm text-destructive">
                                        {form.formState.errors.email.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label
                                htmlFor="message"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                Message
                            </label>
                            <Textarea
                                id="message"
                                placeholder="Tell me about your project..."
                                className="min-h-[150px] resize-none"
                                {...form.register("message")}
                                aria-invalid={!!form.formState.errors.message}
                            />
                            {form.formState.errors.message && (
                                <p className="text-sm text-destructive">
                                    {form.formState.errors.message.message}
                                </p>
                            )}
                        </div>

                        <Button
                            type="submit"
                            className="w-full md:w-auto md:min-w-[200px]"
                            disabled={isPending}
                        >
                            {isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Sending...
                                </>
                            ) : (
                                <>
                                    <Send className="mr-2 h-4 w-4" />
                                    Send Message
                                </>
                            )}
                        </Button>
                    </form>
                </div>
            </div>
        </section>
    );
}
