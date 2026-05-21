import { axiosClient } from "../api/axiosConfig";
import type { AxiosProgressEvent } from "axios";

export interface CompressOptions {
  crf: number;
  preset: string;
  codec: string;
  audioBitrate: string;
  width?: number;
  height?: number;
  framerate?: number;
}

export interface ConvertOptions {
  outputFormat: "mp4" | "webm" | "mov" | "avi" | "mkv" | "gif";
  videoCodec: "h264" | "h265" | "vp9" | "av1" | "copy";
  audioCodec: "aac" | "mp3" | "opus" | "copy" | "none";
}

const withProgress = (onUploadProgress?: (pct: number) => void) => ({
  onUploadProgress: (e: AxiosProgressEvent) => {
    if (onUploadProgress && e.total) {
      onUploadProgress(Math.round((e.loaded / e.total) * 100));
    }
  },
});

export const compressVideo = (form: FormData, onUploadProgress?: (pct: number) => void) =>
  axiosClient.post(`/videos/compress`, form, withProgress(onUploadProgress));

export const convertVideo = (form: FormData, onUploadProgress?: (pct: number) => void) =>
  axiosClient.post(`/videos/convert`, form, withProgress(onUploadProgress));

export const downloadVideo = (filename: string) =>
  axiosClient.get(`/videos/download/${filename}`, { responseType: "blob" });