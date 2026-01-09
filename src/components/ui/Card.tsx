import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  title?: string;
  action?: ReactNode;
}

export const Card = ({
  children,
  className = "",
  title,
  action,
}: CardProps) => {
  return (
    <div
      className={`bg-white rounded-lg shadow-sm border border-slate-200 ${className}`}
    >
      {(title || action) && (
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          {title && (
            <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
          )}
          {action && <div>{action}</div>}
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  );
};
