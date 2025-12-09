import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export default function SignUpSuccessPage() {
    return (
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-background">
            <div className="w-full max-w-sm">
                <Card className="border-border/50 shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-2xl">
                            Check your email
                        </CardTitle>
                        <CardDescription>
                            We sent you a confirmation link
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">
                            Please check your email and click the confirmation
                            link to activate your admin account.
                        </p>
                        <Link
                            href="/auth/login"
                            className="text-sm underline underline-offset-4 hover:text-foreground"
                        >
                            Back to login
                        </Link>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
