import { useState } from "react";
import { convertVideo, type ConvertOptions } from "../../../core/services/video.services.ts";

type Status = "idle" | "uploading" | "processing" | "done" | "error";

export function useConvert() {
    const [status, setStatus] = useState<Status>("idle");
    const [uploadPct, setUploadPct] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<{
        originalSize: number;
        convertedSize: number;
        filename: string;
        downloadUrl: string;
    } | null>(null);

    const convert = async (file: File, options: ConvertOptions) => {
        setIsLoading(true);
        setStatus("uploading");
        setError(null);
        setUploadPct(0);

        const form = new FormData();
        form.append("video", file);
        form.append("outputFormat", options.outputFormat);
        form.append("videoCodec", options.videoCodec);
        form.append("audioCodec", options.audioCodec);

        try {
            const { data } = await convertVideo(form, (pct) => {
                setUploadPct(pct);
                if (pct === 100) setStatus("processing");
            });

            setResult(data.data);
            setStatus("done");
        } catch {
            setError("Error al convertir el video. Intenta de nuevo.");
            setStatus("error");
        } finally {
            setIsLoading(false);
        }
    };

    const reset = () => {
        setStatus("idle");
        setUploadPct(0);
        setError(null);
        setResult(null);
    };

    return { status, isLoading, uploadPct, error, result, convert, reset };
}