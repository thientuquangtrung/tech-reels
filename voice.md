# Giọng văn — blog và video

> **File này là file quan trọng nhất trong hệ thống, và là file duy nhất không skill
> nào viết hộ được.** Phần "Đoạn mẫu" bên dưới cần chính tác giả viết tay. Không có
> nó, mọi skill sẽ kéo nội dung về giọng trung tính vô hồn kiểu tài liệu kỹ thuật dịch máy.
>
> Điền được khoảng 60% là đã dùng tốt. Bổ sung dần sau mỗi bài, mỗi video.

| Mục | Blog (viết) | Video (nói) |
|---|---|---|
| 1. Người đọc · 2. Xưng hô và tông giọng · 3. Câu chữ · 5. Anti-patterns · 6. Đoạn mẫu | ✓ | ✓ |
| 4. Cấu trúc bài · 7. Style ảnh · 8. Quy ước riêng | ✓ | |
| 9. Văn nói cho video | | ✓ |

Số mục cố định — skill trỏ tới "mục N", đừng đánh số lại. Thêm mục mới thì nối vào cuối.

---

## 1. Người đọc mục tiêu

Dev Việt Nam 1–5 năm kinh nghiệm, đang hoặc sắp đưa AI agent vào quy trình làm việc
thật của team. Họ đã đọc quá nhiều bài demo to-do app và muốn thấy thứ chạy trong
môi trường có ràng buộc thật.

**Giả định được phép có:** biết Git, biết CI/CD là gì, dùng qua ChatGPT/Claude.
**Không được giả định:** đã biết MCP, đã biết agent orchestration, đã đọc bài trước.

## 2. Xưng hô và tông giọng

**Tông:** hóm hỉnh, thân thiện, đời thường, kể chuyện. Như một ông anh đi làm trước vài năm
ngồi trà đá kể lại chuyện mình vừa dính — có quan điểm rõ, hay tự trào, không lên lớp.
Tham khảo tông (không chép câu chữ): các bài "Series C# hay ho" trên blog Tôi đi code dạo.

- Xưng **"mình"**, gọi người đọc là **"bạn"** (nói với cả nhóm thì "các bạn").
- Kể chuyện đã xảy ra, không giảng bài. Không "chúng ta cùng tìm hiểu".
- **Có quan điểm.** Dám nói thẳng "đừng làm thế này", kèm lý do. Quan điểm cá nhân thì nói rõ là
  quan điểm cá nhân, một lần là đủ.
- **Đùa để dẫn đường, không đùa để lấp chỗ.** Mỗi câu đùa phải đưa người đọc tới gần ý kỹ thuật hơn.
  Đọc lướt bỏ hết câu đùa mà vẫn hiểu bài thì mới đúng liều.

Những kiểu đùa hợp giọng này:

| Kiểu | Ví dụ (tự đặt, chỉ để hiểu kiểu) |
|---|---|
| Nhân hoá công nghệ, kể đời nó như đời người | "Bé `useEffect` vốn hiền, chỉ phải cái tính hay chạy lại" |
| Kể chuyện cổ tích cho phần lịch sử | "Ngày xửa ngày xưa, khi chưa ai biết tới React Query…" |
| Lạc đề có chủ đích rồi tự kéo về | "…à nhầm, đang nói chuyện cache cơ" — **tối đa một lần mỗi bài** |
| Tự trào chuyện mình từng ngu | "Hồi mới đi làm mình từng retry ngay lập tức, 3 lần, trong một vòng for" |
| Thành ngữ, từ Hán Việt dùng vui | "lên voi xuống chó", "thương hải tang điền" cho một framework |
| Đặt kỳ vọng rồi bẻ lái | Liệt kê điểm yếu xong mới nói "nhưng đó chưa phải lý do thật" |
| Emoticon kiểu `=))` | Cuối câu tự trào, **tối đa 2 cái mỗi bài**, không bao giờ trong tiêu đề |

Ranh giới: vui nhưng không tục — không chửi thề, kể cả viết tắt hay che bằng dấu `*`. Không đùa về
bệnh tật, giới tính, vùng miền, ngoại hình. Không chê người hỏi; chê công nghệ, chê cách làm thì được.

## 3. Nguyên tắc câu chữ

- Câu ngắn. Trung bình dưới 25 chữ. Câu dài chỉ dùng khi cố ý tạo nhịp.
- Chủ động thay bị động: "tôi tách agent này ra" chứ không "agent này đã được tách ra".
- Đoạn tối đa 5 câu. Đoạn 8 câu là dấu hiệu chưa nghĩ xong.
- Thuật ngữ tiếng Anh giữ nguyên, **không dịch cứng**: giữ `deduplication`, `guardrail`,
  `prompt`, `agent`, `test case`. Đừng viết "khử trùng lặp", "lan can bảo vệ".
- Số liệu phải cụ thể. "Nhanh hơn đáng kể" là câu vô nghĩa. Có số thật thì khoe số thật để người
  đọc khỏi bảo là chém gió; chưa có thì dùng số minh hoạ theo `CLAUDE.md` mục 2.
- Văn nói đưa vào văn viết được: "thôi thì", "khổ nỗi", "đấy, chẳng phải… là gì". Đừng lạm dụng
  đến mức mỗi đoạn một câu cảm thán.

## 4. Cấu trúc bài quen thuộc

1. Mở bài: một tình huống đời thường đã xảy ra (mình dính bug, thấy người hỏi trong group…) —
   không định nghĩa, không "trong thời đại AI bùng nổ". Nói luôn bài này sẽ cho người đọc cái gì.
2. Bối cảnh kể như một câu chuyện: công nghệ/hệ thống ra đời thế nào, vì sao người ta dùng nó.
3. Cách làm đầu tiên và vì sao nó hỏng — chỗ hợp nhất để tự trào.
4. Bẻ lái: lý do thật / cách làm hiện tại, kèm đánh đổi. Đây là phần nghiêm túc nhất, ít đùa nhất.
5. Kết: lời dặn thân thiện, cụ thể — người đọc nên làm khác đi điều gì. Được phép kết bằng một
   câu đùa ngắn sau lời dặn.

## 5. Anti-patterns — thấy là sửa

Danh sách này dùng trực tiếp làm rule cho `blog-review` Phase 2.

- Mở bài kiểu "Trong thời đại công nghệ 4.0 / AI đang bùng nổ / Như chúng ta đã biết".
- "Không chỉ ... mà còn ...", "đóng vai trò quan trọng", "mang lại nhiều lợi ích".
- "Hãy cùng tìm hiểu", "Hy vọng bài viết hữu ích", "Cảm ơn các bạn đã đọc".
- Liệt kê 3 gạch đầu dòng cân đối một cách đáng ngờ, mỗi gạch một câu dài bằng nhau.
- Câu chuyển đoạn rỗng: "Tiếp theo, chúng ta sẽ đi vào phần...".
- Emoji trong tiêu đề mục.
- Khẳng định không có bằng chứng: "cách này tốt hơn hẳn" mà không nói tốt hơn ở đâu.
- Kết bài bằng lời khuyên chung chung không ai phản đối được.
- Đùa gượng: câu đùa phải giải thích mới hiểu, meme đã cũ, hoặc đùa liên tục khiến ý kỹ thuật bị chìm.
- Đùa ở phần kỹ thuật cốt lõi (đoạn giải thích cơ chế, đoạn code) — chỗ đó cần rõ, không cần vui.
- Tục tĩu, chửi thề (kể cả viết tắt / che `*`), đùa về bệnh tật, giới tính, vùng miền, ngoại hình.
- Giọng trung tính kiểu tài liệu: cả bài không có câu nào nghe ra là một người cụ thể đang kể.

## 6. Đoạn mẫu — TÁC GIẢ TỰ VIẾT

> Dán vào đây 2–3 đoạn do chính bạn viết, không qua AI. Lấy từ tin nhắn Slack giải
> thích một quyết định kỹ thuật, hoặc mô tả PR, hoặc ghi chú cá nhân cũng được. Càng
> thô càng tốt — mục đích là bắt được nhịp và cách bạn xuống dòng, không phải bản đẹp.

> Mẫu A–C: Claude soạn từ chuyện có thật (phiên gộp repo 2026-11-21, video 002), tác giả duyệt 2026-11-22.
> Bổ sung hoặc thay bằng đoạn tự viết khi có.

### Mẫu A — giải thích một quyết định kỹ thuật

```
Blog một repo, video một repo, sống ly thân được mấy tháng thì mình quyết định cho
về chung một nhà. Khổ nỗi nhà thì một mà có hai cách xếp phòng.

Cách một: mỗi chủ đề một phòng, bài viết với video ở chung. Nghe rất gia đình.
Cách hai: chia theo kênh, blog/ một bên, video/ một bên, chung nhau cái bảng ý tưởng ở phòng khách.

Mình chọn cách hai. Lý do chẳng lãng mạn gì: script render đã quen ở videos/NNN-slug,
CLI blog quen ở drafts/ với published/. Bắt chúng nó dọn nhà là viết lại cả hai bộ tool.

Cái giá: ý nào làm cả bài lẫn video thì nằm ở hai chỗ. Thôi thì nối bằng một dòng
"Đã thành" trong inbox. Bao giờ ý nào cũng làm cả hai thì tính chuyện xây lại nhà sau.
```

### Mẫu B — kể lại một lần debug

```
Chạy scripts/dc, nó báo Docker không chạy. Mình nhìn lên menu bar: Rancher vẫn đang
xanh lè, sống khoẻ re.

Thôi được, chỉ đường cho nó tới socket bằng tay. Chạy lại. Lần này nó đổi giọng:
npm báo EPERM trong ~/.npm. Một lệnh, hai lỗi, chẳng dính dáng gì nhau. Lúc này mình
bắt đầu nghi thủ phạm không phải Docker.

Đúng thật. Lệnh của mình mở đầu bằng `cd … &&`, thế là không khớp ngoại lệ sandbox nữa.
Cả lệnh bị nhốt trong sandbox: không đọc được ~/.docker, không ghi được ~/.npm.
Bỏ cái cd đi, gọi scripts/dc đứng một mình. Chạy phát ăn ngay =))

Bài học: một lệnh mà đẻ ra hai lỗi khác nhau thì đi tìm cái chung, đừng sửa từng lỗi.
```

### Mẫu C — đoạn mở bài bạn thấy ưng

```
Mình tick đúng một cái checkbox. Một thôi. Thế mà cả trang render lại, kể cả thanh
phân trang nằm tít dưới đáy — thứ chẳng liên quan gì tới checkbox, chẳng ai mời nó.

Thủ phạm hoá ra chỉ là một dòng useStore() quên truyền selector. Bài này kể chuyện
một dòng code nghe lén cả cái store, và cách bắt nó chỉ nghe đúng thứ nó cần.
```

### Mẫu D — một đoạn văn nói (cho video)

Chép từ bản thu `video/public/voice/001-one-user/` (đúng chữ trong manifest).
Lúc thu bạn có nói khác chữ nào, thêm "à", "thì", ngắt nghỉ ở đâu thì sửa lại cho khớp.
Lưu ý: đoạn này thu trước khi đổi sang tông hóm hỉnh nên còn khá nghiêm. Sau khi thu một video
theo tông mới, thay mẫu này bằng thoại của video đó.

```
Bạn chạy load test 1000 virtual user. Nhưng một virtual user thực ra là cái gì?
Nó phải giống một người thật: có tài khoản riêng và token đăng nhập riêng.
Việc đầu tiên: mở feed.
Rồi đọc vài giây, bấm vào một bài, lại đọc tiếp.
Chỉ mười lăm phần trăm vòng lặp là bấm like, và hai phần trăm là viết bài.
Nghỉ một lúc, rồi lặp lại từ đầu.
Bỏ thời gian chờ đi là bạn đang test một con bot, không phải người dùng.
```

## 7. Style ảnh chung của blog

Dùng cho mọi prompt sinh ảnh, để các bài nhìn cùng một hệ.

```
Flat minimal technical illustration. Dark background (#1a1a2e).
Single accent color: muted cyan-blue (#4ea8de). Geometric, generous negative space.
No text, no letters, no numbers anywhere in the image. No people, no faces.
No 3D render, no gradients-heavy corporate style, no stock-photo look.
```

- Ảnh bìa: tỉ lệ 16:9.
- Ảnh trong bài: 4:3 hoặc 16:9, không dùng ảnh dọc.

## 8. Quy ước riêng

- Tên viết tắt: lần đầu viết đầy đủ kèm ngoặc — "Model Context Protocol (MCP)" — các
  lần sau dùng viết tắt.
- Code block luôn có ngôn ngữ: ` ```ts `, ` ```bash `.
- Không đặt code block quá 25 dòng trong bài; dài hơn thì trích đoạn + link.
- Tiêu đề mục là một câu — khẳng định hoặc câu hỏi vui — không dùng danh từ cụt:
  "Vì sao gộp một pha thì trùng lặp" hay "Selector ơi, em ở đâu?" đều tốt hơn "Vấn đề trùng lặp".
- Tiêu đề bài được phép giật nhẹ ("Tránh xa X, càng xa càng tốt") nếu nội dung bài đỡ được câu đó.

## 9. Văn nói cho video

Áp dụng cho `voice` trong `script.json` và hook trong `idea.md`. Luật đếm được (độ dài hook,
label) do `npm run validate` / `check-idea` kiểm, ở đây chỉ ghi phần cần phán đoán.

- Giọng đồng nghiệp đứng cạnh bảng trắng giải thích, không phải giảng bài, không phải quảng cáo.
  Tông giống blog (mục 2) nhưng ngắn hơn: **tối đa một câu đùa mỗi video**, đặt ở giữa hoặc cuối,
  không đặt ở câu hook. Nhân hoá ngắn gọn rất hợp ("component này nghe lén cả store").
- Mỗi câu thoại nói được trong một hơi. Câu viết thì đọc được, câu nói thì phải nghe được:
  bỏ ngoặc đơn, không liệt kê quá ba thứ trong một câu.
- Câu đầu đặt người xem vào tình huống rồi hỏi: "Bạn tick đúng một checkbox, mà cả trang render lại. Vì sao?"
  Không chào, không "hôm nay mình sẽ".
- Một video = một ý. Muốn nói thêm ý thứ hai → để dành cho video khác hoặc cho bài blog.
- Thuật ngữ tiếng Anh giữ nguyên như mục 3, đọc theo cách dev Việt hay đọc.
- Gọi người xem là "bạn". Xưng "mình" khi kể chuyện bản thân ("hồi trước mình cũng dính"), còn lại
  không cần xưng.
- Câu thoại cuối là một nguyên tắc mang đi được ("Component nghe gì, thì mới nên render vì cái đó."), không phải tóm tắt.
