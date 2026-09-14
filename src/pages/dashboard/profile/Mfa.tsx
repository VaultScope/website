import { KeyRound } from 'lucide-react';
import { Button } from '../../../components/Shared';

export function ProfileMfa() {
  return (
    <div className="space-y-8">
      <div className="border border-border p-8 text-center flex flex-col items-center">
        <KeyRound className="w-12 h-12 text-muted-foreground mb-4" />
        <h2 className="text-xl font-medium mb-2">VaultScope ID (Authentik)</h2>
        <p className="text-sm text-muted-foreground mb-6 max-w-md">
          Authentication and Multi-Factor Security (Passkeys, YubiKeys, and TOTP) are securely managed by your central VaultScope ID.
        </p>
        <a href="https://auth.vaultscope.de/if/user/" target="_blank" rel="noopener noreferrer">
          <Button className="h-10 px-6 gap-2">Manage Security in Authentik</Button>
        </a>
      </div>
    </div>
  );
}
