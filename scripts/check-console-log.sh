#!/bin/bash

# 스테이징된 .vue 파일만 찾기
FILES=$(git diff --cached --name-only --diff-filter=ACM | grep '\.vue$')

has_log=false

for file in $FILES; do
  if grep -q 'console\.log' "$file"; then
    echo "⚠️  경고: $file 파일에 console.log가 남아 있습니다!"
    has_log=true
  fi
done

if [ "$has_log" = true ]; then
  echo ""
  echo "❌ 커밋 전에 console.log를 삭제해 주세요!"
  exit 1
fi

exit 0
