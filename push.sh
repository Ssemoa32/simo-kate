#!/bin/bash
git add .
git commit -m "${1:-Update Marik assistant}"
git push origin main
echo "✅ تم رفع التحديثات إلى simo-kate بنجاح!"
