---
title: 多图片合并到 pdf
date: "2023-11-18"
author: Sonder
authorGithub: sonder9927
authorImage: /images/uploads/zard-think.jpg
category: code
tags:
- python
- images
description: Use python to merge pdf figures.
---

# 描述
图片批量合并进一个 pdf 文件。

# 代码
```sh
conda install pillow
```

```python
from PIL import Image
from pathlib import Path


def merge_images_to_pdf(img_dir: str, outpdf: str) -> None:
    """
    merge all images in img_dir to outpdf
    Args:
        img_dir (str): images directory
        outpdf (str): output file
    """

    imgs = list(Path(img_dir).glob("*"))
    imgs.sort()
    output = Image.open(imgs.pop(0))
    append_images = []
    for f in imgs:
        fig = Image.open(f)
        if fig.mode == "RGB":
            fig = fig.convert("RGB")
        append_images.append(fig)
    output.save(outpdf, "pdf", save_all=True, append_images=append_images)


if __name__ == "__main__":
    merge_images_to_pdf("images", "image.pdf")
```
