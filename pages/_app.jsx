// pages/_app.jsx
import "../styles/App.css";
import Head from "next/head";

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>UMKM KREMBANGAN SELATAN | Produk Lokal asli krembangan selatan</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Menampilkan beragam produk kreatif dari berbagai pelaku UMKM lokal" />
        <meta name="keywords" content="UMKM Krembangan, Krembangan Selatan, UMKM, Surabaya" />
        <meta name="robots" content="index, follow" />

        {/* Open Graph (untuk tampilan saat dibagikan ke media sosial) */}
        <meta property="og:title" content="UMKM KREMBANGAN SELATAN | Produk Lokal asli krembangan selatan" />
        <meta property="og:description" content="Menampilkan beragam produk kreatif dari berbagai pelaku UMKM lokal." />
        <meta property="og:url" content="https://umkmkremsel.shop" />
        <meta property="og:image" content="https://umkmkremsel.shop/surabaya.jpg" />
        <meta property="og:type" content="website" />

        <link rel="icon" href="/surabaya.jpg" type="image/jpg" />
      </Head>

      <Component {...pageProps} />
    </>
  );
}
