// build-zip.js
import fs from "fs";
import archiver from "archiver";

const output = fs.createWriteStream("livebackdrop-v1.3-ai-login.zip");
const archive = archiver("zip", { zlib: { level: 9 } });

output.on("close", () => {
  console.log(`✅ 打包完成：livebackdrop-v1.3-ai-login.zip`);
});

archive.on("error", (err) => {
  throw err;
});

archive.pipe(output);

// 打包当前目录（排除 node_modules / .next / 旧 zip）
archive.glob("**/*", {
  ignore: ["node_modules/**", ".next/**", "*.zip"],
});

archive.finalize();
