"use client";

import { useActionState, startTransition } from "react";
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
        <section
            className="py-24 md:py-32 px-6 md:px-12 lg:px-20 relative z-10 border-t border-border/60"
            id="contact"
        >
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16">
                <div className="md:col-span-5 space-y-6">
                    <p className="text-xs font-mono uppercase tracking-[0.2em] text-muted-foreground">
                        <span className="inline-block w-6 h-px bg-primary align-middle mr-2" />
                        03 / Contact
                    </p>
                    <h2
                        className="font-display italic text-foreground leading-[0.95] tracking-[-0.02em]"
                        style={{ fontSize: "clamp(2.5rem, 7vw, 5.5rem)" }}
                    >
                        Get in
                        <br />
                        touch.
                    </h2>
                    <p className="text-muted-foreground text-base md:text-lg max-w-md leading-relaxed">
                        Have a project in mind, or just want to say hi?
                        I read every message and reply within a day or two.
                    </p>
                </div>

                <div className="md:col-span-7">
                    <form
                        ref={formRef}
                        action={formAction}
                        className="space-y-6"
                        onSubmit={(evt) => {
                            evt.preventDefault();
                            form.handleSubmit(() => {
                                startTransition(() => {
                                    formAction(new FormData(formRef.current!));
                                });
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
                                    <p className="text-sm text-destructive" role="alert">
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
                                    <p className="text-sm text-destructive" role="alert">
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
                                aria-describedby="message-help"
                            />
                            <p id="message-help" className="text-xs text-muted-foreground">
                                A few sentences is plenty.
                            </p>
                            {form.formState.errors.message && (
                                <p className="text-sm text-destructive" role="alert">
                                    {form.formState.errors.message.message}
                                </p>
                            )}
                        </div>

                        <Button
                            type="submit"
                            size="lg"
                            className="w-full md:w-auto md:min-w-[220px] rounded-full"
                            disabled={isPending}
                        >
                            {isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Sending…
                                </>
                            ) : (
                                <>
                                    <Send className="mr-2 h-4 w-4" />
                                    Send message
                                </>
                            )}
                        </Button>
                    </form>
                </div>
            </div>
        </section>
    );
}
