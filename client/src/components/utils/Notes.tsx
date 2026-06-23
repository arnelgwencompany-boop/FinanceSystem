import type { ReactNode } from "react";
import {
  Info,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  StickyNote,
  Lightbulb,
} from "lucide-react";

type NoteVariant = "info" | "success" | "warning" | "danger" | "note" | "tip";

interface NoteProps {
  variant?: NoteVariant;
  title?: string;
  children: ReactNode;
}

const variants: Record<
  NoteVariant,
  {
    containerStyle: React.CSSProperties;
    iconColor: string;
    titleColor: string;
    bodyColor: string;
    icon: React.ComponentType<{ size: number; color: string }>;
    defaultTitle: string;
  }
> = {
  info: {
    containerStyle: {
      backgroundColor: "#eff6ff",
      border: "0.5px solid #93c5fd",
    },
    iconColor: "#2563eb",
    titleColor: "#1d4ed8",
    bodyColor: "#1e40af",
    icon: Info,
    defaultTitle: "Information",
  },
  success: {
    containerStyle: {
      backgroundColor: "#f0fdf4",
      border: "0.5px solid #86efac",
    },
    iconColor: "#16a34a",
    titleColor: "#15803d",
    bodyColor: "#166534",
    icon: CheckCircle2,
    defaultTitle: "Success",
  },
  warning: {
    containerStyle: {
      backgroundColor: "#fffbeb",
      border: "0.5px solid #fcd34d",
    },
    iconColor: "#d97706",
    titleColor: "#b45309",
    bodyColor: "#92400e",
    icon: AlertTriangle,
    defaultTitle: "Warning",
  },
  danger: {
    containerStyle: {
      backgroundColor: "#fef2f2",
      border: "0.5px solid #fca5a5",
    },
    iconColor: "#dc2626",
    titleColor: "#b91c1c",
    bodyColor: "#991b1b",
    icon: XCircle,
    defaultTitle: "Error",
  },
  note: {
    containerStyle: {
      backgroundColor: "#e8f0fb",
      border: "0.5px solid #b5cef0",
      borderLeft: "3px solid #0a1f3c",
      borderRadius: "12px",
    },
    iconColor: "#0a1f3c",
    titleColor: "#0a1f3c",
    bodyColor: "#1e3a5f",
    icon: StickyNote,
    defaultTitle: "Note",
  },
  tip: {
    containerStyle: {
      backgroundColor: "#f8fafc",
      border: "0.5px solid #e2e8f0",
    },
    iconColor: "#64748b",
    titleColor: "#334155",
    bodyColor: "#475569",
    icon: Lightbulb,
    defaultTitle: "Tip",
  },
};

export default function Note({
  variant = "info",
  title,
  children,
}: NoteProps) {
  const v = variants[variant];
  const Icon = v.icon;

  return (
    <div
      style={{
        display: "flex",
        gap: "12px",
        alignItems: "flex-start",
        padding: "14px 16px",
        borderRadius: "12px",
        ...v.containerStyle,
      }}
    >
      {/* Icon */}
      <div style={{ flexShrink: 0, marginTop: "1px" }}>
        <Icon size={18} color={v.iconColor} />
      </div>

      {/* Content */}
      <div>
        <p
          style={{
            margin: "0 0 3px",
            fontSize: "13px",
            fontWeight: 600,
            color: v.titleColor,
          }}
        >
          {title ?? v.defaultTitle}
        </p>
        <div
          style={{
            margin: 0,
            fontSize: "13px",
            color: v.bodyColor,
            lineHeight: 1.55,
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}