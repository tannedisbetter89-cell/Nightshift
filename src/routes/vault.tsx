import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/vault")({
  component: () => <Outlet />,
});
