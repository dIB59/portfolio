"use client";

import {
    createContext,
    forwardRef,
    useContext,
    useId,
    type ComponentPropsWithoutRef,
    type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

/**
 * Field — a compound form-row primitive in the editorial style.
 *
 *   <Field error={errors.name?.message}>
 *     <Field.Label>
 *       <Field.Index>01</Field.Index>
 *       Your name
 *     </Field.Label>
 *     <Field.Input placeholder="…" {...register("name")} />
 *     <Field.Helper>Two words or more.</Field.Helper>
 *     <Field.Error />
 *   </Field>
 *
 * Children read the field id, error state, and described-by id from context,
 * so they don't need props for wiring. Pass `id` to lock a stable id; if
 * omitted, `useId()` generates one.
 */

interface FieldContextValue {
    id: string;
    helperId: string;
    error?: string;
    hasHelper: boolean;
}

const FieldContext = createContext<FieldContextValue | null>(null);

function useFieldContext(name: string): FieldContextValue {
    const ctx = useContext(FieldContext);
    if (!ctx) {
        throw new Error(`<${name}> must be used inside <Field>.`);
    }
    return ctx;
}

interface FieldRootProps {
    id?: string;
    error?: string;
    className?: string;
    children: ReactNode;
}

function FieldRoot({ id, error, className, children }: FieldRootProps) {
    const reactId = useId();
    const fieldId = id ?? reactId;
    // We don't actually know up-front whether a Helper is present, but we
    // need a stable id either way so aria-describedby is consistent.
    const value: FieldContextValue = {
        id: fieldId,
        helperId: `${fieldId}-help`,
        error,
        hasHelper: true,
    };

    return (
        <FieldContext.Provider value={value}>
            <div className={cn("space-y-3", className)}>{children}</div>
        </FieldContext.Provider>
    );
}

interface FieldLabelProps extends Omit<ComponentPropsWithoutRef<"label">, "htmlFor"> {
    children: ReactNode;
}

function FieldLabel({ className, children, ...rest }: FieldLabelProps) {
    const { id } = useFieldContext("Field.Label");
    return (
        <label
            htmlFor={id}
            className={cn(
                "flex items-baseline gap-3 text-[11px] font-mono uppercase tracking-[0.24em] text-muted-foreground",
                className,
            )}
            {...rest}
        >
            {children}
        </label>
    );
}

interface FieldIndexProps extends ComponentPropsWithoutRef<"span"> {
    children: ReactNode;
}

function FieldIndex({ className, children, ...rest }: FieldIndexProps) {
    return (
        <span
            aria-hidden="true"
            className={cn("text-accent/80 tabular-nums", className)}
            {...rest}
        >
            {children}
        </span>
    );
}

const inputBaseClass =
    "w-full bg-transparent border-b border-border focus:border-accent focus:outline-none text-foreground placeholder:text-muted-foreground/50 transition-colors pb-3 pt-1";

const FieldInput = forwardRef<
    HTMLInputElement,
    ComponentPropsWithoutRef<"input">
>(function FieldInput({ className, ...rest }, ref) {
    const { id, error, helperId } = useFieldContext("Field.Input");
    return (
        <input
            ref={ref}
            id={id}
            aria-invalid={!!error || undefined}
            aria-describedby={helperId}
            className={cn(inputBaseClass, "text-base md:text-lg", className)}
            {...rest}
        />
    );
});

const FieldTextarea = forwardRef<
    HTMLTextAreaElement,
    ComponentPropsWithoutRef<"textarea">
>(function FieldTextarea({ className, ...rest }, ref) {
    const { id, error, helperId } = useFieldContext("Field.Textarea");
    return (
        <textarea
            ref={ref}
            id={id}
            aria-invalid={!!error || undefined}
            aria-describedby={helperId}
            className={cn(
                inputBaseClass,
                "resize-none text-base md:text-lg leading-relaxed min-h-[8rem]",
                className,
            )}
            {...rest}
        />
    );
});

interface FieldHelperProps extends ComponentPropsWithoutRef<"p"> {
    children: ReactNode;
}

function FieldHelper({ className, children, ...rest }: FieldHelperProps) {
    const { error, helperId } = useFieldContext("Field.Helper");
    // The error message claims the helper slot when present. Stay mounted
    // either way so the aria-describedby id always resolves.
    if (error) return null;
    return (
        <p
            id={helperId}
            className={cn(
                "text-[11px] font-mono uppercase tracking-[0.22em] text-muted-foreground/70",
                className,
            )}
            {...rest}
        >
            {children}
        </p>
    );
}

interface FieldErrorProps extends ComponentPropsWithoutRef<"p"> {
    /** Override the error from context. Useful if you want to show a static error. */
    children?: ReactNode;
}

function FieldError({ className, children, ...rest }: FieldErrorProps) {
    const { error, helperId } = useFieldContext("Field.Error");
    const message = children ?? error;
    if (!message) return null;
    return (
        <p
            id={helperId}
            role="alert"
            className={cn(
                "text-[11px] font-mono uppercase tracking-[0.22em] text-rose-400/90",
                className,
            )}
            {...rest}
        >
            {message}
        </p>
    );
}

export const Field = Object.assign(FieldRoot, {
    Label: FieldLabel,
    Index: FieldIndex,
    Input: FieldInput,
    Textarea: FieldTextarea,
    Helper: FieldHelper,
    Error: FieldError,
});
