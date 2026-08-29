"use client";

type Props = {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit";
};

export function Cta({ children, onClick, disabled, type = "button" }: Props) {
  return (
    <button type={type} onClick={onClick} disabled={disabled} className="cta">
      {children}
    </button>
  );
}

export function CtaDock({ children }: { children: React.ReactNode }) {
  return <div className="cta-dock">{children}</div>;
}
