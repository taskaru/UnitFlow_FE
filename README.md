## 🔀 ブランチネーミング規則

| 目的       | ブランチ名の例                                   | ブランチ作成元 | PR対象ブランチ |
|------------|--------------------------------------------------|----------------|----------------|
| 機能開発   | `feature/DEV<開発対象id>_<開発名>`               | `main`         | `main`         |
| バグ修正   | `fix_ng_<ng対象id>_<ng対応名>`                   | `develop`      | `develop`      |
| リファクタリング | `refactor_<refactor対象id>_<refactor対応名>`     | `develop`      | `develop`      |

> 📌 ブランチ名には必ず「作業ID + 作業内容の要約」を含めてください。  
> 例: `feature/DEV1001_login`, `fix_ng_1001_button-bug`, `refactor_1001_HeaderComponent`


## 🧑‍💻 コーディング規則

### 🔸 `.vue` ファイルの記述スタイル

- `.vue` ファイルでは `<script setup>` は使用せず、**必ず `defineComponent` を使用**してください。
- **理由**: CI（継続的インテグレーション）チェックを通過させるためです。

#### ✅ 推奨記述例（`defineComponent` 使用）


```vue
<script lang="ts">
import { defineComponent, reactive } from 'vue';

interface LoginState {
  email: string;
  password: string;
}

export default defineComponent({
  name: 'LoginForm',
  setup() {
    const state = reactive<LoginState>({
      email: '',
      password: '',
    });

    function handleLogin(): void {
      // ミドルtodo
      // バックエンドとの通信コード、ログイン成功時にホームページに遷移
    }

    return {
      state,
      handleLogin,
    };
  },
});
</script>
```

## 📁 ディレクトリ構成とルール

| フォルダ名       | 説明                                                                 |
|------------------|----------------------------------------------------------------------|
| `pages/`         | 各画面に対応する `.vue` ファイルを配置します。URL単位のルーティングに対応。 |
| `components/`    | `pages/` 内部で使用される共通 UI コンポーネントを配置します。             |
| `composables/`   | ロジックを外部化した `.ts` ファイルを配置します（再利用可能な機能など）。   |

---

### 🟢 `.ts` ファイルでは `<script setup>` 使用可

- `composables/` などの `.ts` ファイルでは、**必要に応じて `<script setup>` を使用しても構いません**。
