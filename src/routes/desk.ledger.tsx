import { createFileRoute } from "@tanstack/react-router";
import { deskLedger, deskAuditLog } from "@/lib/commerce/desk";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatUsd } from "@/lib/utils";

export const Route = createFileRoute("/desk/ledger")({
  loader: () =>
    Promise.all([deskLedger({ data: { limit: 100, offset: 0 } }), deskAuditLog({ data: { limit: 50 } })]).then(
      ([entries, audit]) => ({ entries, audit }),
    ),
  component: DeskLedger,
});

function DeskLedger() {
  const { entries, audit } = Route.useLoaderData();

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Sales ledger</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          {entries.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No sales yet. Entries appear here automatically when PayPal captures complete —
              never by hand.
            </p>
          ) : (
            entries.map((e) => (
              <div key={e.id} className="flex justify-between gap-3 text-sm">
                <span>
                  {e.kind}
                  <span className="ml-2 font-mono text-xs text-muted-foreground">
                    {e.order_id}
                  </span>
                </span>
                <span className="font-mono tabular-nums">
                  {formatUsd(e.amount_cents / 100)}
                </span>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Operator audit log</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          {audit.length === 0 ? (
            <p className="text-sm text-muted-foreground">No operator actions recorded yet.</p>
          ) : (
            audit.map((a) => (
              <div key={a.id} className="flex flex-col gap-0.5 text-sm">
                <span>
                  <span className="font-mono text-xs">{a.action}</span>
                  <span className="ml-2 text-muted-foreground">{a.entity}</span>
                </span>
                <span className="text-xs text-muted-foreground">
                  {new Date(a.created_at).toLocaleString()}
                </span>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
