const express = require("express");
const axios = require("axios");
const router = express.Router();


const extensions = {
  text:"js",  
  python3: "py",
  javascript: "js",
  java: "java",
  cpp: "cpp",
  c: "c",
  csharp: "cs",
  go: "go",
  ruby: "rb",
  php: "php",
  typescript: "ts",
  bash: "sh",
  rust: "rs",
  swift: "swift",
  kotlin: "kt",
  lua: "lua",
  haskell: "hs",
  r: "r"
};

router.post("/", async (req, res) => {
  const {  code } = req.body;
 let language = req.body.language === "text" ? "javascript" : req.body.language;

  if (!language || !code) {
    return res.status(400).json({ error: "Missing language or code" });
  }

  if (!extensions[language]) {
    return res.status(400).json({
      error: `Unsupported language: ${language}`
    });
  }

 const ext = extensions[language] || "txt";
 

  try {
    const response = await axios.post("https://emkc.org/api/v2/piston/execute", {
      language,
      version: "*", // use latest available version
      files: [
        {
          name: `main.${ext}`,
          content: code
        }
      ]
    });

    res.json({
      output: response.data.run.output,
      stderr: response.data.run.stderr,
      exitCode: response.data.run.code
    });
  } catch (error) {
    console.error("Execution failed:", error.response?.data || error.message);
    res.status(500).json({
      error: "Execution failed",
      details: error.response?.data || error.message
    });
  }
});

module.exports = router;
