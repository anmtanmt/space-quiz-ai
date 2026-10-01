import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { useAuth } from '../contexts/AuthContext';

export default function PasswordRecoveryModal({ onSuccess }) {
  const { isPasswordRecovery, updatePassword, cancelRecovery } = useAuth();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  if (!isPasswordRecovery) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (newPassword.length < 6) {
      setError('パスワードは6文字以上で入力してください。');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('確認用パスワードが一致しません。');
      return;
    }

    setLoading(true);
    try {
      await updatePassword(newPassword);
      setSuccessMsg('✅ パスワードを変更しました！保護者画面を開きます...');
      setTimeout(() => {
        if (onSuccess) onSuccess();
      }, 1200);
    } catch (err) {
      console.error('Password update error:', err);
      setError(err.message || 'パスワードの変更に失敗しました。');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    cancelRecovery();
  };

  const styles = {
    modalBackdrop: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(5, 10, 25, 0.85)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 99999,
      padding: '16px',
    },
    modalCard: {
      backgroundColor: '#131b2e',
      border: '1px solid rgba(56, 189, 248, 0.35)',
      borderRadius: '20px',
      padding: '28px 24px',
      maxWidth: '460px',
      width: '100%',
      color: '#f8fafc',
      boxShadow: '0 20px 50px rgba(0, 0, 0, 0.7), 0 0 30px rgba(56, 189, 248, 0.15)',
      textAlign: 'center',
      boxSizing: 'border-box',
    },
    title: {
      fontSize: '1.35rem',
      fontWeight: 'bold',
      color: '#38bdf8',
      margin: '8px 0 12px',
    },
    desc: {
      fontSize: '0.9rem',
      color: '#94a3b8',
      lineHeight: '1.6',
      marginBottom: '20px',
    },
    formGroup: {
      textAlign: 'left',
      marginBottom: '16px',
    },
    label: {
      display: 'block',
      fontSize: '0.85rem',
      color: '#cbd5e1',
      marginBottom: '6px',
      fontWeight: '600',
    },
    inputContainer: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
    },
    input: {
      width: '100%',
      padding: '12px 46px 12px 14px',
      backgroundColor: 'rgba(15, 23, 42, 0.8)',
      border: '1px solid rgba(148, 163, 184, 0.3)',
      borderRadius: '10px',
      color: '#f8fafc',
      fontSize: '1rem',
      boxSizing: 'border-box',
      outline: 'none',
      transition: 'border-color 0.2s',
    },
    eyeBtn: {
      position: 'absolute',
      right: '10px',
      background: 'none',
      border: 'none',
      color: '#94a3b8',
      cursor: 'pointer',
      fontSize: '1.25rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '4px',
      borderRadius: '6px',
      transition: 'color 0.2s, background-color 0.2s',
    },
    errorText: {
      color: '#f87171',
      fontSize: '0.85rem',
      backgroundColor: 'rgba(239, 68, 68, 0.15)',
      padding: '8px 12px',
      borderRadius: '8px',
      border: '1px solid rgba(239, 68, 68, 0.3)',
      marginBottom: '14px',
      textAlign: 'left',
    },
    successText: {
      color: '#4ade80',
      fontSize: '0.85rem',
      backgroundColor: 'rgba(34, 197, 94, 0.15)',
      padding: '8px 12px',
      borderRadius: '8px',
      border: '1px solid rgba(34, 197, 94, 0.3)',
      marginBottom: '14px',
      textAlign: 'center',
    },
    btnRow: {
      display: 'flex',
      gap: '12px',
      marginTop: '22px',
    },
    cancelBtn: {
      flex: 1,
      padding: '12px',
      fontSize: '0.95rem',
      fontWeight: 'bold',
      color: '#94a3b8',
      backgroundColor: 'rgba(30, 41, 59, 0.8)',
      border: '1px solid rgba(148, 163, 184, 0.3)',
      borderRadius: '12px',
      cursor: 'pointer',
    },
    submitBtn: {
      flex: 2,
      padding: '12px',
      fontSize: '0.95rem',
      fontWeight: 'bold',
      color: '#ffffff',
      background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
      border: 'none',
      borderRadius: '12px',
      cursor: 'pointer',
      boxShadow: '0 4px 15px rgba(2, 132, 199, 0.4)',
    },
  };

  return ReactDOM.createPortal(
    <div style={styles.modalBackdrop}>
      <div 
        style={styles.modalCard} 
        onClick={(e) => e.stopPropagation()}
        className="scrollable-content fade-in"
      >
        <div style={{ fontSize: '2.8rem', marginBottom: '4px' }}>🔑</div>
        <h2 style={styles.title}>新しいパスワードの設定</h2>
        <p style={styles.desc}>
          保護者アカウントの新しいパスワードを入力してください。<br />
          （半角英数6文字以上）
        </p>

        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label style={styles.label}>新しいパスワード:</label>
            <div style={styles.inputContainer}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="半角英数6文字以上"
                style={styles.input}
                minLength={6}
                required
                autoFocus
              />
              <button
                type="button"
                style={styles.eyeBtn}
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? 'パスワードを隠す' : 'パスワードを表示する'}
                aria-label={showPassword ? 'パスワードを隠す' : 'パスワードを表示する'}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>新しいパスワード（確認用）:</label>
            <div style={styles.inputContainer}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="もう一度同じパスワードを入力"
                style={styles.input}
                minLength={6}
                required
              />
              <button
                type="button"
                style={styles.eyeBtn}
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? 'パスワードを隠す' : 'パスワードを表示する'}
                aria-label={showPassword ? 'パスワードを隠す' : 'パスワードを表示する'}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {error && <div style={styles.errorText}>{error}</div>}
          {successMsg && <div style={styles.successText}>{successMsg}</div>}

          <div style={styles.btnRow}>
            <button
              type="button"
              style={styles.cancelBtn}
              onClick={handleCancel}
              disabled={loading}
            >
              キャンセル
            </button>
            <button
              type="submit"
              style={styles.submitBtn}
              disabled={loading}
            >
              {loading ? '変更中...' : 'パスワードを変更する ➔'}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
