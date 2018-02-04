import { MediaQueryMap } from "../../core/toMQS";

export const Bootstrap4Grid: () => MediaQueryMap = () => ({
	xsUp: { minWidth: "0px" },
	xsDown: { maxWidth: "575px" },
	xsOnly: { maxWidth: "575px" },
	smUp: { minWidth: "576px" },
	smDown: { maxWidth: "767px" },
	smOnly: { minWidth: "576px", maxWidth: "767px" },
	mdUp: { minWidth: "768px" },
	mdDown: { maxWidth: "991px" },
	mdOnly: { minWidth: "768px", maxWidth: "991px" },
	lgUp: { minWidth: "992px" },
	lgDown: { maxWidth: "1199px" },
	lgOnly: { minWidth: "992px", maxWidth: "1199px" },
	xlUp: { minWidth: "1200px" },
});
