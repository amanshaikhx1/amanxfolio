import { cn } from "@/lib/utils";

interface SectionTitleProps {
  subtitle: string;
  title: string;
  center?: boolean;
  className?: string;
}

const SectionTitle = ({ subtitle, title, center = true, className }: SectionTitleProps) => {
  return (
    <div className={cn("mb-16", center && "text-center", className)}>
      {/* Subtitle (Top) */}
      <p
        className={cn(
          "text-sm md:text-base font-semibold text-green-500 mb-2 tracking-widest uppercase",
          center && "mx-auto"
        )}
      >
        {subtitle}
      </p>

      {/* Title (Below) */}
      <h2
        className={cn(
          "text-3xl md:text-4xl font-bold text-gray-900 dark:text-white inline-block relative pb-2",
          center && "mx-auto"
        )}
      >
        {title}
        <span
          className={cn(
            "absolute bottom-0 left-0 h-1 bg-gradient-to-r from-green-500 to-green-400 rounded",
            center ? "left-1/2 -translate-x-1/2 w-20" : "w-16"
          )}
        ></span>
      </h2>
    </div>
  );
};

export default SectionTitle;
