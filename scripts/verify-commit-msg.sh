#!/bin/bash

MSG_FILE=$1
COMMIT_MSG=$(cat "$MSG_FILE")
BRANCH_NAME=$(git symbolic-ref --short HEAD)

# feature/DEV 브랜치 → [DEVxxxxx]
if [[ "$BRANCH_NAME" == feature/DEV* ]]; then
  if [[ ! "$COMMIT_MSG" =~ ^\[DEV[0-9]{4,}\] ]]; then
    echo ""
    echo "❌ 커밋 메시지는 [DEVxxxxx] 형식이어야 합니다. (예: [DEV12345] 작업 내용)"
    echo "⛔ 브랜치: $BRANCH_NAME"
    echo "⛔ 입력된 메시지: $COMMIT_MSG"
    echo ""
    exit 1
  fi

# fix_ng_ 브랜치 → [fix_ng_xxxx]
elif [[ "$BRANCH_NAME" =~ ^fix_ng_[a-zA-Z0-9]+ ]]; then
  if [[ ! "$COMMIT_MSG" =~ ^\[fix_ng_[a-zA-Z0-9]+\] ]]; then
    echo ""
    echo "❌ 커밋 메시지는 [fix_ng_xxxx] 형식이어야 합니다. (예: [fix_ng_0001] 버그 수정 내용)"
    echo "⛔ 브랜치: $BRANCH_NAME"
    echo "⛔ 입력된 메시지: $COMMIT_MSG"
    echo ""
    exit 1
  fi

# refactor_ 브랜치 → [refactor_xxxx]
elif [[ "$BRANCH_NAME" =~ ^refactor_[a-zA-Z0-9]+ ]]; then
  if [[ ! "$COMMIT_MSG" =~ ^\[refactor_[a-zA-Z0-9]+\] ]]; then
    echo ""
    echo "❌ 커밋 메시지는 [refactor_xxxx] 형식이어야 합니다. (예: [refactor_0001] 리팩토링 내용)"
    echo "⛔ 브랜치: $BRANCH_NAME"
    echo "⛔ 입력된 메시지: $COMMIT_MSG"
    echo ""
    exit 1
  fi
fi

exit 0
