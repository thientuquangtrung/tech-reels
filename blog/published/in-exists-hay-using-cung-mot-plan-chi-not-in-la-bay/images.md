# Image manifest: in-exists-hay-using-cung-mot-plan-chi-not-in-la-bay
#
# type:   ILLUSTRATION | DIAGRAM | SCREENSHOT
# status: TODO | GENERATED | APPROVED | INLINE | NEEDS_CAPTURE
# alt là bắt buộc với mọi ảnh.


- id: img-01
  type: ILLUSTRATION
  status: APPROVED
  file: img-01-cover.png        # nguồn: img-01-cover.svg (vẽ tay bằng SVG, không dùng AI image)
  section: "§1 Mở bài"
  purpose: "Ảnh bìa — ba đường (IN/EXISTS/USING) đổ về cùng một cây plan; đường thứ tư (NOT IN) rơi khỏi mép vách đá"
  prompt: >
    Flat minimal technical illustration. Dark background (#1a1a2e).
    Single accent color: muted cyan-blue (#4ea8de). Geometric, generous negative space.
    Three separate flowing lines enter from the left and merge into one single branching tree structure on the right;
    a fourth faint line breaks off and fades into empty space.
    No text, no letters, no numbers anywhere in the image. No people, no faces.
    No 3D render, no gradients-heavy corporate style, no stock-photo look. 16:9.
  alt: "Minh hoạ trừu tượng: ba đường hợp lại thành một cây plan, một đường chấm thứ tư chạy tới mép vách đá rồi rơi xuống"
  alt_en: "Abstract illustration: three lines merge into a single plan tree, while a fourth dotted line runs off the edge of a cliff"
  caption: ""

- id: img-02
  type: DIAGRAM
  status: INLINE
  section: "§4 NOT IN: một dòng NULL là xoá sạch… không gì cả"
  purpose: "Cho thấy vì sao một NULL trong danh sách làm NOT IN không bao giờ TRUE"
  source: mermaid
  png: img-02.png          # blog.js diagrams
  png_en: img-02.en.png
  alt: "Sơ đồ đánh giá 5 NOT IN (1, 2, NULL): hai phép so ra TRUE, một phép ra NULL, AND lại thành NULL nên dòng bị bỏ qua"
  alt_en: "How 5 NOT IN (1, 2, NULL) is evaluated: two comparisons are TRUE, one is NULL, AND-ing them gives NULL, so the row is skipped"
