import { createClient } from "./client";

export async function uploadImage(file: File): Promise<string | null> {
    try {
        const supabase = createClient();

        // Create a unique file name
        const fileExt = file.name.split(".").pop();
        const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
        const filePath = `projects/${fileName}`;

        const { data, error } = await supabase.storage
            .from("portfolio-images")
            .upload(filePath, file, {
                upsert: true,
            });

        if (error) {
            console.error("Supabase Storage Error:", error.message, error);
            return null;
        }

        const { data: { publicUrl } } = supabase.storage
            .from("portfolio-images")
            .getPublicUrl(filePath);

        return publicUrl;
    } catch (err) {
        console.error("Unexpected error during upload:", err);
        return null;
    }
}
