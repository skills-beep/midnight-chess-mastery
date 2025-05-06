
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (progress < 100) {
        setProgress(prev => Math.min(prev + 5, 100));
      } else {
        setTimeout(() => {
          onComplete();
        }, 500);
      }
    }, 50);

    return () => clearTimeout(timer);
  }, [progress, onComplete]);

  return (
    <div className="fixed inset-0 bg-background flex flex-col items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-5xl font-bold flex items-center gap-2">
          <span className="text-6xl">♟️</span> 
          Chess Master
        </h1>
        <p className="text-xl text-center text-muted-foreground mt-2">Your ultimate chess experience</p>
      </motion.div>
      
      <motion.div 
        className="w-64 h-2 bg-muted rounded-full overflow-hidden"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <motion.div 
          className={cn(
            "h-full bg-primary rounded-full",
            progress === 100 ? "bg-green-500" : ""
          )}
          style={{ width: `${progress}%` }}
        />
      </motion.div>
      
      <motion.p 
        className="mt-4 text-muted-foreground"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        {progress < 100 ? 'Loading game assets...' : 'Ready to play!'}
      </motion.p>

      <motion.div 
        className="absolute bottom-8 left-0 w-full text-center text-sm text-muted-foreground"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        transition={{ delay: 0.6 }}
      >
        Designed and Developed by Bishal Sharma
      </motion.div>
    </div>
  );
}
