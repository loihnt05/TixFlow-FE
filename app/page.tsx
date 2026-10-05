import { apiBaseUrl } from "@/lib/public-config";

export default function Home() {
  const apiUrl = apiBaseUrl();

  return (
    <main>
      <section className="hero">
        <p className="eyebrow">HIGH-TRAFFIC BOOKING</p>
        <h1>Luồng vé trôi nhanh.<br />Giữ chỗ vẫn chính xác.</h1>
        <p className="lead">
          Bộ khung khóa luận cho hệ thống nhiều sự kiện, tập trung vào concurrency,
          chống oversell và khả năng mở rộng khi flash sale.
        </p>
        {apiUrl ? (
          <div className="actions">
            <a href={`${apiUrl}/api/v1/events`}>Kiểm tra Events API</a>
            <a className="secondary" href={`${apiUrl}/health`}>Health check</a>
          </div>
        ) : <p className="notice error">Chưa cấu hình địa chỉ API. Tạo `.env.local` theo README rồi khởi động lại ứng dụng.</p>}
      </section>
      <section className="modules">
        <article><b>01</b><h2>Booking Core</h2><p>Hold, expire, confirm và idempotency.</p></article>
        <article><b>02</b><h2>High Traffic</h2><p>Cache, queue, scale-out và load test.</p></article>
        <article><b>03</b><h2>AI Assistant</h2><p>Tìm vé và đề xuất ghế qua API an toàn.</p></article>
      </section>
    </main>
  );
}

