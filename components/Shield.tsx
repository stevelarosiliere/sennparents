export default function Shield({
  className,
  outer = "#2E7D32",
  inner = "#FFFFFF",
  letter = "#2E7D32",
}: {
  className?: string;
  outer?: string;
  inner?: string;
  letter?: string;
}) {
  return (
    <svg viewBox="0 0 120 120" aria-hidden="true" className={className}>
      <path
        fill={outer}
        d="M60,6 L110,24 L110,66 C110,94 88,114 60,122 C32,114 10,94 10,66 L10,24 Z"
      />
      <path
        fill={inner}
        d="M60,18 L100,33 L100,64 C100,86 82,102 60,109 C38,102 20,86 20,64 L20,33 Z"
      />
      <text
        x="60"
        y="84"
        textAnchor="middle"
        fontFamily="Figtree, Arial, sans-serif"
        fontWeight="900"
        fontSize="58"
        fill={letter}
      >
        S
      </text>
    </svg>
  );
}
