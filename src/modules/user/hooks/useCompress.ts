import { useState } from "react";
import { compressVideo, downloadVideo, type CompressOptions } from "../../../core/services/video.services.ts";
import { buildVideoForm } from "../../../core/utils/buildVideoForm.ts";
import { useCompressStore } from "../store/useCompressStore.ts";


type Status = "idle" | "uploading" | "processing" | "done" | "error";

export function useCompress() {
  const { result, setResult, clearResult } = useCompressStore();
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [uploadPct, setUploadPct] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const compress = async (file: File, options: CompressOptions) => {
    setIsLoading(true);
    setStatus("uploading");
    setError(null);
    setUploadPct(0);

    const form = buildVideoForm(file, options);

    try {
      const { data } = await compressVideo(form, (pct) => {
        setUploadPct(pct);
        if (pct === 100) setStatus("processing");
      });
      setResult(data.data);
      setStatus("done");
    } catch {
      setError("Error al comprimir el video. Intenta de nuevo.");
      setStatus("error");
    } finally {
      setIsLoading(false);
    }
  };
  const download = async (filename: string) => {
    const { data } = await downloadVideo(filename);
    const url = URL.createObjectURL(data);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const reset = () => {
    clearResult();
    setFile(null);
    setStatus("idle");
    setUploadPct(0);
    setError(null);
  };

  return { file, setFile, status, isLoading, uploadPct, error, result, compress, download, reset };
}