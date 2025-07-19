#!/bin/bash

MSG_FILE=$1
COMMIT_MSG=$(cat "$MSG_FILE")
BRANCH_NAME=$(git symbolic-ref --short HEAD)

# feature/DEV 브랜치일 때만 검사
if [[ "$BRANCH_NAME" == feature/DEV* ]]; then
  if [[ ! "$COMMIT_MSG" =~ ^\[DEV[0-9]{5,}\] ]]; then
    echo ""
    echo "❌ 커밋 메시지는 [DEVxxxxx] 형식이어야 합니다. (예: [DEV12345] 작업 내용)"
    echo "⛔ 브랜치: $BRANCH_NAME"
    echo "⛔ 입력된 메시지: $COMMIT_MSG"
    echo ""
    exit 1
  fi
fi

exit 0
