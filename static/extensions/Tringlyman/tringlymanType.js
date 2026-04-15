(function () {
	function isInstanceof(x, extId) {
		return vm[extId] && x instanceof vm[extId].Type;
	}

	function specialTypes(TYPE, VALUE) {
		if (TYPE instanceof tringlymanTypeType) {
			TYPE = TYPE.type;
		}
		if (typeof TYPE !== "string") {
			TYPE = vm.tringlymanType.Type.getTypeFrom(TYPE);
		}
		if (
			TYPE === "unknown" ||
			VALUE.type === "unknown" ||
			TYPE === "never" ||
			VALUE.type === "never"
		) {
			return false;
		}
		if (TYPE === "any" || VALUE.type === "any") {
			return true;
		}
	}

	function formatNumber(x) {
		if (x >= 1e6) {
			return x.toExponential(4);
		} else {
			x = Math.floor(x * 1000) / 1000;
			return x.toFixed(Math.min(3, (String(x).split(".")[1] || "").length));
		}
	}

	const escapeHTML = unsafe => {
		return unsafe
			.replaceAll("&", "&amp;")
			.replaceAll("<", "&lt;")
			.replaceAll(">", "&gt;")
			.replaceAll('"', "&quot;")
			.replaceAll("'", "&#039;");
	};

	function span(text) {
		let el = document.createElement("span");
		el.innerHTML = text;
		el.style.display = "hidden";
		el.style.whiteSpace = "nowrap";
		el.style.width = "100%";
		el.style.textAlign = "center";
		return el;
	}

	class tringlymanTypeType {
		constructor(VALUE = undefined, TYPE = "undefined") {
			this.value = VALUE;
			this.type = TYPE;
		}

		static getTypeFrom(x) {
			const types = [
				[isInstanceof(x, "tringlymanType"), x.type],
				[
					x?.tringlymanType && typeof x.tringlymanType === "string",
					x.tringlymanType,
				],
				[x?.customId && typeof x.customId === "string", x.customId],
				[true, typeof x],
			];

			for (const [condition, returnValue] of types) {
				if (condition) {
					return returnValue;
				}
			}
		}

		static display(x) {
			try {
				function draw(innerHTML) {
					return `<i style="opacity: 0.75;">${innerHTML}</i>`;
				}
				switch (typeof x) {
					case "object":
						if (x === null || x === undefined) return draw("null");
						if (typeof x.tringlymanTypeHandler == "function") {
							return x.tringlymanTypeHandler();
						}
						if (typeof x.jwArrayHandler == "function") {
							return x.jwArrayHandler();
						}
						if (x instanceof Array) {
							return "Array";
						}
						return "Object";
					case "undefined":
						return draw("undefined");
					case "number":
						return formatNumber(x);
					case "boolean":
						return x ? "true" : "false";
					case "string":
						return `"${escapeHTML(Scratch.Cast.toString(x))}"`;
				}
			} catch {}
			return "?";
		}

		jwArrayHandler() {
			return `Type<"${this.type}">`;
		}

		toString() {
			return this.value.toString();
		}

		toReporterContent() {
			const table = document.createElement("table");
			table.style.borderCollapse = "collapse";
			table.style.margin = "2px 0";
			table.style.fontSize = "12px";
			table.style.background = "#fff0";
			table.style.border = "1px solid #777";

			function dataStyle(x, isKey = false) {
				x.style.border = "1px solid #777";
				x.style.padding = "2px 6px";
				x.style.background = isKey ? "#77777724" : "#fff0";
			}
			const typeR = document.createElement("tr");
			const valueR = document.createElement("tr");

			const typeH = document.createElement("th");
			dataStyle(typeH, true);
			const valueH = document.createElement("th");
			dataStyle(valueH, true);

			const typeD = document.createElement("td");
			dataStyle(typeD);
			const valueD = document.createElement("td");
			dataStyle(valueD);

			typeH.append(document.createTextNode("type"));
			typeR.append(typeH);
			valueH.append(document.createTextNode("value"));
			valueR.append(valueH);

			const type = document.createElement("i");
			type.style.opacity = "0.7";
			type.append(span(tringlymanTypeType.display(this.type)));
			typeD.append(type);

			valueD.append(span(tringlymanTypeType.display(this.value)));

			typeR.append(typeH);
			valueR.append(valueH);

			typeR.append(typeD);
			valueR.append(valueD);

			table.append(typeR);
			table.append(valueR);

			return table;
		}
	}

	const tringlymanType = {
		Type: tringlymanTypeType,
		Block: {
			blockType: Scratch.BlockType.REPORTER,
			blockShape: Scratch.BlockShape.SQUARE,
			forceOutputType: "Type",
			disableMonitor: true,
		},
		Argument: {
			shape: Scratch.BlockShape.SQUARE,
			check: ["Type"],
			exemptFromNormalization: true,
		},
		registeredTypes: new Set(),
	};

	class Extension {
		constructor() {
			vm.tringlymanType = tringlymanType;
			vm.extensionManager.loadExtensionURL(
				"https://extensions.penguinmod.com/extensions/DogeisCut/dogeiscutObject.js",
			);
		}
		getInfo() {
			return {
				id: "tringlymanType",
				name: "Types",
				color1: "#1B9AAA",
				menuIconURI:
					"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzMDAgMzAwIj4KICA8cmVjdCB4PSIyMjIuNzcxIiB5PSI1OTkuNDY1IiB3aWR0aD0iMzAwLjAwMyIgaGVpZ2h0PSIyOTkuOTk2IiByeD0iMzYwIiByeT0iMzYwIiBzdHlsZT0idHJhbnNmb3JtLWJveDogZmlsbC1ib3g7IHRyYW5zZm9ybS1vcmlnaW46IDUwJSA1MCU7IGZpbGw6IHJnYigyNCwgMTM5LCAxNTMpOyIgdHJhbnNmb3JtPSJtYXRyaXgoMSwgMC4wMDAwMTUsIC0wLjAwMDAxNSwgMSwgLTIyMi43NzYyNDgsIC01OTkuNDYzMjgzKSI+PC9yZWN0PgogIDxyZWN0IHg9IjE4NS42NyIgeT0iODY0Ljg1NyIgd2lkdGg9IjI1MCIgaGVpZ2h0PSIyNTAiIHJ4PSIzNjAiIHJ5PSIzNjAiIHN0eWxlPSJ0cmFuc2Zvcm0tYm94OiBmaWxsLWJveDsgdHJhbnNmb3JtLW9yaWdpbjogNTAlIDUwJTsgZmlsbDogcmdiKDI3LCAxNTQsIDE3MCk7IiB0cmFuc2Zvcm09Im1hdHJpeCgxLCAwLjAwMDAzNywgLTAuMDAwMDM3LCAxLCAtMTYwLjY2OTk5MSwgLTgzOS44NTcxMjIpIj48L3JlY3Q+CiAgPGcgdHJhbnNmb3JtPSJtYXRyaXgoMSwgMCwgMCwgMSwgMS40NDY2OTMsIC0zMzguMzI1NjAyKSI+CiAgICA8cmVjdCB4PSI1Ny4yOTIiIHk9IjEwNTkuMTYiIHdpZHRoPSI1MCIgaGVpZ2h0PSIyMDAiIHJ4PSIxMCIgcnk9IjEwIiBzdHlsZT0iZmlsbDogcmdiKDI1NSwgMjU1LCAyNTUpOyB0cmFuc2Zvcm0tYm94OiBmaWxsLWJveDsgdHJhbnNmb3JtLW9yaWdpbjogNTAlIDUwJTsiIHRyYW5zZm9ybT0ibWF0cml4KDEsIDAuMDAwMDAxLCAtMC4wMDAwMDEsIDEsIDY2LjAwMjc2OCwgLTY1OC4zMzQ0MSkiPjwvcmVjdD4KICAgIDxyZWN0IHg9IjE1Mi4yNzEiIHk9IjIxNy4xNzEiIHdpZHRoPSIxNTAiIGhlaWdodD0iNTAiIHJ4PSIxMCIgcnk9IjEwIiBzdHlsZT0iZmlsbDogcmdiKDI1NSwgMjU1LCAyNTUpOyB0cmFuc2Zvcm0tYm94OiBmaWxsLWJveDsgdHJhbnNmb3JtLW9yaWdpbjogNTAlIDUwJTsiIHRyYW5zZm9ybT0ibWF0cml4KDEsIC0wLjAwMDAwNCwgMC4wMDAwMDQsIDEsIC03OC43MTc2OTIsIDE4My42NTUwNDEpIj48L3JlY3Q+CiAgPC9nPgo8L3N2Zz4=",
				blocks: [
					{
						opcode: "addType",
						text: "add type [TYPE] to [VALUE]",
						arguments: {
							TYPE: {
								type: Scratch.ArgumentType.STRING,
								menu: "typesMenu",
								exemptFromNormalization: true,
							},
							VALUE: {
								type: Scratch.ArgumentType.STRING,
								defaultValue: "foo",
								exemptFromNormalization: true,
							},
						},
						...vm.tringlymanType.Block,
					},
					{
						opcode: "addTypeDynamic",
						text: "add type to [VALUE]",
						arguments: {
							VALUE: {
								type: Scratch.ArgumentType.STRING,
								defaultValue: "foo",
								exemptFromNormalization: true,
							},
						},
						...vm.tringlymanType.Block,
					},
					"---",
					{
						opcode: "isType",
						blockType: Scratch.BlockType.BOOLEAN,
						text: "is [VALUE]'s type [TYPE]",
						arguments: {
							TYPE: {
								type: Scratch.ArgumentType.STRING,
								menu: "typesMenu",
								exemptFromNormalization: true,
							},
							VALUE: vm.tringlymanType.Argument,
						},
					},
					{
						opcode: "get",
						blockType: Scratch.BlockType.REPORTER,
						text: "get [TYPE_VALUE] of [VALUE]",
						arguments: {
							TYPE_VALUE: {
								menu: "TYPE_VALUE",
								exemptFromNormalization: true,
							},
							VALUE: vm.tringlymanType.Argument,
						},
						allowDropAnywhere: true,
					},
					"---",
					{
						opcode: "assert",
						blockType: Scratch.BlockType.COMMAND,
						text: "assert if type of [VALUE] is [TYPE]",
						arguments: {
							TYPE: {
								type: Scratch.ArgumentType.STRING,
								menu: "typesMenu",
								exemptFromNormalization: true,
							},
							VALUE: vm.tringlymanType.Argument,
						},
					},
				],
				menus: {
					TYPE_VALUE: {
						acceptReporters: false,
						items: ["type", "value"],
					},
					typesMenu: {
						acceptReporters: true,
						items: "_typesMenu",
					},
				},
			};
		}

		_typesMenu() {
			const baseTypes = [
				"any",
				"bigint",
				"boolean",
				"function",
				"number",
				"null",
				"string",
				"symbol",
				"object",
				"unknown",
				"undefined",
				"void",
				"never",
				"array",
				"tuple",
			].sort((a, b) =>
				a.localeCompare(b, "en", {
					sensitivity: "accent",
				}),
			);

			const extIdTypes = [
				...Scratch.vm.extensionManager._loadedExtensions.keys().toArray(),
			].sort((a, b) =>
				a.localeCompare(b, "en", {
					sensitivity: "accent",
				}),
			);

			return [
				...baseTypes,
				...extIdTypes,
				...Array.from(vm.tringlymanType.registeredTypes),
			];
		}

		addType({ TYPE, VALUE }) {
			return new vm.tringlymanType.Type(VALUE, TYPE);
		}

		addTypeDynamic({ VALUE }) {
			VALUE ??= new vm.tringlymanType.Type();
			return new vm.tringlymanType.Type(
				VALUE instanceof tringlymanTypeType ? VALUE.value : VALUE,
				vm.tringlymanType.Type.getTypeFrom(VALUE),
			);
		}

		isType({ TYPE, VALUE }) {
			VALUE ??= new vm.tringlymanType.Type();

			specialTypes(TYPE, VALUE);
			return VALUE.type === TYPE;
		}

		get({ TYPE_VALUE, VALUE }) {
			VALUE ??= new vm.tringlymanType.Type();

			return VALUE[TYPE_VALUE];
		}

		assert({ VALUE, TYPE }) {
			VALUE ??= new vm.tringlymanType.Type();

			if (VALUE.type !== TYPE) {
				const value = vm.tringlymanType.Type.display(VALUE.value);
				throw `${VALUE.type} is not of type ${TYPE}`;
			}
		}
	}

	Scratch.extensions.register(new Extension());
})();
