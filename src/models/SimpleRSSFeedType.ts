import { UUID } from "crypto";

export default interface SimpleRSSFeedType {
	name: string;
	id: UUID;
	feed: string[];
	item: string[];
}
