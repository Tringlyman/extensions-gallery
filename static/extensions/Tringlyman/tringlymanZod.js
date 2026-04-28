(async function () {
	const tringlymanZod = {
		...(Zod => {
			return {
				canUseZod: !!Zod,
				Zod,
			};
		})(
			await Scratch.external
				.importModule("https://unpkg.com/zod@latest?module")
				.then(m => m.z)
				.catch(err => undefined),
		),
		Block: {
			blockType: Scratch.BlockType.REPORTER,
			blockShape: Scratch.BlockShape.PLUS,
			forceOutputType: "Zod",
			disableMonitor: true,
		},
		Argument: {
			shape: Scratch.BlockShape.PLUS,
			check: ["Zod"],
			exemptFromNormalization: true,
		},
	};

	class Extension {
		constructor() {
			vm.tringlymanZod = tringlymanZod;
			vm.extensionManager.loadExtensionURL(
				"https://extensions.penguinmod.com/extensions/DogeisCut/dogeiscutObject.js",
			);
			vm.on("EXTENSION_ADDED", () => {
				vm.extensionManager.refreshBlocks("tringlymanZod");

				vm.jwArray.Type.prototype.tringlymanZodParser = function () {
					return {
						value: this.array.map(v =>
							typeof v?.tringlymanZodParser === "function"
								? v.tringlymanZodParser().value
								: v,
						),
						returnValue(parsed) {
							return vm.jwArray.Type.toArray(parsed);
						},
					};
				};
				vm.dogeiscutObject.Type.prototype.tringlymanZodParser = function () {
					return {
						value: Object.fromEntries(
							[...this.map.entries()].map(([k, v]) => [
								k,
								typeof v?.tringlymanZodParser === "function"
									? v.tringlymanZodParser().value
									: v,
							]),
						),
						returnValue(parsed) {
							return vm.dogeiscutObject.Type.toObject(parsed);
						},
					};
				};
				if (vm.dogeiscutSet) {
					vm.dogeiscutSet.Type.prototype.tringlymanZodParser = function () {
						return {
							value: vm.dogeiscutSet.Type.toSet(
								vm.jwArray.Type.toArray([...this.set]).array.map(v =>
									typeof v?.tringlymanZodParser === "function"
										? v.tringlymanZodParser().value
										: v,
								),
							).set,
							returnValue(parsed) {
								return vm.dogeiscutSet.Type.toSet(
									vm.jwArray.Type.toArray([...parsed]),
								);
							},
						};
					};
				}
				if (vm.dogeiscutRegularExpression) {
					vm.dogeiscutRegularExpression.Type.prototype.tringlymanZodParser =
						function () {
							return {
								value: this.regex,
								returnValue(parsed) {
									return vm.dogeiscutRegularExpression.Type.toRegularExpression(
										parsed,
									);
								},
							};
						};
				}
			});
			vm.runtime.registerCompiledExtensionBlocks(
				"tringlymanZod",
				this.getCompileInfo(),
			);
		}
		getInfo() {
			return {
				id: "tringlymanZod",
				name: "Zod",
				color1: "#45a9ff",
				isDynamic: true,
				menuIconURI:
					"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMDAgMjAwIiB4bWxuczpieD0iaHR0cHM6Ly9ib3h5LXN2Zy5jb20iPgogIDxyZWN0IHg9IjU2LjQ3OSIgeT0iMzU3LjExOCIgd2lkdGg9IjE5OS45ODYiIGhlaWdodD0iMTk5Ljk4NiIgcng9IjM2MCIgcnk9IjM2MCIgc3R5bGU9ImZpbGw6IHJnYig2MiwgMTUyLCAyMzApOyB0cmFuc2Zvcm0tYm94OiBmaWxsLWJveDsgdHJhbnNmb3JtLW9yaWdpbjogNTAlIDUwJTsiIHRyYW5zZm9ybT0ibWF0cml4KDEsIDAuMDAwMDcxLCAtMC4wMDAwNzEsIDEsIC01Ni40NzIxNDYsIC0zNTcuMTEwNTI5KSI+PC9yZWN0PgogIDxyZWN0IHg9IjEzOS41NDUiIHk9IjYyNi4wNjkiIHdpZHRoPSIxNzkuOTgyIiBoZWlnaHQ9IjE4MCIgcng9IjM2MCIgcnk9IjM2MCIgc3R5bGU9ImZpbGw6IHJnYig2OSwgMTY5LCAyNTUpOyB0cmFuc2Zvcm0tYm94OiBmaWxsLWJveDsgdHJhbnNmb3JtLW9yaWdpbjogNTAlIDUwJTsiIHRyYW5zZm9ybT0ibWF0cml4KDEsIDAuMDAwMDg0LCAtMC4wMDAwODQsIDEsIC0xMjkuNTMyMjE1LCAtNjE2LjA2ODg3MikiPjwvcmVjdD4KICA8ZyB0cmFuc2Zvcm09Im1hdHJpeCg1Ljc0OTQwNCwgMCwgMCwgNi4wNjI1NjMsIDMxLjAwNzg1LCAyNy4yNTAzOTIpIiBzdHlsZT0iIj4KICAgIDxieDp0aXRsZT5ab2Q8L2J4OnRpdGxlPgogICAgPHBhdGggZD0iTTIuNTg0IDMuNTgyYTIuMjQ3IDIuMjQ3IDAgMCAxIDIuMTEyLTEuNDc5aDE0LjYxN2MuOTQ4IDAgMS43OTQuNTk1IDIuMTE1IDEuNDg3bDIuNDQgNi43NzdhMi4yNDggMi4yNDggMCAwIDEtLjYyNCAyLjQ0M2wtOS42MSA4LjUyYTIuMjQ3IDIuMjQ3IDAgMCAxLTIuOTYzLjAxOEwuNzc2IDEyLjc3M2EyLjI0OCAyLjI0OCAwIDAgMS0uNjQtMi40NjdabTEyLjAzOCA0Ljg4Ny05LjExIDUuNTM3IDUuNzQgNS4wMDdjLjQ1Ni4zOTkgMS4xMzkuMzk2IDEuNTkzLS4wMDZsNS42NDMtNS4wMDFIMTQuNGw2LjIzOS0zLjk1N2MuNDg4LS4zMjguNjktLjk0Ny40OTEtMS41bC0xLjI0LTMuNDQ2YTEuNTM1IDEuNTM1IDAgMCAwLTEuNDU2LTEuMDE1SDUuNTQ1YTEuNTM1IDEuNTM1IDAgMCAwLTEuNDMxIDEuMDFsLTEuMjI4IDMuMzd6IiBzdHlsZT0iZmlsbDogcmdiKDU1LCAxMzUsIDIwNCk7Ij48L3BhdGg+CiAgPC9nPgo8L3N2Zz4=",
				blocks: [
					{
						blockType: Scratch.BlockType.LABEL,
						text: "schemas",
					},
					{
						opcode: "schemaPrimitive",
						text: "schema [primitive]",
						arguments: {
							primitive: {
								menu: "primitive",
							},
						},
						...vm.tringlymanZod.Block,
					},
					{
						opcode: "schemaRegex",
						text: "schema regex using [zRegex]",
						arguments: {
							zRegex: vm.dogeiscutRegularExpression?.Argument,
						},
						...vm.tringlymanZod.Block,
					},
					{
						opcode: "schemaObject",
						text: "schema object using [zObj]",
						arguments: {
							zObj: vm.dogeiscutObject?.Argument,
						},
						...vm.tringlymanZod.Block,
					},
					{
						opcode: "schemaArray",
						text: "schema array from schema [z]",
						arguments: {
							z: vm.tringlymanZod.Argument,
						},
						...vm.tringlymanZod.Block,
					},
					{
						opcode: "schemaSet",
						text: "schema set from schema [z]",
						arguments: {
							z: vm.tringlymanZod.Argument,
						},
						...vm.tringlymanZod.Block,
					},
					{
						opcode: "schemaTuple",
						text: "schema tuple with schema array [zArr]",
						arguments: {
							zArr: vm.jwArray?.Argument,
						},
						...vm.tringlymanZod.Block,
					},
					{
						opcode: "schemaUnion",
						text: "schema union using array of schemas [zArr]",
						arguments: {
							zArr: vm.jwArray?.Argument,
						},
						...vm.tringlymanZod.Block,
					},
					{
						blockType: Scratch.BlockType.LABEL,
						text: "parsers",
					},
					{
						opcode: "parse",
						blockType: Scratch.BlockType.REPORTER,
						text: "parse [value] with [z]",
						arguments: {
							value: {
								exemptFromNormalization: true,
							},
							z: vm.tringlymanZod.Argument,
						},
					},
					{
						opcode: "parseString",
						blockType: Scratch.BlockType.REPORTER,
						text: "parse string [value]",
						arguments: {
							value: {
								type: Scratch.ArgumentType.STRING,
								defaultValue: "hello world!",
								exemptFromNormalization: true,
							},
						},
					},
					{
						opcode: "parseNumber",
						blockType: Scratch.BlockType.REPORTER,
						text: "parse number [value]",
						arguments: {
							value: {
								type: Scratch.ArgumentType.NUMBER,
								exemptFromNormalization: true,
							},
						},
					},
					{
						opcode: "parseBoolean",
						blockType: Scratch.BlockType.BOOLEAN,
						text: "parse boolean [value]",
						arguments: {
							value: {
								type: Scratch.ArgumentType.BOOLEAN,
								exemptFromNormalization: true,
							},
						},
					},
					{
						opcode: "parseColor",
						blockType: Scratch.BlockType.REPORTER,
						text: "parse color [value]",
						arguments: {
							value: {
								type: Scratch.ArgumentType.COLOR,
								defaultValue: "#45a9ff",
								exemptFromNormalization: true,
							},
						},
					},
				],
				menus: {
					primitive: {
						acceptReporters: false,
						items: [
							"string",
							"number",
							"bigint",
							"boolean",
							"symbol",
							"undefined",
							"null",
							"unknown",
							"never",
							"any",
						],
					},
				},
			};
		}

		getCompileInfo() {
			return {
				ir: {
					schemaPrimitive(generator, block) {
						return {
							kind: "input",
							primitive: block.fields.primitive.value,
						};
					},
					schemaRegex(generator, block) {
						return {
							kind: "input",
							zRegex: generator.descendInputOfBlock(block, "zRegex"),
						};
					},
					schemaObject(generator, block) {
						return {
							kind: "input",
							zObj: generator.descendInputOfBlock(block, "zObj"),
						};
					},
					schemaArray(generator, block) {
						return {
							kind: "input",
							z: generator.descendInputOfBlock(block, "z"),
						};
					},
					schemaTuple(generator, block) {
						return {
							kind: "input",
							zArr: generator.descendInputOfBlock(block, "zArr"),
						};
					},
					schemaSet(generator, block) {
						return {
							kind: "input",
							z: generator.descendInputOfBlock(block, "z"),
						};
					},
					schemaUnion(generator, block) {
						return {
							kind: "input",
							zArr: generator.descendInputOfBlock(block, "zArr"),
						};
					},
					parse(generator, block) {
						return {
							kind: "input",
							value: generator.descendInputOfBlock(block, "value"),
							z: generator.descendInputOfBlock(block, "z"),
						};
					},
					parseString(generator, block) {
						return {
							kind: "input",
							value: generator.descendInputOfBlock(block, "value"),
						};
					},
					parseNumber(generator, block) {
						return {
							kind: "input",
							value: generator.descendInputOfBlock(block, "value"),
						};
					},
					parseBoolean(generator, block) {
						return {
							kind: "input",
							value: generator.descendInputOfBlock(block, "value"),
						};
					},
					parseColor(generator, block) {
						return {
							kind: "input",
							value: generator.descendInputOfBlock(block, "value"),
						};
					},
				},
				js: {
					schemaPrimitive(node, compiler, imports) {
						return new imports.TypedInput(
							`vm.tringlymanZod.Zod.${node.primitive}()`,
							imports.TYPE_UNKNOWN,
						);
					},
					schemaRegex(node, compiler, imports) {
						return new imports.TypedInput(
							`vm.tringlymanZod.Zod.string().regex(${compiler.descendInput(node.zRegex).asUnknown()})`,
							imports.TYPE_UNKNOWN,
						);
					},
					schemaObject(node, compiler, imports) {
						const zObj = compiler.descendInput(node.zObj).asUnknown();
						return new imports.TypedInput(
							`vm.tringlymanZod.Zod.object(Object.fromEntries([...vm.dogeiscutObject.Type.toObject(${zObj}).map.entries()]))`,
							imports.TYPE_UNKNOWN,
						);
					},
					schemaArray(node, compiler, imports) {
						const z = compiler.descendInput(node.z).asUnknown();
						if (`${z}` !== "null") {
							return new imports.TypedInput(
								`${z}.array()`,
								imports.TYPE_UNKNOWN,
							);
						}
						return new imports.TypedInput(
							`vm.tringlymanZod.Zod.any().array()`,
							imports.TYPE_UNKNOWN,
						);
					},
					schemaTuple(node, compiler, imports) {
						const zArr = compiler.descendInput(node.zArr).asUnknown();
						return new imports.TypedInput(
							`vm.tringlymanZod.Zod.tuple(vm.jwArray.Type.toArray(${zArr}).array)`,
							imports.TYPE_UNKNOWN,
						);
					},
					schemaSet(node, compiler, imports) {
						const z = compiler.descendInput(node.z).asUnknown();
						if (`${z}` !== "null") {
							return new imports.TypedInput(
								`vm.tringlymanZod.Zod.set(${z})`,
								imports.TYPE_UNKNOWN,
							);
						}
						return new imports.TypedInput(
							`vm.tringlymanZod.Zod.set(vm.tringlymanZod.Zod.any())`,
							imports.TYPE_UNKNOWN,
						);
					},
					schemaUnion(node, compiler, imports) {
						const zArr = compiler.descendInput(node.zArr).asUnknown();
						return new imports.TypedInput(
							`vm.tringlymanZod.Zod.union(vm.jwArray.Type.toArray(${zArr}).array)`,
							imports.TYPE_UNKNOWN,
						);
					},
					parse(node, compiler, imports) {
						const parser = compiler.descendInput(node.z).asUnknown();
						const value = compiler.descendInput(node.value).asUnknown();

						const a1 = compiler.localVariables.next();
						const a2 = compiler.localVariables.next();

						const originalSource = compiler.source;

						compiler.source = `(yield* (function* () {\n`;
						compiler.source += `let ${a1} = ${value};\n`;
						compiler.source += `if (typeof ${a1}?.tringlymanZodParser === "function") {\n`;
						compiler.source += `let ${a2} = ${a1}.tringlymanZodParser();\n`;
						compiler.source += `return ${a2}.returnValue((${parser} ?? vm.tringlymanZod.Zod.never()).parse(${a2}.value));\n`;
						compiler.source += `};\n`;
						compiler.source += `return (${parser} ?? vm.tringlymanZod.Zod.never()).parse(${a1});\n`;
						compiler.source += `})())`;

						const stackedSource = compiler.source;
						compiler.source = originalSource;

						return new imports.TypedInput(stackedSource, imports.TYPE_UNKNOWN);
					},
					parseString(node, compiler, imports) {
						const value = compiler.descendInput(node.value).asUnknown();
						return new imports.TypedInput(
							`vm.tringlymanZod.Zod.string().parse(${value})`,
							imports.TYPE_UNKNOWN,
						);
					},
					parseNumber(node, compiler, imports) {
						const value = compiler.descendInput(node.value).asUnknown();
						return new imports.TypedInput(
							`vm.tringlymanZod.Zod.number().parse(${value})`,
							imports.TYPE_UNKNOWN,
						);
					},
					parseBoolean(node, compiler, imports) {
						const value = compiler.descendInput(node.value).asUnknown();
						return new imports.TypedInput(
							`vm.tringlymanZod.Zod.boolean().parse(${value})`,
							imports.TYPE_UNKNOWN,
						);
					},
					parseColor(node, compiler, imports) {
						const value = compiler.descendInput(node.value).asUnknown();
						return new imports.TypedInput(
							// I use regex because `#` is not an option with `vm.tringlymanZod.Zod.hex()`
							`vm.tringlymanZod.Zod.string().regex(/#?([0-9a-f]{6}|[0-9a-f]{3})/i).parse(${value})`,
							imports.TYPE_UNKNOWN,
						);
					},
				},
			};
		}
	}

	Scratch.extensions.register(new Extension());
})();
