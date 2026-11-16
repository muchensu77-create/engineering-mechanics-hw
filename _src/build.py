"""把 _src 里的样式和脚本拼成一个单文件 HTML。"""
from pathlib import Path

src = Path(__file__).parent
out = src.parent / "工程力学作业讲解.html"
css = (src / "style.css").read_text(encoding="utf-8")
js = "\n".join((src / n).read_text(encoding="utf-8") for n in ["core.js", "p27.js", "p36.js", "pages.js"])
html = (src / "shell.html").read_text(encoding="utf-8").replace("/*CSS*/", css).replace("/*JS*/", js)
out.write_text(html, encoding="utf-8")
(src.parent / "index.html").write_text(html, encoding="utf-8")  # GitHub Pages 入口
print(out, len(html))
