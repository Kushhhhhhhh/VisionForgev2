import { useEffect, useState } from "react";

type JobStatus = "pending" | "processing" | "completed" | "failed" | null;

interface PollResult {
  status: JobStatus;
  imageUrl: string | null;
  error: string | null;
  isLoading: boolean;
}

export function useJobPoller(jobId: string | null): PollResult {
  const [status, setStatus]       = useState<JobStatus>(null);
  const [imageUrl, setImageUrl]   = useState<string | null>(null);
  const [error, setError]         = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!jobId) {
      setStatus(null);
      setImageUrl(null);
      setError(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    let stopped = false;
    let intervalId: ReturnType<typeof setInterval>;

    const poll = async () => {
      if (stopped) return;
      try {
        const res  = await fetch(`/api/image/status?jobId=${jobId}`);
        const data = await res.json();
        if (stopped) return;

        setStatus(data.status);

        if (data.status === "completed") {
          setImageUrl(data.imageUrl);
          setIsLoading(false);
          stopped = true;
          clearInterval(intervalId);
        } else if (data.status === "failed") {
          setError(data.error ?? "Generation failed");
          setIsLoading(false);
          stopped = true;
          clearInterval(intervalId);
        }
      } catch {
        // network blip — retry on next tick
      }
    };

    poll();
    intervalId = setInterval(poll, 3000);

    return () => {
      stopped = true;
      clearInterval(intervalId);
    };
  }, [jobId]);

  return { status, imageUrl, error, isLoading };
}