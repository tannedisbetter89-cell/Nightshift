import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { O as cn } from "./router-DnJ1yfr_.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/badge-BpuM8F_E.js
var import_jsx_runtime = require_jsx_runtime();
var badgeVariants = cva("inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium tracking-wide", {
	variants: { variant: {
		default: "bg-secondary text-secondary-foreground",
		outline: "shadow-[var(--shadow-border)] text-muted-foreground",
		accent: "bg-accent/15 text-accent",
		live: "bg-success/15 text-success",
		idle: "bg-muted text-muted-foreground"
	} },
	defaultVariants: { variant: "default" }
});
function Badge({ className, variant, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn(badgeVariants({ variant }), className),
		...props
	});
}
//#endregion
export { Badge as t };
