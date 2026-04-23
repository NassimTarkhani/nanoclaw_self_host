import { useEffect, useState } from "react";
import { useClient } from "@/providers/ClientProvider";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { getConfig, setConfig } from "@/lib/api";

export function ConfigEditor({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void; }) {
    const { token } = useClient();
    const [text, setText] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!open) return;
        let cancelled = false;
        (async () => {
            setLoading(true);
            setError(null);
            try {
                const cfg = await getConfig(token);
                if (cancelled) return;
                setText(JSON.stringify(cfg, null, 2));
            } catch (e) {
                setError((e as Error).message);
            } finally {
                setLoading(false);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, [open, token]);

    async function onSave() {
        try {
            setLoading(true);
            const parsed = JSON.parse(text);
            await setConfig(token, parsed);
            onOpenChange(false);
        } catch (e) {
            setError((e as Error).message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Nanobot Configuration</DialogTitle>
                    <DialogDescription>
                        Edit the server configuration JSON. Changes take effect on save.
                    </DialogDescription>
                </DialogHeader>
                <div className="mt-4">
                    <Textarea
                        value={text}
                        onChange={(e) => setText((e.target as HTMLTextAreaElement).value)}
                        className="h-72 font-mono text-sm"
                    />
                    {error ? <p className="mt-2 text-sm text-red-500">{error}</p> : null}
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
                        Cancel
                    </Button>
                    <Button onClick={onSave} disabled={loading}>
                        Save
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default ConfigEditor;
