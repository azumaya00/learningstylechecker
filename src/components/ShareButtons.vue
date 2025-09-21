<template>
  <div class="share-buttons" role="group" aria-label="結果を共有">
    <button 
      @click="shareOnX" 
      class="share-btn share-btn--x"
      aria-label="Xで共有"
    >
      <i class="fab fa-x-twitter"></i>
      X
    </button>
    
    <button 
      @click="shareOnLine" 
      class="share-btn share-btn--line"
      aria-label="LINEで共有"
    >
      <i class="fab fa-line"></i>
      LINE
    </button>
    
    <button 
      @click="shareOnWhatsApp" 
      class="share-btn share-btn--whatsapp"
      aria-label="WhatsAppで共有"
    >
      <i class="fab fa-whatsapp"></i>
      WhatsApp
    </button>
    
    <button 
      @click="shareOnFacebook" 
      class="share-btn share-btn--facebook"
      aria-label="Facebookで共有"
    >
      <i class="fab fa-facebook-f"></i>
      Facebook
    </button>
    
    <button 
      @click="copyLink" 
      class="share-btn share-btn--copy"
      aria-label="リンクをコピー"
    >
      <i class="fas fa-link"></i>
      コピー
    </button>
  </div>
</template>

<script>
import { useShare } from '../utils/share'

/**
 * シェアボタンコンポーネント
 * X / LINE / WhatsApp / Facebook / Copy Link の5つのシェア機能を提供
 */
export default {
  name: 'ShareButtons',
  props: {
    /**
     * 診断結果のタイプ
     */
    type: {
      type: String,
      required: true,
      validator: (value) => ['v', 'a', 't', 'va', 'vt', 'at', 'all'].includes(value)
    },
    /**
     * 言語設定
     */
    locale: {
      type: String,
      default: 'ja',
      validator: (value) => ['ja', 'en'].includes(value)
    }
  },
  setup(props) {
    // より完全なフォールバック関数
    const t = (key) => {
      const fallbacks = {
        'share.cta.x': 'X',
        'share.cta.line': 'LINE',
        'share.cta.wa': 'WhatsApp',
        'share.cta.fb': 'Facebook',
        'share.cta.copy': 'コピー',
        'share.message.base': '私の学習スタイルは「%TYPE%」でした！あなたも診断してみませんか？',
        'share.tags': '#学習スタイル診断 #勉強法 #自己分析',
        'labels.type.v': '視覚型',
        'labels.type.a': '聴覚型',
        'labels.type.t': '触覚型',
        'labels.type.va': '視覚・聴覚型',
        'labels.type.vt': '視覚・触覚型',
        'labels.type.at': '聴覚・触覚型',
        'labels.type.all': 'バランス型',
        'app.title': '学習スタイル診断'
      }
      return fallbacks[key] || key
    }
    
    const { shareUrl, copyLink: copyLinkUtil } = useShare(t, props.locale)
    
    return {
      shareUrl,
      copyLinkUtil
    }
  },
  methods: {
    /**
     * Xでシェア
     */
    shareOnX() {
      this.openShareWindow(this.shareUrl('x', this.type))
    },

    /**
     * LINEでシェア
     */
    shareOnLine() {
      this.openShareWindow(this.shareUrl('line', this.type))
    },

    /**
     * WhatsAppでシェア
     */
    shareOnWhatsApp() {
      this.openShareWindow(this.shareUrl('wa', this.type))
    },

    /**
     * Facebookでシェア
     */
    shareOnFacebook() {
      this.openShareWindow(this.shareUrl('fb', this.type))
    },

    /**
     * リンクをコピー
     */
    async copyLink() {
      try {
        await this.copyLinkUtil()
        alert('リンクをコピーしました！')
      } catch (error) {
        alert('コピーに失敗しました。手動でコピーしてください。')
      }
    },

    /**
     * シェア用ポップアップウィンドウを開く
     * @param {string} url - 開くURL
     */
    openShareWindow(url) {
      window.open(
        url,
        'share',
        'width=580,height=400,menubar=no,toolbar=no,scrollbars=yes,resizable=yes'
      )
    }
  }
}
</script>

<style scoped>
.share-buttons {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 12px;
  margin-top: 24px;
}

.share-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 16px;
  border: 1px solid var(--c-border);
  border-radius: 8px;
  background: var(--c-card);
  color: var(--c-text);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  min-height: 44px;
}

.share-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.share-btn:active {
  transform: translateY(0);
}

.share-btn i {
  font-size: 16px;
}

/* X (旧Twitter) */
.share-btn--x {
  background: #000;
  color: white;
  border-color: #000;
}

.share-btn--x:hover {
  background: #333;
  border-color: #333;
}

/* LINE */
.share-btn--line {
  background: #00B900;
  color: white;
  border-color: #00B900;
}

.share-btn--line:hover {
  background: #00A000;
  border-color: #00A000;
}

/* WhatsApp */
.share-btn--whatsapp {
  background: #25D366;
  color: white;
  border-color: #25D366;
}

.share-btn--whatsapp:hover {
  background: #20C55A;
  border-color: #20C55A;
}

/* Facebook */
.share-btn--facebook {
  background: #1877F2;
  color: white;
  border-color: #1877F2;
}

.share-btn--facebook:hover {
  background: #166FE5;
  border-color: #166FE5;
}

/* Copy Link */
.share-btn--copy {
  background: var(--c-card);
  color: var(--c-text);
  border-color: var(--c-border);
  min-width: 0; /* グリッドで均等に配置 */
  white-space: nowrap; /* テキストの改行を防ぐ */
}

.share-btn--copy:hover {
  background: var(--c-primary);
  color: white;
  border-color: var(--c-primary);
}

/* モバイル対応 */
@media (max-width: 640px) {
  .share-buttons {
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
  }
  
  .share-btn {
    padding: 10px 8px;
    font-size: 12px;
    min-height: 40px;
  }
  
  .share-btn i {
    font-size: 14px;
  }
}

/* 小さなモバイル対応 */
@media (max-width: 480px) {
  .share-buttons {
    grid-template-columns: repeat(2, 1fr);
    gap: 6px;
  }
  
  .share-btn {
    padding: 8px 6px;
    font-size: 11px;
    min-height: 36px;
  }
}

/* ダークテーマ対応 */
:root[data-theme="legacy-dark"] .share-btn--copy {
  background: var(--c-card);
  color: var(--c-text);
  border-color: var(--c-border);
}

:root[data-theme="legacy-dark"] .share-btn--copy:hover {
  background: var(--c-primary);
  color: white;
  border-color: var(--c-primary);
}
</style>
