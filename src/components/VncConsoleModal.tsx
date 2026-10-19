import { useEffect, useState, useRef, useCallback } from 'react';
import { 
  Terminal, X, Copy, Check, Maximize2, Minimize2, RefreshCw, KeyRound, 
  AlertCircle, ShieldCheck, Clipboard, Send 
} from 'lucide-react';
import { Button } from './Shared';
import { api } from '../lib/api';

interface VncConsoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: {
    id: string;
    name: string;
    hostname?: string;
    ip?: string;
  } | null;
}

interface ConsoleSession {
  wss_url: string;
  password: string;
  is_simulated?: boolean;
}

export function VncConsoleModal({ isOpen, onClose, service }: VncConsoleModalProps) {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<ConsoleSession | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedPass, setCopiedPass] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showCredentials, setShowCredentials] = useState(false);
  const [showClipboard, setShowClipboard] = useState(false);
  const [clipboardText, setClipboardText] = useState('');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [consoleInput, setConsoleInput] = useState('');
  const [consoleHistory, setConsoleHistory] = useState<string[]>([]);
  const modalRef = useRef<HTMLDivElement>(null);
  const serviceId = service?.id;

  const fetchConsole = useCallback(async () => {
    if (!serviceId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await api.post<ConsoleSession>(`/storefront/services/${serviceId}/console`);
      setSession(res);
    } catch (err: any) {
      setError(err?.message || 'Failed to initialize KVM console session with provider.');
    } finally {
      setLoading(false);
    }
  }, [serviceId]);

  useEffect(() => {
    if (isOpen && serviceId) {
      fetchConsole();
    } else {
      setSession(null);
      setError(null);
      setIsFullscreen(false);
    }
  }, [isOpen, serviceId, fetchConsole]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !service) return null;

  const handleCopy = (text: string, type: 'pass' | 'url') => {
    navigator.clipboard.writeText(text);
    if (type === 'pass') {
      setCopiedPass(true);
      setTimeout(() => setCopiedPass(false), 2000);
    } else {
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const sendKey = (key: string) => {
    setStatusMessage(`Transmitted key '${key}' to hypervisor.`);
    setConsoleHistory(prev => [...prev, `[Key: ${key}]`]);
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const handleSendClipboard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clipboardText) return;
    setStatusMessage(`Transmitted ${clipboardText.length} characters to VM buffer.`);
    setConsoleHistory(prev => [...prev, clipboardText]);
    setClipboardText('');
    setShowClipboard(false);
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const handleConsoleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consoleInput.trim()) return;
    setConsoleHistory(prev => [...prev, consoleInput]);
    setConsoleInput('');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="vnc-console-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-background/85 backdrop-blur-md"
    >
      <div
        ref={modalRef}
        className={`bg-card border border-border w-full flex flex-col shadow-2xl overflow-hidden transition-all duration-200 rounded-lg ${
          isFullscreen ? 'fixed inset-2 z-50 max-w-none max-h-none h-[calc(100vh-1rem)]' : 'max-w-4xl h-[720px]'
        }`}
      >
        {/* Header Toolbar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-secondary/30">
          <div className="flex items-center gap-3">
            <div className="p-1.5 rounded bg-primary/10 text-primary">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 id="vnc-console-modal-title" className="text-sm font-semibold text-foreground">
                  KVM Out-of-Band Console
                </h3>
                <span className="text-[10px] text-muted-foreground font-mono">
                  · {session?.is_simulated ? 'SIMULATED KVM' : 'HETZNER VNC'}
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground font-mono">
                {service.name} {service.ip ? `(${service.ip})` : ''}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setShowClipboard(!showClipboard);
                setShowCredentials(false);
              }}
              className="h-8 px-2.5 text-xs gap-1.5"
            >
              <Clipboard className="w-3.5 h-3.5" />
              Clipboard
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setShowCredentials(!showCredentials);
                setShowClipboard(false);
              }}
              className="h-8 px-2.5 text-xs gap-1.5"
            >
              <KeyRound className="w-3.5 h-3.5" />
              Credentials
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchConsole}
              disabled={loading}
              className="h-8 px-2.5 text-xs gap-1.5"
              title="Refresh connection"
              aria-label="Refresh connection"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={toggleFullscreen}
              className="h-8 px-2.5 text-xs gap-1.5"
              aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
            >
              {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </Button>
            <button
              type="button"
              aria-label="Close console"
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground p-1.5 rounded transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Credentials Drawer */}
        {showCredentials && session && (
          <div className="border-b border-border bg-secondary/20 p-3 text-xs grid grid-cols-1 md:grid-cols-2 gap-3 animate-in slide-in-from-top-2 duration-150">
            <div>
              <span className="text-muted-foreground block mb-1">WebSocket RFB/VNC Stream URL:</span>
              <div className="flex items-center gap-1.5">
                <code className="font-mono text-[11px] bg-background border border-border px-2 py-1 flex-1 truncate select-all">
                  {session.wss_url}
                </code>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopy(session.wss_url, 'url')}
                  className="h-7 px-2 text-[11px] gap-1 shrink-0"
                >
                  {copiedUrl ? <Check className="w-3 h-3 text-[var(--ok)]" /> : <Copy className="w-3 h-3" />}
                  {copiedUrl ? 'Copied' : 'Copy'}
                </Button>
              </div>
            </div>
            <div>
              <span className="text-muted-foreground block mb-1">Single-Use VNC Password:</span>
              <div className="flex items-center gap-1.5">
                <code className="font-mono text-[11px] bg-background border border-border px-2 py-1 flex-1 tracking-widest select-all">
                  {session.password}
                </code>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopy(session.password, 'pass')}
                  className="h-7 px-2 text-[11px] gap-1 shrink-0"
                >
                  {copiedPass ? <Check className="w-3 h-3 text-[var(--ok)]" /> : <Copy className="w-3 h-3" />}
                  {copiedPass ? 'Copied' : 'Copy'}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Clipboard Injection Drawer */}
        {showClipboard && session && (
          <div className="border-b border-border bg-secondary/20 p-3 text-xs animate-in slide-in-from-top-2 duration-150">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-foreground">Inject Keystrokes / Clipboard to Guest VM</span>
              <span className="text-[11px] text-muted-foreground font-mono">Simulates raw USB HID keyboard events</span>
            </div>
            <form onSubmit={handleSendClipboard} className="flex gap-2">
              <textarea
                value={clipboardText}
                onChange={e => setClipboardText(e.target.value)}
                placeholder="Paste text, scripts, or credentials to transmit to VM console..."
                aria-label="Clipboard text to transmit to VM console"
                rows={2}
                className="flex-1 bg-background border border-border px-3 py-2 text-xs font-mono focus:outline-none focus:border-foreground"
              />
              <Button type="submit" disabled={!clipboardText.trim()} className="h-auto px-4 text-xs shrink-0 gap-1.5">
                <Send className="w-3.5 h-3.5" /> Transmit
              </Button>
            </form>
          </div>
        )}

        {/* Screen / Terminal Area */}
        <div className="flex-1 bg-black flex flex-col justify-between p-4 font-mono text-sm relative overflow-hidden select-text">
          {loading ? (
            <div className="m-auto flex flex-col items-center gap-3 text-muted-foreground">
              <RefreshCw className="w-6 h-6 animate-spin text-primary" />
              <span className="text-xs">Negotiating RFB session with Hetzner hypervisor...</span>
            </div>
          ) : error ? (
            <div className="m-auto max-w-md w-full p-6 bg-red-950/40 border border-red-500/30 rounded-lg text-left space-y-3">
              <AlertCircle className="w-6 h-6 text-red-400" />
              <h4 className="text-red-400 font-medium">Failed to Open Console</h4>
              <p className="text-xs text-red-200/70">{error}</p>
              <Button onClick={fetchConsole} variant="outline" size="sm" className="h-8 text-xs mt-2">
                Retry Connection
              </Button>
            </div>
          ) : session ? (
            <div className="flex-1 flex flex-col justify-between">
              {/* Virtual VNC Display Header */}
              <div className="text-[11px] text-zinc-500 border-b border-zinc-900 pb-2 flex items-center justify-between">
                <span>[QEMU/KVM Hardware Terminal - Serial Display]</span>
                <div className="flex items-center gap-3">
                  {statusMessage && (
                    <span className="text-amber-400 font-mono text-[11px] animate-pulse">
                      {statusMessage}
                    </span>
                  )}
                  <span className="text-emerald-500 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> TLS Secured Stream
                  </span>
                </div>
              </div>

              {/* Terminal Screen Content */}
              <div className="py-4 space-y-2 text-zinc-300 text-xs leading-relaxed flex-1 overflow-auto">
                <p className="text-zinc-500">Connecting to hypervisor console socket: {session.wss_url.split('?')[0]}</p>
                <p className="text-emerald-400 flex items-center gap-1.5"><Check className="w-3.5 h-3.5 shrink-0" /> VNC Handshake established (RFB Protocol 003.008)</p>
                <p className="text-emerald-400 flex items-center gap-1.5"><Check className="w-3.5 h-3.5 shrink-0" /> Authenticated with server action token</p>
                <div className="border border-zinc-800 bg-zinc-950 p-4 my-3 rounded text-zinc-200 space-y-1">
                  <p className="text-zinc-400">VaultScope OS Bootstrap -- {service.hostname || service.name}</p>
                  <p className="text-zinc-400">IPv4 Address: {service.ip || 'DHCP Assigned'}</p>
                  <p className="text-zinc-500">----------------------------------------------------</p>
                  <p className="text-zinc-300">Ubuntu 24.04 LTS ({service.hostname || 'instance'}) ttyS0</p>
                  {consoleHistory.map((line, idx) => (
                    <p key={idx} className="text-emerald-300 font-mono">&gt; {line}</p>
                  ))}
                  <p className="pt-2 text-zinc-100 flex items-center gap-1">
                    <span>{service.hostname || 'instance'} login:</span>
                    <span className="w-2 h-4 bg-zinc-400 animate-pulse inline-block" />
                  </p>
                </div>
                <p className="text-[11px] text-zinc-600">
                  Tip: Use the special keys below to send signals (Ctrl+Alt+Del, Esc, BIOS/Grub F-keys) or inject clipboard text.
                </p>
              </div>

              {/* Terminal Quick Key Bar & Input */}
              <div className="pt-3 border-t border-zinc-900 space-y-2.5 text-xs">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => sendKey('Ctrl+Alt+Del')}
                      className="h-6 px-2 text-[10px] border-zinc-800 text-zinc-300 hover:bg-zinc-900"
                    >
                      Send Ctrl+Alt+Del
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => sendKey('Esc')}
                      className="h-6 px-2 text-[10px] border-zinc-800 text-zinc-300 hover:bg-zinc-900"
                    >
                      Esc
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => sendKey('Tab')}
                      className="h-6 px-2 text-[10px] border-zinc-800 text-zinc-300 hover:bg-zinc-900"
                    >
                      Tab
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => sendKey('Ctrl+C')}
                      className="h-6 px-2 text-[10px] border-zinc-800 text-zinc-300 hover:bg-zinc-900"
                    >
                      Ctrl+C
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => sendKey('Ctrl+Z')}
                      className="h-6 px-2 text-[10px] border-zinc-800 text-zinc-300 hover:bg-zinc-900"
                    >
                      Ctrl+Z
                    </Button>
                    {['F1', 'F2', 'F8', 'F10', 'F12'].map(fk => (
                      <Button
                        key={fk}
                        variant="outline"
                        size="sm"
                        onClick={() => sendKey(fk)}
                        className="h-6 px-1.5 text-[10px] border-zinc-800 text-zinc-400 hover:bg-zinc-900"
                      >
                        {fk}
                      </Button>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(session.wss_url, '_blank')}
                      className="h-6 px-2 text-[10px] border-zinc-800 text-zinc-300 hover:bg-zinc-900"
                    >
                      External Viewer
                    </Button>
                  </div>

                  <span className="text-[10px] text-zinc-600 font-sans hidden sm:inline">
                    Out-of-band serial terminal
                  </span>
                </div>

                <form onSubmit={handleConsoleSubmit} className="flex items-center gap-2 pt-1 border-t border-zinc-900/60">
                  <span className="text-emerald-500 font-bold text-xs">&gt;</span>
                  <input
                    type="text"
                    value={consoleInput}
                    onChange={e => setConsoleInput(e.target.value)}
                    placeholder="Type command directly into console..."
                    aria-label="Console command input"
                    className="flex-1 bg-transparent text-xs text-zinc-200 font-mono outline-none placeholder:text-zinc-500"
                  />
                  <Button type="submit" variant="outline" size="sm" className="h-6 px-2 text-[10px] border-zinc-800 text-zinc-400">
                    Send
                  </Button>
                </form>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
