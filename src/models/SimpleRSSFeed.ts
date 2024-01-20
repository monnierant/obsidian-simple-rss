import { UUID } from "crypto";

export default interface SimpleRSSFeed {
	name: string;
	url: string;
	title?: string;
	path?: string;
	template?: string;
	feedTypeId?: UUID;
}
