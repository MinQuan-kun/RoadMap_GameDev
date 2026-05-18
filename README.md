# RoadMap_GameDev
# 🎮 GameNode - Lộ Trình Phát Triển Game & Nền Tảng Tuyển Dụng Chuyên Nghiệp

> **GameNode** là nền tảng bản đồ học tập tương tác (Visual Interactive Roadmap) và hệ thống tuyển dụng chuyên nghiệp dành riêng cho ngành Phát triển Game (Game Development). Hệ thống hỗ trợ định hướng nghề nghiệp qua trắc nghiệm thông minh, cung cấp lộ trình học tập trực quan sinh động bằng sơ đồ kéo thả, đi kèm hệ thống quản lý học tập (LMS) bài bản và cổng thông tin tuyển dụng chuyên sâu cho cả Học viên, Nhà tuyển dụng và Quản trị viên.

---

## 🏗️ Kiến Trúc & Công Nghệ Sử Dụng (Tech Stack)

Hệ thống được thiết kế theo mô hình **Client-Server** hiện đại, tách biệt hoàn toàn giữa Frontend chạy trên nền Single Page Application (SPA) tốc độ cao và Backend API mạnh mẽ.

### 💻 Frontend (Ứng Dụng Client)

| Công nghệ / Thư viện | Phiên bản | Vai trò & Chức năng |
| :--- | :--- | :--- |
| **React** | `^19.2.0` | Thư viện giao diện người dùng cốt lõi, sử dụng các hook hiện đại và hiệu năng cao. |
| **Vite** | `^8.0.0-beta.13` | Công cụ build nhanh vượt trội, cung cấp HMR (Hot Module Replacement) tức thời trong phát triển. |
| **React Flow** | `^11.11.4` | Thư viện cốt lõi để vẽ sơ đồ mạng lưới (node-based graph) tương tác cho các lộ trình học tập và yêu cầu công việc. |
| **Dagre** | `^0.8.5` | Thuật toán tự động sắp xếp (auto-layout) phân cấp các Node và Edge trong sơ đồ lộ trình học tập. |
| **Framer Motion** | `^12.38.0` | Thư viện diễn hoạt (animation) cao cấp cho hiệu ứng chuyển trang, đóng/mở modal, hover và các vi tương tác (micro-interactions). |
| **React Router DOM** | `^7.13.1` | Hệ thống định tuyến mạnh mẽ phiên bản mới nhất, quản lý chuyển trang và phân quyền route (Public, Admin, Recruiter). |
| **Tailwind CSS** | `^3.4.17` | Framework CSS tiện ích (Utility-first) giúp xây dựng giao diện tùy chỉnh cực nhanh, hỗ trợ Responsive và Dark Mode hoàn hảo. |
| **Lucide React** | `^0.575.0` | Bộ thư viện icon vector sắc nét, đồng bộ và tối giản. |
| **Axios** | `^1.13.5` | Thư viện gọi API tích hợp sẵn Interceptors để tự động đính kèm JWT Bearer Token trong header. |
| **React Hot Toast** | `^2.6.0` | Hệ thống thông báo trạng thái dạng Toast đẹp mắt, mượt mà và không gây gián đoạn trải nghiệm người dùng. |

### ⚙️ Backend & Database (Hệ Thống Máy Chủ - Tham Chiếu)

*   **ASP.NET Core (Web API)**: Xây dựng bằng .NET 10, cung cấp RESTful API hiệu năng cao và cấu trúc phân tầng (Design Pattern với mô hình 3 lớp).
*   **Authentication**: Xác thực phân quyền Token JWT Bearer bảo mật cao.
*   **Database**: MongoDB (lưu trữ phi cấu trúc hoặc cấu trúc động của các Roadmap Graphs).
*   **Email System**: Tự động gửi email thông báo, phục hồi mật khẩu (Forgot Password) sử dụng Background Services bất đồng bộ và mẫu HTML chuyên nghiệp.


### 1. Phân Hệ Người Học & Ứng Viên (Student / Candidate)

*   **Trang chủ Trực quan (Modern Home Page)**:
    *   Giao diện Sáng/Tối (Light/Dark Mode) mượt mà giúp bảo vệ mắt khi học ban đêm.
    *   Xem danh sách **Lộ trình Chính thức (Official)** được biên soạn bởi chuyên gia và **Lộ trình Cộng đồng (Community)** do người dùng chia sẻ.
    *   Tích hợp **Mini Graph Preview (React Flow)** hiển thị sơ đồ thu nhỏ động của lộ trình ngay trên thẻ bài viết để người dùng dễ hình dung.
*   **Xác thực Bảo mật (Secure Auth)**: Đăng ký, Đăng nhập và Khôi phục mật khẩu thông minh qua hộp thoại Modal, tích hợp gửi mã OTP xác thực trực tiếp về Email.
*   **Trắc nghiệm Định hướng nghề nghiệp (Career Quiz & Survey)**:
    *   Hệ thống câu hỏi khảo sát chuyên sâu giúp đánh giá tư duy, sở thích và kỹ năng hiện tại.
    *   Gợi ý chính xác các vị trí công việc phù hợp kèm theo Lộ trình học tập khuyến nghị (`SurveyResultPage`).
*   **Sơ đồ Lộ trình Học tập Tương tác (Interactive Roadmap Viewer)**:
    *   Sử dụng công nghệ kéo thả của React Flow giúp người học dễ dàng di chuyển, phóng to/thu nhỏ lộ trình.
    *   Click vào các node (Giai đoạn học tập) để mở chi tiết học phần, danh sách bài học và tài liệu liên quan.
*   **Hệ thống Học tập (LMS)**:
    *   Xem danh sách khóa học theo từng lộ trình (`CourseListPage`).
    *   Học trực tiếp qua bài viết chi tiết, xem video hướng dẫn (`LessonPage`).
    *   Thực hiện các Nhiệm vụ bài tập thực tế (Practice Tasks) và các Quiz trắc nghiệm đánh giá kiến thức sau mỗi bài học.
*   **Cổng Tuyển dụng & Việc làm (Game Dev Job Portal)**:
    *   Tìm kiếm và lọc tin tuyển dụng game dev theo tên, cấp bậc hoặc các thẻ công nghệ (Unity, C#, Unreal Engine, C++, Blender...).
    *   Nộp hồ sơ ứng tuyển (CV) trực tuyến kèm theo thông tin kết quả khảo sát định hướng và tiến độ học tập thực tế để tăng khả năng trúng tuyển.
*   **Quản lý Trang Cá nhân (User Profile & Dashboard)**:
    *   Cập nhật thông tin cá nhân.
    *   Theo dõi chi tiết tiến trình hoàn thành các lộ trình (%).
    *   Xem lịch sử ứng tuyển việc làm và trạng thái xét duyệt hồ sơ.

### 2. Phân Hệ Nhà Tuyển Dụng (Recruiter Portal)

*   **Bảng Điều khiển (Recruiter Dashboard)**: Thống kê tổng quan số lượng tin tuyển dụng đang hoạt động, số lượng ứng viên đã nộp hồ sơ, và phân tích sơ bộ chất lượng ứng viên.
*   **Quản lý Tin Tuyển dụng (Job Manager)**: Soạn thảo, đăng tuyển, sửa đổi và đóng các tin tuyển dụng nhanh chóng.
*   **Trình Tạo Lộ trình Yêu cầu Công việc (Job Roadmap Builder)**: Xây dựng một sơ đồ kỹ năng cụ thể đòi hỏi cho vị trí tuyển dụng để ứng viên biết mình cần bổ sung kiến thức gì.
*   **Hệ thống Quản lý Ứng viên (Applicants Management)**:
    *   Xem danh sách ứng viên nộp hồ sơ cho từng vị trí.
    *   Xem chi tiết thông tin ứng viên, bao gồm cả **kết quả Trắc nghiệm Định hướng** và **tiến độ học tập thực tế trên nền tảng**, hỗ trợ tối đa việc lọc ứng viên chất lượng.

### 3. Phân Hệ Quản Trị Viên (Admin Portal)

*   **Bảng Số liệu Quản trị (Admin Dashboard)**: Thống kê số lượng người dùng, số lộ trình được tạo, số bài học hoạt động
*   **Bộ Công cụ Visual Pathway Builder (Đỉnh cao Công nghệ Kéo thả)**:
    *   Quy trình thiết kế lộ trình chuẩn hóa gồm 6 bước trực quan:
        1.  *Thông tin chung*: Cấu hình Tiêu đề, Slug URL, Mô tả, Độ khó, Thời gian ước tính, Ảnh nền, Thẻ kỹ năng.
        2.  *Cấu trúc Giai đoạn*: Quản lý danh sách các chặng đường chính của lộ trình.
        3.  *Học phần & Bài học*: Thiết lập chi tiết từng học phần và gắn bài học tương ứng.
        4.  *Nhiệm vụ & Quiz*: Thiết kế các nhiệm vụ thực hành và câu hỏi ôn tập chuyên sâu.
        5.  *Thiết kế Sơ đồ*: Trình chỉnh sửa trực quan (Visual Canvas) sử dụng React Flow cho phép kéo các Node giai đoạn đến vị trí mong muốn và nối dây (Edge) để xác định thứ tự ưu tiên học tập.
        6.  *Hoàn tất & Xuất bản*: Tổng hợp dữ liệu thống kê của toàn bộ lộ trình và tiến hành xuất bản lên hệ thống công khai.
    *   Tự động lưu bản nháp (Draft Recovery) vào `localStorage` của trình duyệt để tránh mất dữ liệu khi gặp sự cố mạng.
*   **Quản lý Bài học (Lesson Manager)**: Biên tập nội dung bài học chuyên nghiệp, nhúng mã video hướng dẫn hoặc tài liệu tham khảo.
*   **Quản lý Lộ trình (Roadmap Manager)**: Duyệt lộ trình từ cộng đồng, quản lý bật/tắt các lộ trình chính thức trên trang chủ.
*   **Quản lý Người dùng (User Manager)**: Danh sách toàn bộ tài khoản trên hệ thống, thực hiện phân quyền vai trò (User, Recruiter, Admin) và khóa/mở khóa tài khoản khi cần thiết.
*   **Quản lý Bộ Trắc nghiệm (Quiz Manager)**: Quản lý ngân hàng câu hỏi, các đáp án và thiết lập công thức tính điểm để gợi ý định hướng nghề nghiệp chuẩn xác nhất.
*   **Tùy chỉnh Giao diện (Site Appearance)**: Thay đổi linh hoạt các tiêu đề, mô tả banner trên trang chủ cho chế độ khách và chế độ thành viên đã đăng nhập trực tiếp từ trang Admin mà không cần sửa code.

---

## 🛠️ Hướng Dẫn Khởi Chạy Dự Án (Installation & Quick Start)

### Yêu cầu Hệ thống
*   **Node.js**: Phiên bản 18.x trở lên.
*   **NPM / Yarn**: Trình quản lý gói tiêu chuẩn.

### Các Bước Cài đặt

1.  **Cài đặt các gói thư viện phụ thuộc**:
    ```bash
    npm install
    ```
2.  **Cấu hình biến môi trường**:
    Tạo hoặc chỉnh sửa file `.env` ở thư mục gốc của dự án:
    ```env
    VITE_BACKEND_URL=https://localhost:7070/api
    VITE_GEMINI_KEY=
    ```
3.  **Chạy dự án ở chế độ phát triển (Development Mode)**:
    ```bash
    npm run dev
    ```
    Ứng dụng sẽ được khởi chạy tại cổng mặc định của Vite, thông thường là: `http://localhost:5173`.
4.  **Biên dịch dự án cho môi trường sản xuất (Production Build)**:
    ```bash
    npm run build
    ```
    Sản phẩm đầu ra sẽ nằm trong thư mục `/dist` sẵn sàng để triển khai lên Vercel, Netlify hoặc Docker container.

---

## 📁 Cấu Trúc Thư Mục Nguồn (Project Structure)

Dự án được tổ chức khoa học theo mô hình module của React:

```text
src/
├── assets/          # Chứa các tài nguyên tĩnh như hình ảnh, logo, v.v.
├── components/      # Các component dùng chung cho toàn hệ thống
│   ├── admin/       # Layout và component dùng riêng cho trang Admin
│   ├── recruiter/   # Layout và component dùng riêng cho nhà tuyển dụng
│   ├── home/        # Component hiển thị trên trang chủ
│   ├── profile/     # Component phục vụ quản lý thông tin cá nhân
│   ├── Roadmap/     # Component vẽ và hiển thị lộ trình học tập
│   └── ...          # LoginModal, RegisterModal, Header, Footer
├── context/         # Quản lý React Context (ví dụ: AuthContext quản lý trạng thái đăng nhập)
├── hooks/           # Các Custom Hook tái sử dụng logic
├── pages/           # Chứa các trang chính (Pages) định nghĩa cho các Routes
│   ├── admin/       # Các trang quản trị hệ thống (Dashboard, SiteAppearance, PathwayBuilder...)
│   ├── recruiter/   # Các trang dành cho nhà tuyển dụng (JobManager, Applicants...)
│   └── ...          # HomePage, CareerQuiz, RoadmapDetail, UserProfile, JobSearch...
├── services/        # Các module gọi API qua Axios (adminApi, userApi, roadmapApi...)
├── styles/          # Các cấu hình style CSS tùy chỉnh bổ sung
├── utils/           # Các hàm tiện ích dùng chung (format date, validate data...)
├── App.jsx          # Component cấu trúc chính, định nghĩa danh sách Route & Auth Modals
├── index.css        # Điểm nhập CSS chính, cấu hình Tailwind CSS
└── main.jsx         # Điểm khởi đầu ứng dụng React
```


