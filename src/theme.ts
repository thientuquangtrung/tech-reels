// Khổ TikTok 9:16. Mọi toạ độ trong layout đều tính trên khung này.
export const W = 1080;
export const H = 1920;
export const FPS = 30;

export const PAPER = "#fdfcf8";
export const INK = "#1e1e1e";
export const INK_SOFT = "#5c5c5c";
export const HIGHLIGHTER = "#f7e48b";

export const TONES = {
  neutral: { fill: "#f1f1ef", stroke: "#4a4a4a" },
  primary: { fill: "#bfdcf7", stroke: "#3a78c2" },
  accent: { fill: "#fbe8d0", stroke: "#d9772b" },
  danger: { fill: "#f8d6d6", stroke: "#cc4b4b" },
  success: { fill: "#d4f0d8", stroke: "#3c9a52" },
} as const;
export type ToneName = keyof typeof TONES;

export const BADGE = { fill: "#7d64ff", text: "#ffffff" };

export const FONT_HAND = "'Patrick Hand', cursive";
export const FONT_MONO = "'JetBrains Mono', monospace";

/**
 * Vùng an toàn: giao diện TikTok che cột phải (nút like/comment) và đáy (caption, tên kênh).
 * Nội dung chính nằm trong khung này.
 */
export const SAFE = { left: 60, right: 960, top: 120, bottom: 1480 };

/** Ước lượng chiều rộng chữ (px) để thu nhỏ font cho vừa hộp. Code đếm, không đoán. */
export function fitFont(text: string, maxWidth: number, base: number, mono = false): number {
  const ratio = mono ? 0.6 : 0.47;
  return Math.min(base, maxWidth / Math.max(1, text.length * ratio));
}
