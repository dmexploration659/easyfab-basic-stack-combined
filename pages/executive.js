import Head from "next/head";
import { useEffect } from "react";

export default function Hello() {
  useEffect(() => {
    document.getElementById("msg").innerText = "JavaScript Applied!";
  }, []);

  return (
    <div className="container">
      <Head>
        <title>Hello World</title>
      </Head>
      <h1>Hello World</h1>
      <p id="msg">This will change with JavaScript.</p>
    </div>
  );
}
