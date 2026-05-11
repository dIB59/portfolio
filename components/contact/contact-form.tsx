"use client";

import { useActionState, startTransition, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { sendEmail } from "@/app/actions/send-email";
import { toast } from "sonner";
import { ArrowUpRight, Loader2 } from "lucide-react";
import { Field } from "@/components/ui/field";

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
        defaultValues: { name: "", email: "", message: "" },
    });

    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        if (!state.message) return;
        if (state.success) {
            toast.success(state.message);
            form.reset();
        } else {
            toast.error(state.message);
        }
    }, [state, form]);

    const errors = form.formState.errors;

    return (
        <section
            id="contact"
            className="py-28 md:py-44 px-6 md:px-12 lg:px-20 relative z-10 border-t border-border/60"
        >
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16">
                <div className="md:col-span-5 space-y-7">
                    <p className="text-[11px] font-mono uppercase tracking-[0.28em] text-muted-foreground">
                        <span className="inline-block w-6 h-px bg-accent align-middle mr-2" />
                        Epilogue
                    </p>
                    <h2
                        className="font-display text-foreground leading-[0.95] tracking-[-0.025em] text-balance"
                        style={{ fontSize: "clamp(2.5rem, 7vw, 5.5rem)" }}
                    >
                        Want to be in the
                        <br />
                        next chapter?
                    </h2>
                    <p className="text-foreground/75 text-base md:text-lg max-w-md leading-relaxed text-pretty">
                        I read every message and reply within a day or two.
                        Pitches, questions, or a project you want a second pair
                        of hands on — all welcome.
                    </p>
                </div>

                <div className="md:col-span-7">
                    <form
                        ref={formRef}
                        action={formAction}
                        className="space-y-10 md:space-y-12"
                        onSubmit={(evt) => {
                            evt.preventDefault();
                            form.handleSubmit(() => {
                                startTransition(() => {
                                    formAction(new FormData(formRef.current!));
                                });
                            })(evt);
                        }}
                    >
                        <div className="grid gap-10 md:gap-12 md:grid-cols-2">
                            <Field id="name" error={errors.name?.message}>
                                <Field.Label>
                                    <Field.Index>01</Field.Index>
                                    Your name
                                </Field.Label>
                                <Field.Input
                                    placeholder="Ada Lovelace"
                                    autoComplete="name"
                                    {...form.register("name")}
                                />
                                <Field.Error />
                            </Field>

                            <Field id="email" error={errors.email?.message}>
                                <Field.Label>
                                    <Field.Index>02</Field.Index>
                                    Your email
                                </Field.Label>
                                <Field.Input
                                    type="email"
                                    placeholder="ada@example.com"
                                    autoComplete="email"
                                    {...form.register("email")}
                                />
                                <Field.Error />
                            </Field>
                        </div>

                        <Field id="message" error={errors.message?.message}>
                            <Field.Label>
                                <Field.Index>03</Field.Index>
                                What&rsquo;s on your mind
                            </Field.Label>
                            <Field.Textarea
                                placeholder="A few sentences is plenty…"
                                rows={5}
                                {...form.register("message")}
                            />
                            <Field.Helper>
                                The more specific, the better the reply.
                            </Field.Helper>
                            <Field.Error />
                        </Field>

                        <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-6 pt-2">
                            <p className="text-[11px] font-mono uppercase tracking-[0.28em] text-muted-foreground">
                                <span className="inline-block w-6 h-px bg-accent align-middle mr-2" />
                                — Ibrahim
                            </p>

                            <button
                                type="submit"
                                disabled={isPending}
                                className="group inline-flex items-center justify-center gap-2 px-7 py-3.5 border border-foreground/30 hover:border-accent rounded-full text-foreground hover:text-accent transition-colors disabled:opacity-60 disabled:cursor-not-allowed font-mono text-xs uppercase tracking-[0.24em]"
                            >
                                {isPending ? (
                                    <>
                                        <Loader2
                                            className="w-3.5 h-3.5 animate-spin"
                                            aria-hidden="true"
                                        />
                                        Sending
                                    </>
                                ) : (
                                    <>
                                        Send message
                                        <ArrowUpRight
                                            className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                                            aria-hidden="true"
                                        />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
}
