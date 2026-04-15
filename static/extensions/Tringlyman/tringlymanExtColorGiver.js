(function () {
	class Extension {
		constructor() {
			Scratch.vm.extensionManager.loadExtensionURL(
				"https://extensions.penguinmod.com/extensions/DogeisCut/dogeiscutObject.js",
			);
			Scratch.vm.extensionManager.loadExtensionURL("jwColor");
		}
		getInfo() {
			return {
				id: "tringlymanExtColorGiver",
				name: "ext Color giver",
				color1: "#f04a87",
				blocks: [
					{
						opcode: "openWebsite",
						blockType: Scratch.BlockType.BUTTON,
						text: "open ext-color-giver website",
					},
					{
						opcode: "getColors",
						blockType: Scratch.BlockType.REPORTER,
						text: "get [colorOpt] of [color] as [colorType]",
						forceOutputType: ["Color", "Object", "String", "Hex"],
						arguments: {
							colorOpt: {
								menu: "colorOpt",
							},
							color: {
								type: Scratch.ArgumentType.COLOR,
								defaultValue: "#ff7AAB",
							},
							colorType: {
								menu: "colorType",
							},
						},
					},
				],
				menus: {
					colorOpt: {
						acceptReporters: false,
						items: [
							{
								text: "all colors",
								value: "0",
							},
							{
								text: "color1",
								value: "color1",
							},
							{
								text: "color2",
								value: "color2",
							},
							{
								text: "color3",
								value: "color3",
							},
						],
					},
					colorType: {
						acceptReporters: false,
						items: [
							{
								text: "jwColor",
								value: "JWCOLOR",
							},
							{
								text: "hex",
								value: "HEX",
							},
						],
					},
				},
			};
		}

		openWebsite() {
			window.open("https://ext-color-giver.vercel.app", "_blank");
		}

		getColors({ colorOpt, color, colorType }) {
			color = Scratch.Color.hexToRgb(
				Scratch.vm.jwColor.Type.toColor(color).toHex(),
			);
			const hexObj = {
				color1: Scratch.Color.rgbToHex(color),
				color2: Scratch.Color.rgbToHex(
					Scratch.Color.mixRgb(color, Scratch.Color.RGB_BLACK, 0.1),
				),
				color3: Scratch.Color.rgbToHex(
					Scratch.Color.mixRgb(color, Scratch.Color.RGB_BLACK, 0.2),
				),
			};

			const result =
				colorType === "JWCOLOR"
					? Object.fromEntries(
							Object.entries(hexObj).map(([k, v]) => [
								k,
								Scratch.vm.jwColor.Type.toColor(v),
							]),
						)
					: hexObj;

			return colorOpt === "0"
				? Scratch.vm.dogeiscutObject.Type.toObject(result)
				: result[colorOpt];
		}
	}

	Scratch.extensions.register(new Extension());
})();
