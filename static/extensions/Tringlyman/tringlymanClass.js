(function () {
	class tringlymanClassType {
		customId = "tringlymanClass";

		static DEFAULTOBJ = {
			static: {},
			instance: {},
			this: {},
			isInstance: false,
		};

		constructor(MEMBERS = tringlymanClassType.DEFAULTOBJ) {
			this.members = MEMBERS;
		}

		toString(pretty = false) {
			return JSON.stringify(this.toJSON(), null, pretty ? "\t" : null);
		}

		toJSON() {
			return this.members;
		}

		static blank = new tringlymanClassType(tringlymanClassType.DEFAULTOBJ);

		jwArrayHandler() {
			return this.toReporterContent().outerHTML;
		}

		toReporterContent() {
			const root = document.createElement("i");
			root.style.opacity = "0.7";
			root.innerText =
				[
					...Object.entries(this.members.static),
					...Object.entries(this.members.instance),
				].length > 0
					? `<Custom Class>`
					: `<Blank Class>`;

			return root;
		}

		static toClass(x) {
			if (x instanceof tringlymanClassType) {
				return new tringlymanClassType({
					...x.members,
				});
			}

			if (vm.dogeiscutObject && x instanceof vm.dogeiscutObject.Type) {
				return tringlymanClassType.toClass(
					Object.fromEntries([...x.map.entries()]),
				);
			}

			if (typeof x?.toJSON === "function") {
				return tringlymanClassType.toClass(x.toJSON());
			}

			if (
				Array.isArray(x) &&
				x.length === 2 &&
				x.every(v => Array.isArray(v) && v.length === 2) &&
				x.every(
					([kind, value]) =>
						kind === "static" ||
						kind === "instance" ||
						kind === "this" ||
						kind === "isInstance",
				)
			) {
				return tringlymanClassType.toClass(Object.fromEntries(x));
			}

			if (
				Object.getOwnPropertyNames(x).every(
					k =>
						k === "static" ||
						k === "instance" ||
						k === "this" ||
						k === "isInstance",
				)
			) {
				return new tringlymanClassType(x);
			}

			if (typeof x === "string") {
				try {
					const parsed = JSON.parse(x);
					if (
						Object.getOwnPropertyNames(parsed).every(
							k =>
								k === "static" ||
								k === "instance" ||
								k === "this" ||
								k === "isInstance",
						)
					)
						return new tringlymanClassType(parsed);
					return tringlymanClassType.toClass(parsed);
				} catch {}
			}

			return new tringlymanClassType({
				static: { value: x },
				instance: {},
				this: {},
				isInstance: false,
			});
		}
	}

	const tringlymanClass = {
		Type: tringlymanClassType,
		Block: {
			blockType: Scratch.BlockType.REPORTER,
			blockShape: Scratch.BlockShape.SQUARE,
			forceOutputType: "Class",
			disableMonitor: true,
		},
		Argument: {
			shape: Scratch.BlockShape.SQUARE,
			check: ["Class"],
			exemptFromNormalization: true,
		},
	};

	class Extension {
		constructor() {
			vm.tringlymanClass = tringlymanClass;

			/// adds in generator parameter a static menu descender in IR
			/// it is like descendInputOfBlock but it takes a static menu and turns it to an ir object
			/// {
			///   kind: "constant",
			///   value: theValueOfTheStaticMenu,
			/// }
			vm.exports.IRGenerator.exports.ScriptTreeGenerator.prototype.descendStaticMenuOfBlock =
				function (parentBlock, fieldName) {
					return {
						kind: "constant",
						value: parentBlock.fields[fieldName].value,
					};
				};

			vm.extensionManager.loadExtensionURL(
				"https://extensions.penguinmod.com/extensions/DogeisCut/dogeiscutObject.js",
			);

			vm.runtime.registerCompiledExtensionBlocks(
				"tringlymanClass",
				this.getCompileInfo(),
			);

			vm.runtime.registerSerializer(
				"tringlymanClass",
				mapType => null,
				serializedValue => new tringlymanClassType(),
			);
			/// ^^^ suggested way by [soup](https://github.com/the-can-of-soup/)
			/// ^^^ allows saving without issues with methods not being JSON compatable
		}

		getInfo() {
			return {
				id: "tringlymanClass",
				name: "Class",
				color1: "#6a5acd",
				menuIconURI:
					"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzMDAgMzAwIiB4bWxuczpieD0iaHR0cHM6Ly9ib3h5LXN2Zy5jb20iPgogIDxyZWN0IHg9Ii0zLjgwOCIgeT0iMTk1LjE3IiB3aWR0aD0iMjk5Ljk5IiBoZWlnaHQ9IjI5OS45NTciIHN0eWxlPSJmaWxsOiByZ2IoOTUsIDgxLCAxODUpOyB0cmFuc2Zvcm0tYm94OiBmaWxsLWJveDsgdHJhbnNmb3JtLW9yaWdpbjogNTAlIDUwJTsiIHRyYW5zZm9ybT0ibWF0cml4KDEsIDAuMDAwMDczLCAtMC4wMDAwNzMsIDEsIDMuODEzMDAzLCAtMTk1LjE0ODUxNCkiIHJ4PSIzNjAiIHJ5PSIzNjAiPjwvcmVjdD4KICA8cmVjdCB4PSIxNTQuNjc4IiB5PSI0OTcuNjEiIHdpZHRoPSIyNTAiIGhlaWdodD0iMjUwIiByeD0iMzYwIiByeT0iMzYwIiBzdHlsZT0iZmlsbDogcmdiKDEwNiwgOTAsIDIwNSk7IHRyYW5zZm9ybS1ib3g6IGZpbGwtYm94OyB0cmFuc2Zvcm0tb3JpZ2luOiA1MCUgNTAlOyIgdHJhbnNmb3JtPSJtYXRyaXgoMSwgLTAuMDAwMDM1LCAwLjAwMDAzNSwgMSwgLTEyOS42Nzc5NjUsIC00NzIuNjEwMDUzKSI+PC9yZWN0PgogIDxwYXRoIGQ9Ik0gMTM5Ljg2OCAzODkuNDI5IEggMjUxLjA5MiBBIDE5LjM4OCAxOS4zODggMCAwIDEgMjcwLjQ4IDQwOC44MTcgViA1MjAuMDQxIEEgMTkuMzg4IDE5LjM4OCAwIDAgMSAyNTEuMDkyIDUzOS40MjkgSCAxMzkuODY4IEEgMTkuMzg4IDE5LjM4OCAwIDAgMSAxMjAuNDggNTIwLjA0MSBWIDQwOC44MTcgQSAxOS4zODggMTkuMzg4IDAgMCAxIDEzOS44NjggMzg5LjQyOSBaIE0gMTM4LjUxOSA0MTcuODM2IFYgNTExLjAyMiBBIDEwLjM2OSAxMC4zNjkgMCAwIDAgMTQ4Ljg4OCA1MjEuMzkgSCAyNDIuMDczIEEgMTAuMzY5IDEwLjM2OSAwIDAgMCAyNTIuNDQxIDUxMS4wMjIgViA0MTcuODM2IEEgMTAuMzY5IDEwLjM2OSAwIDAgMCAyNDIuMDczIDQwNy40NjggSCAxNDguODg4IEEgMTAuMzY5IDEwLjM2OSAwIDAgMCAxMzguNTE5IDQxNy44MzYgWiIgYng6c2hhcGU9ImZyYW1lIDEyMC40OCAzODkuNDI5IDE1MCAxNTAgMTguMDM5IDE4LjAzOSAxOS4zODggMTkuMzg4IDE5LjM4OCAxOS4zODggMUBjOWQ1OGFiZiIgc3R5bGU9ImZpbGw6IHJnYigyNTUsIDI1NSwgMjU1KTsgdHJhbnNmb3JtLWJveDogZmlsbC1ib3g7IHRyYW5zZm9ybS1vcmlnaW46IDUwJSA1MCU7IiB0cmFuc2Zvcm09Im1hdHJpeCgxLCAwLjAwMDA1MiwgLTAuMDAwMDUyLCAxLCAtNDUuNDgwMDIzLCAtMzE0LjQyOTAzOCkiPjwvcGF0aD4KICA8cmVjdCB4PSIyNDcuNjA2IiB5PSI2MTUuNTkyIiB3aWR0aD0iOTUiIGhlaWdodD0iOTUiIHJ4PSIxMCIgcnk9IjEwIiBzdHlsZT0iZmlsbDogcmdiKDI1NSwgMjU1LCAyNTUpOyB0cmFuc2Zvcm0tb3JpZ2luOiAyOTQuMjc4cHggNjYzLjA5NHB4OyIgdHJhbnNmb3JtPSJtYXRyaXgoMSwgLTAuMDAwMDE3LCAwLjAwMDAxNywgMSwgLTE0NS4xMDYwMjYsIC01MTMuMDkyMDU0KSI+PC9yZWN0Pgo8L3N2Zz4=",
				blocks: [
					{
						opcode: "blank",
						text: "blank class",
						...vm.tringlymanClass.Block,
					},
					{
						opcode: "parse",
						text: "parse [value] to class",
						arguments: {
							value: {
								type: Scratch.ArgumentType.STRING,
								defaultValue:
									'{"static": {"foo": "bar"}, this: {},"instance": {"foo": null}, "isInstance": false}',
								exemptFromNormalization: true,
							},
						},
						...vm.tringlymanClass.Block,
					},
					{
						opcode: "createInstance",
						text: "create new instance of [class]",
						arguments: {
							class: vm.tringlymanClass.Argument,
						},
						...vm.tringlymanClass.Block,
					},
					{
						opcode: "getContructor",
						text: "get constructor of [class]",
						arguments: {
							class: vm.tringlymanClass.Argument,
						},
						...vm.tringlymanClass.Block,
					},
					"---",
					{
						opcode: "builder",
						text: "class builder",
						branchCount: 1,
						branches: [{}],
						...vm.tringlymanClass.Block,
					},
					{
						opcode: "builderAppend",
						blockType: Scratch.BlockType.COMMAND,
						text: "append [memberKind] property [key] with [value]",
						arguments: {
							memberKind: {
								menu: "memberKind",
							},
							key: {
								type: Scratch.ArgumentType.STRING,
								defaultValue: "foo",
							},
							value: {
								type: Scratch.ArgumentType.STRING,
								defaultValue: "bar",
								exemptFromNormalization: true,
							},
						},
					},
					{
						opcode: "builderAppendMethod",
						blockType: Scratch.BlockType.CONDITIONAL,
						text: ["append [memberKind] method [key] {", "}"],
						branchCount: 1,
						branches: [{}],
						arguments: {
							memberKind: {
								menu: "memberKind",
							},
							key: {
								type: Scratch.ArgumentType.STRING,
								defaultValue: "foo",
							},
							value: {
								type: Scratch.ArgumentType.STRING,
								defaultValue: "bar",
								exemptFromNormalization: true,
							},
						},
					},
					"---",
					{
						opcode: "get",
						blockType: Scratch.BlockType.REPORTER,
						text: "get property [key] in [class]",
						arguments: {
							key: {
								type: Scratch.ArgumentType.STRING,
								defaultValue: "foo",
							},
							class: vm.tringlymanClass.Argument,
						},
						allowDropAnywhere: true,
					},
					"---",
					{
						opcode: "isInstance",
						blockType: Scratch.BlockType.BOOLEAN,
						text: "is [class] instance?",
						arguments: {
							class: {
								exemptFromNormalization: true,
							},
						},
					},
					{
						opcode: "isTringlymanClass",
						blockType: Scratch.BlockType.BOOLEAN,
						text: "is [class] class?",
						arguments: {
							class: {
								exemptFromNormalization: true,
							},
						},
					},
					"---",
					{
						opcode: "runMethod",
						blockType: Scratch.BlockType.COMMAND,
						text: "run method [key] in [class]",
						arguments: {
							key: {
								type: Scratch.ArgumentType.STRING,
								defaultValue: "foo",
							},
							class: vm.tringlymanClass.Argument,
						},
						allowDropAnywhere: true,
					},
					{
						opcode: "runMethodR",
						blockType: Scratch.BlockType.REPORTER,
						text: "run method [key] in [class]",
						arguments: {
							key: {
								type: Scratch.ArgumentType.STRING,
								defaultValue: "foo",
							},
							class: vm.tringlymanClass.Argument,
						},
						allowDropAnywhere: true,
					},
				],
				menus: {
					memberKind: {
						acceptReporters: false,
						items: ["static", "instance"],
					},
				},
			};
		}

		getCompileInfo() {
			return {
				ir: {
					blank(generator, block) {
						return {
							kind: "input",
						};
					},
					parse(generator, block) {
						return {
							kind: "input",
							value: generator.descendInputOfBlock(block, "value"),
						};
					},
					createInstance(generator, block) {
						return {
							kind: "input",
							class: generator.descendInputOfBlock(block, "class"),
						};
					},
					getContructor(generator, block) {
						return {
							kind: "input",
							class: generator.descendInputOfBlock(block, "class"),
						};
					},
					builder(generator, block) {
						generator.script.yields = true;
						return {
							kind: "input",
							substack: generator.descendSubstack(block, "SUBSTACK"),
						};
					},
					builderAppend(generator, block) {
						generator.script.yields = true;
						return {
							kind: "stack",
							memberKind: generator.descendStaticMenuOfBlock(
								block,
								"memberKind",
							),
							key: generator.descendInputOfBlock(block, "key"),
							value: generator.descendInputOfBlock(block, "value"),
						};
					},
					builderAppendMethod(generator, block) {
						generator.script.yields = true;
						return {
							kind: "stack",
							memberKind: generator.descendStaticMenuOfBlock(
								block,
								"memberKind",
							),
							key: generator.descendInputOfBlock(block, "key"),
							substack: generator.descendSubstack(block, "SUBSTACK"),
						};
					},
					get(generator, block) {
						return {
							kind: "input",
							key: generator.descendInputOfBlock(block, "key"),
							class: generator.descendInputOfBlock(block, "class"),
						};
					},
					isInstance(generator, block) {
						return {
							kind: "input",
							class: generator.descendInputOfBlock(block, "class"),
						};
					},
					isTringlymanClass(generator, block) {
						return {
							kind: "input",
							class: generator.descendInputOfBlock(block, "class"),
						};
					},
					runMethod(generator, block) {
						return {
							kind: "stack",
							key: generator.descendInputOfBlock(block, "key"),
							class: generator.descendInputOfBlock(block, "class"),
						};
					},
					runMethodR(generator, block) {
						return {
							kind: "input",
							key: generator.descendInputOfBlock(block, "key"),
							class: generator.descendInputOfBlock(block, "class"),
						};
					},
				},
				js: {
					blank(node, compiler, imports) {
						return new imports.TypedInput(
							`vm.tringlymanClass.Type.blank`,
							imports.TYPE_UNKNOWN,
						);
					},
					parse(node, compiler, imports) {
						return new imports.TypedInput(
							`vm.tringlymanClass.Type.toClass(${compiler.descendInput(node.value).asUnknown()})`,
							imports.TYPE_UNKNOWN,
						);
					},
					createInstance(node, compiler, imports) {
						const originalSource = compiler.source;

						const ClassType = compiler.localVariables.next();
						const temp = compiler.localVariables.next();

						compiler.source = `(yield* (function*() {\n`;
						compiler.source += `let ${ClassType} = ${compiler.descendInput(node.class).asUnknown()};\n`;
						compiler.source += `if (${ClassType}.members.isInstance) {\n`;
						compiler.source += `throw "it is not a constructor";\n`;
						compiler.source += `};\n`;
						compiler.source += `let ${temp} = vm.tringlymanClass.Type.toClass(${ClassType});\n`;
						compiler.source += `${temp}.members.isInstance = true;\n`;
						compiler.source += `return ${temp};\n`;
						compiler.source += `})())`;

						const stackSource = compiler.source;
						compiler.source = originalSource;

						return new imports.TypedInput(stackSource, imports.TYPE_UNKNOWN);
					},
					getContructor(node, compiler, imports) {
						const originalSource = compiler.source;

						const ClassType = compiler.localVariables.next();
						const temp = compiler.localVariables.next();

						compiler.source = `(yield* (function*() {\n`;
						compiler.source += `let ${ClassType} = ${compiler.descendInput(node.class).asUnknown()};\n`;
						compiler.source += `if (!${ClassType}.members.isInstance) {\n`;
						compiler.source += `throw "it is not an instance";\n`;
						compiler.source += `};\n`;
						compiler.source += `let ${temp} = vm.tringlymanClass.Type.toClass(${ClassType});\n`;
						compiler.source += `${temp}.members.isInstance = false;\n`;
						compiler.source += `return ${temp};\n`;
						compiler.source += `})())`;

						const stackSource = compiler.source;
						compiler.source = originalSource;

						return new imports.TypedInput(stackSource, imports.TYPE_UNKNOWN);
					},
					builder(node, compiler, imports) {
						const originalSource = compiler.source;

						compiler.source =
							"vm.tringlymanClass.Type.toClass(yield* (function*() {\n";
						compiler.source += "thread._tringlymanClassBuilderIndex ??= [];\n";
						compiler.source +=
							"thread._tringlymanClassBuilderIndex.push({static: {}, instance: {}, this: {}, isInstance: false});\n";
						compiler.descendStack(
							node.substack,
							new imports.Frame(false, undefined, true),
						);
						compiler.source +=
							"return thread._tringlymanClassBuilderIndex.pop();\n";
						compiler.source += "})())";

						const stackSource = compiler.source;
						compiler.source = originalSource;

						return new imports.TypedInput(stackSource, imports.TYPE_UNKNOWN);
					},
					builderAppend(node, compiler, imports) {
						const bi = `thread._tringlymanClassBuilderIndex`;

						compiler.source += `${bi}[${bi}.length - 1][${compiler.descendInput(node.memberKind).asString()}][${compiler.descendInput(node.key).asString()}] = ${compiler.descendInput(node.value).asUnknown()};\n`;
					},
					builderAppendMethod(node, compiler, imports) {
						const bi = `thread._tringlymanClassBuilderIndex`;

						compiler.source += `${bi}[${bi}.length - 1][${compiler.descendInput(node.memberKind).asString()}][${compiler.descendInput(node.key).asString()}] = function*() {\n`;
						compiler.descendStack(node.substack, new imports.Frame(false));
						compiler.source += `};\n`;
					},
					get(node, compiler, imports) {
						const originalSource = compiler.source;

						const ClassType = compiler.localVariables.next();

						compiler.source = `(yield* (function*() {\n`;
						compiler.source += `let ${ClassType} = ${compiler.descendInput(node.class).asUnknown()};\n`;
						compiler.source += `return ${ClassType}.members[${ClassType}.members.isInstance ? "instance" : "static"][${compiler.descendInput(node.key).asString()}];\n`;
						compiler.source += `})())`;

						const stackSource = compiler.source;
						compiler.source = originalSource;

						return new imports.TypedInput(stackSource, imports.TYPE_UNKNOWN);
					},
					isInstance(node, compiler, imports) {
						const originalSource = compiler.source;

						return new imports.TypedInput(
							`${compiler.descendInput(node.class).asUnknown()}.members.isInstance`,
							imports.TYPE_UNKNOWN,
						);
					},
					isTringlymanClass(node, compiler, imports) {
						const originalSource = compiler.source;

						return new imports.TypedInput(
							`${compiler.descendInput(node.class).asUnknown()} instanceof vm.tringlymanClass.Type`,
							imports.TYPE_UNKNOWN,
						);
					},
					runMethod(node, compiler, imports) {
						const ClassType = compiler.localVariables.next();

						compiler.source += `let ${ClassType} = ${compiler.descendInput(node.class).asUnknown()};\n`;
						compiler.source += `yield* ${ClassType}.members[${ClassType}.members.isInstance ? "instance" : "static"][${compiler.descendInput(node.key).asString()}]();\n`;
					},
					runMethodR(node, compiler, imports) {
						const originalSource = compiler.source;

						const ClassType = compiler.localVariables.next();

						compiler.source = `(yield* (function*() {\n`;
						compiler.source += `let ${ClassType} = ${compiler.descendInput(node.class).asUnknown()};\n`;
						compiler.source += `return (yield* (${ClassType}.members[${ClassType}.members.isInstance ? "instance" : "static"][${compiler.descendInput(node.key).asString()}]()));\n`;
						compiler.source += `})())`;

						const stackSource = compiler.source;
						compiler.source = originalSource;

						return new imports.TypedInput(stackSource, imports.TYPE_UNKNOWN);
					},
				},
			};
		}
	}

	Scratch.extensions.register(new Extension());
})();
