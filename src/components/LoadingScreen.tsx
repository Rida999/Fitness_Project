import { Dumbbell } from "lucide-react";

type LoadingScreenProps = {
  message?: string;
  fullScreen?: boolean;
};

const LoadingScreen = ({
  message = "Loading data...",
  fullScreen = true,
}: LoadingScreenProps) => (
  <div
    className={`flex items-center justify-center bg-background px-6 ${
      fullScreen ? "min-h-screen" : "min-h-[320px]"
    }`}
  >
    <div className="text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary text-white shadow-[0_18px_45px_rgba(0,0,0,0.22)]">
        <Dumbbell className="h-8 w-8 animate-pulse" />
      </div>
      <div className="mt-6 h-1.5 w-48 overflow-hidden rounded-full bg-muted">
        <div className="h-full w-1/2 animate-[loading-slide_1.1s_ease-in-out_infinite] rounded-full bg-primary" />
      </div>
      <p className="mt-4 text-sm font-bold uppercase tracking-wide text-foreground">
        {message}
      </p>
    </div>
  </div>
);

export default LoadingScreen;
