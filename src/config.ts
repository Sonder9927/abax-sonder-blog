import type { NavItems } from "./types";

export const NAV_ITEMS: NavItems = {
	home: {
		path: "/",
		title: "home",
	},
	blog: {
		path: "/blog",
		title: "blog",
	},
	tags: {
		path: "/tags",
		title: "tags",
	},
	projects: {
		path: "/projects",
		title: "projects",
	},
	// media: {
	// 	path: "/media",
	// 	title: "media",
	// },
	about: {
		path: "/about",
		title: "about",
	},
};

export const SITE = {
	// Your site's detail?
	name: "Sonder Merak",
	title: "Abax - Sonder",
	description: "Youth sentiment is always poetry.",
	url: "https://abax-sonder.vercel.app/",
	githubUrl: "https://github.com/sonder9927/abax-sonder-blog",
	listDrafts: true,
	image:
		"https://photos.fife.usercontent.google.com/pw/AP1GczPqSaSpZCZCILTCBKtjrAYXv2yNc5_iUgZ4oOwkNJOJDh187_3qHU4=w1155-h722-s-no-gm?authuser=0",
	// YT video channel Id (used in media.astro)
	ytChannelId: "",
	// Optional, user/author settings (example)
	// Author: name
	author: "Sonder Merak", // Example: Fred K. Schott
	// Author: Twitter handler
	authorTwitter: "", // Example: FredKSchott
	// Author: Image external source
	authorImage: "", // Example: https://pbs.twimg.com/profile_images/1272979356529221632/sxvncugt_400x400.jpg, https://abs.twimg.com/sticky/default_profile_images/default_profile_normal.png
	// Author: Bio
	authorBio:
		"My life has a limit but knowledge has none.",
};

// Ink - Theme configuration
export const PAGE_SIZE = 8;
export const USE_POST_IMG_OVERLAY = false;
export const USE_MEDIA_THUMBNAIL = true;

export const USE_AUTHOR_CARD = true;
export const USE_SUBSCRIPTION = false; /* works only when USE_AUTHOR_CARD is true */

export const USE_VIEW_STATS = true;
