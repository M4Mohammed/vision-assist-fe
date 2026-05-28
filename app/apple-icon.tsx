import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#000000",
          color: "#ffffff",
        }}
      >
        <svg
          width="112"
          height="112"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M14.31 8L20.05 17.94" />
          <path d="M9.69 8h11.48" />
          <path d="M7.38 12L13.12 2.06" />
          <path d="M9.69 16L3.95 6.06" />
          <path d="M14.31 16H2.83" />
          <path d="M16.62 12L10.88 21.94" />
        </svg>
      </div>
    ),
    size,
  );
}
