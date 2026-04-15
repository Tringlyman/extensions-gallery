/*
    note to contributors & developers that can read JSON:
        the extra commas are added at the end of each thing
        to help copy & pasting work better
        pleas dont remove them :)
*/
/**
 * @typedef {{
   hideFromGallery?: boolean;
   name: string;
   description?: string;
   code: string;
   banner: string;
   creator: string;
   creatorAlias?: string;
   isGitHub?: boolean;
   notes?: string;
   documentation?: string;
   tags?: string[];
   unstable?: boolean;
   unstableReason?: string;
   }} keysMain
 */
/**
 * @type {keysMain[]}
 */
export default [
	{
		name: "Grid",
		description: "store values in a grid(2d array).",
		code: "Tringlyman/tringlymanGrid.js",
		banner: "Tringlyman/tringlymanGrid.svg",
		creator: "tringlyman",
		isGitHub: true,
	},
	{
		name: "Types",
		description: "adds type checking in penguinmod.",
		code: "Tringlyman/tringlymanType.js",
		banner: "Tringlyman/tringlymanType.svg",
		creator: "tringlyman",
		isGitHub: true,
	},
	{
		hideFromGallery: true,
		name: "Extension Color Giver",
		description:
			"adds a reporter which returns color1, color3 and color3. and a button to https://ext-color-giver.vercel.app",
		code: "Tringlyman/tringlymanExtColorGiver.js",
		banner: "Tringlyman/tringlymanExtColorGiver.svg",
		creator: "tringlyman",
		isGitHub: true,
	},
	{
		name: "SVG",
		description: "adds blocks for SVGs",
		code: "Tringlyman/tringlymanSVG.js",
		banner: "Tringlyman/tringlymanSVG.svg",
		creator: "tringlyman",
		isGitHub: true,
	},
];
