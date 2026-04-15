(function (Scratch) {
	"use strict";

	if (!Scratch.extensions.unsandboxed) {
		throw "tringlymanGrid must be run unsandboxed";
	}

	if (!Scratch.extensions.isPenguinMod) {
		const msg = `tringlymanGrid must be run unsandboxed AND in penguinmod`;
		alert(msg);
		throw msg;
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

	function isObject(x) {
		const fnToString = Function.prototype.toString;
		const classRegex = /^class\s/;
		if (typeof x === "function") {
			return !classRegex.test(fnToString.call(x));
		}
		if (x !== null && typeof x === "object") {
			const ctor = x.constructor;
			return !(
				typeof ctor === "function" && classRegex.test(fnToString.call(ctor))
			);
		}
		return false;
	}

	function span(text) {
		let el = document.createElement("span");
		el.innerHTML = text;
		el.style.display = "hidden";
		el.style.whiteSpace = "nowrap";
		el.style.width = "100%";
		el.style.textAlign = "center";
		return el;
	}

	function newSize(builderSize, appendSize) {
		return builderSize > appendSize ? builderSize : appendSize;
	}

	/**
	 * credits to the-can-of-soup for creating this class for this exact purpose!!!!
	 * @link https://github.com/the-can-of-soup
	 */
	class Tensor {
		constructor(shape, data = null) {
			this.shape = shape;
			this.dimensionCount = shape.length;
			this.volume = shape.reduce((acc, width) => acc * width, 1);

			if (data === null) {
				data = Tensor.createNullTensorData(shape);
			}
			this.data = data;
		}

		static createNullTensorData(shape) {
			if (shape.length === 0) {
				return null;
			}
			let result = [];
			for (let i = 0; i < shape[0]; i++) {
				result.push(Tensor.createNullTensorData(shape.slice(1)));
			}
			return result;
		}

		getPos(pos) {
			let result = this.data;
			for (let dimension = 0; dimension < this.dimensionCount; dimension++) {
				result = result[pos[dimension]];
			}
			return result;
		}

		setPos(pos, value = null) {
			if (this.dimensionCount < 1) {
				this.data = value;
			}

			let wrapper = this.data;
			for (
				let dimension = 0;
				dimension < this.dimensionCount - 1;
				dimension++
			) {
				wrapper = wrapper[pos[dimension]];
			}
			wrapper[pos[this.dimensionCount - 1]] = value;
		}

		crop(fromPos, toPos) {
			let croppedShape = toPos.map((el, idx) => el - fromPos[idx] + 1);
			let cropped = new Tensor(croppedShape);

			let pos = Array.from(fromPos);
			while (true) {
				// Write to cropped tensor
				let relPos = pos.map((el, idx) => el - fromPos[idx]);
				let value = this.getPos(pos);
				cropped.setPos(relPos, value);

				// Increment to next position
				let incremented = false;
				for (
					let incDimension = 0;
					incDimension < this.dimensionCount;
					incDimension++
				) {
					if (pos[incDimension] < toPos[incDimension]) {
						pos[incDimension]++;
						incremented = true;
						break;
					}
					pos[incDimension] = fromPos[incDimension];
				}

				// Finish if cannot increment further
				if (!incremented) {
					break;
				}
			}

			return cropped;
		}

		trim(value = null) {
			// Loop through all dimensions of the tensor and find how much can be trimmed
			let trimAmounts = [];
			for (let dimension = 0; dimension < this.dimensionCount; dimension++) {
				// Loop through the tensor in this dimension in both positive and negative directions and find how much can be trimmed
				let thisTrimAmounts = [];
				for (
					let reverse = false;
					reverse !== null;
					reverse = reverse ? null : true
				) {
					// Loop through the tensor in this dimension in a specific direction and find how much can be trimmed
					let trimAmount = 0;
					for (
						let i = reverse ? this.shape[dimension] - 1 : 0;
						i >= 0 && i < this.shape[dimension];
						i += reverse ? -1 : 1
					) {
						// Loop through this plane and check if any cells do not match
						let allMatch = true;
						let pos = Array(this.dimensionCount).fill(0);
						pos[dimension] = i;
						while (true) {
							// Check if this cell matches
							if (this.getPos(pos) !== value) {
								allMatch = false;
								break;
							}

							// Increment to next position
							let incremented = false;
							for (
								let incDimension = 0;
								incDimension < this.dimensionCount;
								incDimension++
							) {
								if (incDimension === dimension) {
									continue;
								}
								if (pos[incDimension] < this.shape[incDimension] - 1) {
									pos[incDimension]++;
									incremented = true;
									break;
								}
								pos[incDimension] = 0;
							}

							// Stop if cannot increment further
							if (!incremented) {
								break;
							}
						}

						if (!allMatch) {
							break;
						}
						trimAmount++;
					}
					thisTrimAmounts.push(trimAmount);
				}
				trimAmounts.push(thisTrimAmounts);
			}

			// Crop tensor
			let fromPos = trimAmounts.map(el => el[0]);
			let toPos = trimAmounts.map((el, idx) => this.shape[idx] - el[1] - 1);
			return this.crop(fromPos, toPos);
		}
	}

	class tringlymanGridType {
		customId = "tringlymanGrid";

		constructor(grid = [[null]]) {
			this.grid = [];
			for (const yi in grid) {
				this.grid[yi] = [];
				for (const xi in grid[yi]) {
					this.grid[yi][xi] = grid[yi][xi];
				}
			}
			// this.grid = tringlymanGridType._recalculateSize(this.grid);
		}

		toString(pretty = false) {
			return JSON.stringify(this.grid, null, pretty ? "\t" : null);
		}

		toJSON() {
			return this.grid;
		}

		static display(x) {
			try {
				function EMPTY(innerHTML) {
					const i = document.createElement("i");
					i.innerHTML = innerHTML;
					i.style.opacity = "0.7";
					return i.outerHTML;
				}
				switch (typeof x) {
					case "object":
						if (x === null) return EMPTY("null");
						if (typeof x.tringlymanGridHandler == "function") {
							return x.tringlymanGridHandler();
						}
						if (typeof x.jwArrayHandler == "function") {
							return x.jwArrayHandler();
						}
						if (typeof x.toJSON === "function") {
							return x.toJSON();
						}
						return "Object";
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

		tringlymanGridHandler() {
			return `Grid<${formatNumber(this.grid[0].length)}×${formatNumber(this.grid.length)}>`;
		}

		jwArrayHandler() {
			return `Grid<${formatNumber(this.grid[0].length)}×${formatNumber(this.grid.length)}>`;
		}

		toReporterContent() {
			const table = document.createElement("table");
			table.style.borderCollapse = "collapse";
			table.style.margin = "4px 0";
			table.style.fontSize = "12px";

			const xLength = this.grid[0].length;
			for (const yi in this.grid) {
				const tr = document.createElement("tr");
				for (let xi = 0; xi < xLength; xi++) {
					const td = document.createElement("td");
					td.style.border = "1px solid #77777777";
					td.style.padding = "2px 6px";
					td.style.background = "#ffffff00";

					td.append(
						span(tringlymanGridType.display(this.grid?.[yi]?.[xi] ?? null)),
					);
					tr.append(td);
				}
				table.append(tr);
			}

			return table;
		}

		static Blank(x = 1, y = 1) {
			const temp = [];
			for (let Y = 0; Y < y; Y++) {
				const tempX = [];
				for (let X = 0; X < x; X++) {
					tempX.push(null);
				}
				temp.push(tempX);
			}
			return temp;
		}

		static toGrid(x, copy = true) {
			if (copy) {
				if (x === "" || x === null || x === undefined)
					return new tringlymanGridType();

				if (x instanceof tringlymanGridType)
					return new tringlymanGridType(x.grid);
			} else {
				if (x === "" || x === null || x === undefined)
					return tringlymanGridType.Blank();

				if (x instanceof tringlymanGridType) return x;
			}

			function two_dimentional_arrays_and_sets_validation(v) {
				if (Scratch.vm.jwArray && v instanceof Scratch.vm.jwArray.Type) {
					return v.array;
				}
				if (
					Scratch.vm.dogeiscutSet &&
					v instanceof Scratch.vm.dogeiscutSet.Type
				) {
					return Array.from(v.set);
				}

				if (typeof v === "string") {
					return v.split("");
				}
				try {
					return v;
				} catch {}
				return [v];
			}

			if (typeof x === "object") {
				/**
				 * tringlymanGrid3D is a 3D array version of this extension
				 * so it's compatable and which is why this condition is here
				 */
				if (
					Scratch.vm.tringlymanGrid3D &&
					x instanceof Scratch.vm.tringlymanGrid3D.Type
				) {
					return new tringlymanGridType(
						new tringlymanGridType(x.grid3D[0]).grid[0],
					);
				}

				if (Scratch.vm.jwArray && x instanceof Scratch.vm.jwArray.Type) {
					return new tringlymanGridType(
						x.array.map(v => two_dimentional_arrays_and_sets_validation(v)),
					);
				}

				if (
					Scratch.vm.dogeiscutSet &&
					x instanceof Scratch.vm.dogeiscutSet.Type
				) {
					return new tringlymanGridType(
						Array.from(x.set).map(v =>
							two_dimentional_arrays_and_sets_validation(v),
						),
					);
				}

				if (
					Scratch.vm.dogeiscutObject &&
					x instanceof Scratch.vm.dogeiscutObject.Type
				) {
					return new tringlymanGridType([...x.map.entries()]);
				}

				if (typeof x.toJSON === "function") {
					x = x.toJSON();
				}
				if (Array.isArray(x)) {
					return new tringlymanGridType(x);
				}

				if (x instanceof Set) {
					return new tringlymanGridType(Array.from(x));
				}
				if (isObject(x)) {
					return new tringlymanGridType(Object.entries(x));
				}

				if (x instanceof Map) {
					return new tringlymanGridType(Object.entries({ ...x.entries() }));
				}
			}

			if (typeof x === "string") {
				try {
					const parsed = JSON.parse(x);

					if (Array.isArray(parsed)) {
						return new tringlymanGridType(
							parsed.map(v => (Array.isArray(v) ? v : [v])),
						);
					}

					if (isObject(parsed)) {
						return new tringlymanGridType(
							Object.entries(
								parsed instanceof Map ? { ...parsed.entries() } : parsed,
							),
						);
					}

					return new tringlymanGridType([[parsed]]);
				} catch {}
				return new tringlymanGridType([[x]]);
			}
		}

		static _recalculateSize(grid, x = grid[0].length, y = grid.length) {
			const Y = grid.length;
			const X = grid[0].length;
			const temp = tringlymanGridType.Blank(X > x ? X : x, Y > y ? Y : y);
			const result = [];
			for (const yi in temp) {
				result.push([]);
				for (const xi in temp[yi]) {
					result[yi].push(grid?.[yi]?.[xi] ?? temp[yi][xi]);
				}
			}
			return result;
		}
	}

	const tringlymanGrid = {
		Type: tringlymanGridType,
		Block: {
			blockType: Scratch.BlockType.REPORTER,
			blockShape: Scratch.BlockShape.SQUARE,
			forceOutputType: ["Array", "Grid", "Grid3D"],
			disableMonitor: true,
		},
		Argument: {
			shape: Scratch.BlockShape.SQUARE,
			check: ["Array", "Grid", "Grid3D"],
			exemptFromNormalization: true,
		},
		Blocks: {
			creditsModal() {
				if (Scratch.gui) {
					Scratch.gui.getBlockly().then(async ScratchBlocks => {
						const modal = await ScratchBlocks.customPrompt(
							{
								title: "tringlymanGrid | credits",
							},
							{
								content: { width: "500px" },
							},
							[
								{
									name: "Close",
									role: "close",
									callback: () => {},
								},
							],
						);
						const pre = document.createElement("pre");
						pre.innerText = JSON.stringify(
							{
								credits: {
									"the-can-of-soup": [
										"created Tensor class in the trim block's code,making the trim block exist!",
									],
								},
							},
							null,
							2,
						);
						modal.append(pre);
					});
				}
			},

			blank() {
				return new Scratch.vm.tringlymanGrid.Type(
					Scratch.vm.tringlymanGrid.Type.Blank(),
				);
			},

			blankSize({ x, y }) {
				if (x <= 0 || y <= 0) return;
				return new Scratch.vm.tringlymanGrid.Type(
					Scratch.vm.tringlymanGrid.Type.Blank(x, y),
				);
			},

			parse({ VALUE }) {
				return Scratch.vm.tringlymanGrid.Type.toGrid(VALUE);
			},

			currentGrid(_, { thread }) {
				const builderIndex = thread._tringlymanGridBuilderIndex;
				if (builderIndex && builderIndex.length > 0) {
					return tringlymanGridType.toGrid(
						builderIndex[builderIndex.length - 1],
					);
				}
			},

			builder() {
				throw "failed to compile blocks";
			},

			builderAppend({ x, y, VALUE }, { thread }) {
				const builderIndex = thread._tringlymanGridBuilderIndex;
				if (builderIndex && builderIndex.length > 0) {
					if (!(x <= 0 || y <= 0)) {
						const result = tringlymanGridType._recalculateSize(
							builderIndex[builderIndex.length - 1].grid,
							Scratch.Cast.toNumber(x),
							Scratch.Cast.toNumber(y),
						);
						result[Scratch.Cast.toNumber(y) - 1][Scratch.Cast.toNumber(x) - 1] =
							VALUE;
						builderIndex[builderIndex.length - 1].grid = result;
						thread._tringlymanGridBuilderIndex[
							thread._tringlymanGridBuilderIndex.length - 1
						] = builderIndex[builderIndex.length - 1];
					}
				}
			},

			builderAppendEmpty({ x, y }, { thread }) {
				const builderIndex = thread._tringlymanGridBuilderIndex;
				if (builderIndex && builderIndex.length > 0) {
					if (x <= 0 || y <= 0) return;
					const result = tringlymanGridType._recalculateSize(
						builderIndex[builderIndex.length - 1].grid,
						Scratch.Cast.toNumber(x),
						Scratch.Cast.toNumber(y),
					);
					result[Scratch.Cast.toNumber(y) - 1][Scratch.Cast.toNumber(x) - 1] =
						null;
					builderIndex[builderIndex.length - 1].grid = result;
					thread._tringlymanGridBuilderIndex[
						thread._tringlymanGridBuilderIndex.length - 1
					] = builderIndex[builderIndex.length - 1];
				}
			},

			builderSet({ grid }, { thread }) {
				const builderIndex = thread._tringlymanGridBuilderIndex;
				if (builderIndex && builderIndex.length > 0) {
					builderIndex[builderIndex.length - 1] = grid;
				}
			},

			append({ x, y, VALUE, grid }) {
				if (x <= 0 || y <= 0) return;
				grid ??= new tringlymanGridType(tringlymanGridType.Blank());
				const temp = tringlymanGridType._recalculateSize(
					grid.grid,
					Scratch.Cast.toNumber(x),
					Scratch.Cast.toNumber(y),
				);
				temp[Scratch.Cast.toNumber(y) - 1][Scratch.Cast.toNumber(x) - 1] =
					VALUE;
				return new tringlymanGridType(temp);
			},

			shift({ x, y, grid }) {
				grid ??= new tringlymanGridType(tringlymanGridType.Blank());
				const GRID = [...grid.grid];
				if (y > 0) {
					for (let i = 0; i < y; i++) {
						GRID.push(new Array(GRID[0].length));
					}
				}
				for (const v in GRID) {
					const result = [...GRID[v]];
					if (x > 0) {
						for (let i = 0; i < x; i++) {
							result.push(null);
						}
					}
					GRID[v] = result;
				}

				return Scratch.vm.tringlymanGrid.Type.toGrid(GRID);
			},

			crop({ x1, y1, x2, y2, grid }) {
				if ([x1, x2, y1, y2].every(v => v <= 0)) return;
				grid ??= new tringlymanGridType(tringlymanGridType.Blank());
				const result = [];
				for (let y = y1; y <= y2; y++) {
					if (y2 <= grid.grid.length) {
						result.push([]);
						for (let x = x1; x <= x2; x++) {
							if (x2 <= grid.grid[0].length) {
								result[y - 1][x - 1] = grid.grid?.[y - 1]?.[x - 1] ?? null;
							}
						}
					}
				}
				return Scratch.vm.tringlymanGrid.Type.toGrid(result);
			},

			trim({ grid }) {
				grid ??= new tringlymanGridType(tringlymanGridType.Blank());
				grid = grid.grid;

				return new Scratch.vm.tringlymanGrid.Type(
					new Tensor([grid.length, grid[0].length], grid).trim().data,
				);
			},

			removeXY({ axis, xy, grid }) {
				if (xy <= 0) return;
				grid ??= new tringlymanGridType(tringlymanGridType.Blank());
				if (axis === "y") {
					return new tringlymanGridType(
						grid.grid.filter((_, Y) => Y !== xy - 1).length
							? grid.grid.filter((_, Y) => Y !== xy - 1)
							: [[]],
					);
				}

				if (axis === "x") {
					return new tringlymanGridType(
						grid.grid.map(v => v.filter((_, X) => X !== xy - 1)),
					);
				}
			},

			get({ x, y, grid }) {
				if (x <= 0 || y <= 0) return;
				grid ??= tringlymanGridType.toGrid(tringlymanGridType.Blank(1, 1).grid);
				return tringlymanGridType.toGrid(grid).grid?.[y - 1]?.[x - 1];
			},

			length({ grid }) {
				grid ??= tringlymanGridType.toGrid(tringlymanGridType.Blank().grid);
				const x = grid.grid[0].length;
				const y = grid.grid.length;
				const ARR = Scratch.vm?.jwArray?.Type?.toArray([x, y]) ?? [x, y];

				return ARR;
			},

			lengthAxis({ axis, grid }) {
				grid ??= tringlymanGridType.toGrid(tringlymanGridType.Blank().grid);
				const x = grid.grid[0].length;
				const y = grid.grid.length;

				switch (axis) {
					case "x":
						return x;
					case "y":
						return y;
				}
			},

			toString({ grid, format }) {
				return tringlymanGridType
					.toGrid(grid)
					.toString(Scratch.Cast.toBoolean(format));
			},

			forEachIX(_, util) {
				return util.thread._tringlymanGridForEach &&
					util.thread._tringlymanGridForEach[
						util.thread._tringlymanGridForEach.length - 1
					]
					? util.thread._tringlymanGridForEach[
							util.thread._tringlymanGridForEach.length - 1
						][0]["x"]
					: 0;
			},

			forEachIY(_, util) {
				return util.thread._tringlymanGridForEach &&
					util.thread._tringlymanGridForEach[
						util.thread._tringlymanGridForEach.length - 1
					]
					? util.thread._tringlymanGridForEach[
							util.thread._tringlymanGridForEach.length - 1
						][0]["y"]
					: 0;
			},

			forEachV(_, util) {
				return util.thread._tringlymanGridForEach &&
					util.thread._tringlymanGridForEach[
						util.thread._tringlymanGridForEach.length - 1
					]
					? util.thread._tringlymanGridForEach[
							util.thread._tringlymanGridForEach.length - 1
						][1]
					: "";
			},

			forEach() {
				return "noop";
			},

			forEachBreak({}, util) {
				util.stackFrame.entry = [];
			},
		},
	};

	class Extension {
		constructor() {
			Scratch.vm.tringlymanGrid = tringlymanGrid;
			Scratch.vm.extensionManager.loadExtensionURL("jwArray");
			Scratch.vm.runtime.registerCompiledExtensionBlocks(
				"tringlymanGrid",
				this.getCompileInfo(),
			);

			// adds dynamically the code for the blocks
			// in case they aren't compiled
			for (const [opcode, func] of Object.entries(
				Scratch.vm.tringlymanGrid.Blocks,
			)) {
				this[opcode] = function (args, util) {
					return func(args, util);
				};
			}
		}
		getInfo() {
			return {
				id: "tringlymanGrid",
				name: "grid",
				color1: "#ff6a1f",
				color2: "#e65f1c",
				color3: "#cc5519",
				menuIconURI:
					"data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMCAyMCIgeG1sbnM6Yng9Imh0dHBzOi8vYm94eS1zdmcuY29tIj4KICA8Y2lyY2xlIHN0eWxlPSJzdHJva2Utd2lkdGg6IDI7IHBhaW50LW9yZGVyOiBzdHJva2U7IGZpbGw6IHJnYigyNTUsIDEwNiwgMzEpOyBzdHJva2U6IHJnYigyMzAsIDk1LCAyOCk7IiBjeD0iMTAiIGN5PSIxMCIgcj0iOSIvPgogIDxyZWN0IHg9IjkuMDQyIiB5PSI0LjIyIiB3aWR0aD0iMS45MjkiIGhlaWdodD0iMTEuNTYiIHN0eWxlPSJmaWxsOiByZ2IoMjU1LCAyNTUsIDI1NSk7IHN0cm9rZS13aWR0aDogMTsgdHJhbnNmb3JtLW9yaWdpbjogMTAuMDA2cHggMTBweDsiLz4KICA8cGF0aCBkPSJNIDIzLjQ5MiA0MS45MDMgSCAzMi40OTUgQSAxLjI4IDEuMjggMCAwIDEgMzMuNzc1IDQzLjE4MyBWIDUyLjE3NiBBIDEuMjggMS4yOCAwIDAgMSAzMi40OTUgNTMuNDU2IEggMjMuNDkyIEEgMS4yOCAxLjI4IDAgMCAxIDIyLjIxMiA1Mi4xNzYgViA0My4xODMgQSAxLjI4IDEuMjggMCAwIDEgMjMuNDkyIDQxLjkwMyBaIE0gMjMuOTU4IDQ0LjA1NCBWIDUxLjMwNSBBIDAuNDA3IDAuNDA3IDAgMCAwIDI0LjM2NSA1MS43MTIgSCAzMS42MjIgQSAwLjQwNyAwLjQwNyAwIDAgMCAzMi4wMjkgNTEuMzA1IFYgNDQuMDU0IEEgMC40MDcgMC40MDcgMCAwIDAgMzEuNjIyIDQzLjY0NyBIIDI0LjM2NSBBIDAuNDA3IDAuNDA3IDAgMCAwIDIzLjk1OCA0NC4wNTQgWiIgYng6c2hhcGU9ImZyYW1lIDIyLjIxMiA0MS45MDMgMTEuNTYzIDExLjU1MyAxLjc0NiAxLjc0NCAxLjI4IDEuMjggMS4yOCAxLjI4IDFAOGU4NWU4ZjMiIHN0eWxlPSJmaWxsOiByZ2IoMjU1LCAyNTUsIDI1NSk7IHN0cm9rZS13aWR0aDogMTsgdHJhbnNmb3JtLW9yaWdpbjogMjcuOTkzcHggNDcuNjhweDsiIHRyYW5zZm9ybT0ibWF0cml4KDEsIC0wLjAwMDA3OSwgMC4wMDAwNzksIDEsIC0xNy45OTM1MDQsIC0zNy42ODI1NTIpIi8+CiAgPHJlY3QgeD0iNC4yMjIiIHk9IjguOTYxIiB3aWR0aD0iMTEuNTYiIGhlaWdodD0iMS45MjkiIHN0eWxlPSJmaWxsOiByZ2IoMjU1LCAyNTUsIDI1NSk7IHN0cm9rZS13aWR0aDogMTsiLz4KPC9zdmc+",
				blocks: [
					{
						opcode: "creditsModal",
						blockType: Scratch.BlockType.BUTTON,
						text: "credits",
					},
					"---",
					{
						opcode: "blank",
						text: "blank grid",
						...tringlymanGrid.Block,
					},
					{
						opcode: "blankSize",
						text: "blank grid of size x[x]y[y]",
						arguments: {
							x: {
								type: Scratch.ArgumentType.NUMBER,
								defaultValue: 1,
							},
							y: {
								type: Scratch.ArgumentType.NUMBER,
								defaultValue: 1,
							},
						},
						...tringlymanGrid.Block,
					},
					{
						opcode: "parse",
						text: "parse grid [VALUE]",
						arguments: {
							VALUE: {
								type: Scratch.ArgumentType.STRING,
								defaultValue: '[["foo"], ["bar"]]',
								exemptFromNormalization: true,
							},
						},
						...tringlymanGrid.Block,
					},
					"---",
					{
						opcode: "currentGrid",
						text: "current grid",
						hideFromPalette: true,
						canDragDuplicate: true,
						...tringlymanGrid.Block,
					},
					{
						opcode: "builder",
						text: "grid builder [CURRENT]",
						branchCount: 1,
						branches: [{}],
						arguments: {
							CURRENT: {
								fillIn: "currentGrid",
							},
						},
						...tringlymanGrid.Block,
					},
					{
						opcode: "builderAppend",
						text: "append at x[x] y[y] the value [VALUE] to builder",
						blockType: Scratch.BlockType.COMMAND,
						arguments: {
							x: {
								type: Scratch.ArgumentType.NUMBER,
								defaultValue: 1,
							},
							y: {
								type: Scratch.ArgumentType.NUMBER,
								defaultValue: 1,
							},
							VALUE: {
								type: Scratch.ArgumentType.STRING,
								defaultValue: "foo",
								exemptFromNormalization: true,
							},
						},
					},
					{
						opcode: "builderAppendEmpty",
						text: "append empty x[x] y[y] of builder",
						blockType: Scratch.BlockType.COMMAND,
						arguments: {
							x: {
								type: Scratch.ArgumentType.NUMBER,
								defaultValue: 1,
							},
							y: {
								type: Scratch.ArgumentType.NUMBER,
								defaultValue: 1,
							},
						},
					},
					{
						opcode: "builderSet",
						blockType: Scratch.BlockType.COMMAND,
						text: "set builder to [grid]",
						arguments: {
							grid: tringlymanGrid.Argument,
						},
					},
					"---",
					{
						opcode: "append",
						blockType: Scratch.BlockType.REPORTER,
						text: "append [VALUE] at x[x]y[y] in [grid]",
						arguments: {
							x: {
								type: Scratch.ArgumentType.NUMBER,
								defaultValue: 1,
							},
							y: {
								type: Scratch.ArgumentType.NUMBER,
								defaultValue: 1,
							},
							VALUE: {
								type: Scratch.ArgumentType.STRING,
								defaultValue: "foo",
								exemptFromNormalization: true,
							},
							grid: tringlymanGrid.Argument,
						},
						...tringlymanGrid.Block,
					},
					{
						opcode: "shift",
						blockType: Scratch.BlockType.REPORTER,
						text: "shift by x[x] y[y] in grid [grid]",
						arguments: {
							x: {
								type: Scratch.ArgumentType.NUMBER,
								defaultValue: 1,
							},
							y: {
								type: Scratch.ArgumentType.NUMBER,
								defaultValue: 1,
							},
							grid: tringlymanGrid.Argument,
						},
						...tringlymanGrid.Block,
					},
					{
						opcode: "crop",
						blockType: Scratch.BlockType.REPORTER,
						text: "crop from x[x1] y[y1] to x[x2] y[y2] in grid [grid]",
						arguments: {
							x1: {
								type: Scratch.ArgumentType.NUMBER,
								defaultValue: 1,
							},
							y1: {
								type: Scratch.ArgumentType.NUMBER,
								defaultValue: 1,
							},
							x2: {
								type: Scratch.ArgumentType.NUMBER,
								defaultValue: 1,
							},
							y2: {
								type: Scratch.ArgumentType.NUMBER,
								defaultValue: 1,
							},
							grid: tringlymanGrid.Argument,
						},
						...tringlymanGrid.Block,
					},
					{
						opcode: "trim",
						blockType: Scratch.BlockType.REPORTER,
						text: "trim grid [grid]",
						arguments: {
							grid: tringlymanGrid.Argument,
						},
						...tringlymanGrid.Block,
					},
					{
						opcode: "removeXY",
						blockType: Scratch.BlockType.REPORTER,
						text: "remove [axis] [xy] from [grid]",
						arguments: {
							axis: {
								type: Scratch.ArgumentType.STRING,
								menu: "axis",
							},
							xy: {
								type: Scratch.ArgumentType.NUMBER,
								defaultValue: 1,
							},
							grid: tringlymanGrid.Argument,
						},
						...tringlymanGrid.Block,
					},
					{
						opcode: "get",
						blockType: Scratch.BlockType.REPORTER,
						text: "get x[x]y[y] in[grid]",
						allowDropAnywhere: true,
						arguments: {
							x: {
								type: Scratch.ArgumentType.NUMBER,
								defaultValue: 1,
							},
							y: {
								type: Scratch.ArgumentType.NUMBER,
								defaultValue: 1,
							},
							grid: tringlymanGrid.Argument,
						},
					},
					{
						opcode: "length",
						text: "length of [grid]",
						arguments: {
							grid: tringlymanGrid.Argument,
						},
						...Scratch.vm.jwArray.Block,
					},
					{
						opcode: "lengthAxis",
						blockType: Scratch.BlockType.REPORTER,
						text: "length [axis] of [grid]",
						arguments: {
							axis: {
								type: Scratch.ArgumentType.STRING,
								menu: "axis",
							},
							grid: tringlymanGrid.Argument,
						},
					},
					{
						opcode: "toString",
						blockType: Scratch.BlockType.REPORTER,
						text: "stringify [grid][format]",
						arguments: {
							grid: tringlymanGrid.Argument,
							format: {
								type: Scratch.ArgumentType.STRING,
								menu: "toString_format",
							},
						},
					},
					"---",
					{
						opcode: "forEachIX",
						text: "x index",
						blockType: Scratch.BlockType.REPORTER,
						hideFromPalette: true,
						canDragDuplicate: true,
					},
					{
						opcode: "forEachIY",
						text: "y index",
						blockType: Scratch.BlockType.REPORTER,
						hideFromPalette: true,
						canDragDuplicate: true,
					},
					{
						opcode: "forEachV",
						text: "value",
						blockType: Scratch.BlockType.REPORTER,
						hideFromPalette: true,
						allowDropAnywhere: true,
						canDragDuplicate: true,
					},
					{
						opcode: "forEach",
						text: "for [IX][IY] [V] of [ARRAY]",
						blockType: Scratch.BlockType.LOOP,
						arguments: {
							ARRAY: tringlymanGrid.Argument,
							IX: {
								fillIn: "forEachIX",
							},
							IY: {
								fillIn: "forEachIY",
							},
							V: {
								fillIn: "forEachV",
							},
						},
					},
				],
				menus: {
					axis: {
						acceptReporters: false,
						items: ["x", "y"],
					},
					toString_format: {
						acceptReporters: false,
						items: [
							{
								text: "compact",
								value: "false",
							},
							{
								text: "pretty",
								value: "true",
							},
						],
					},
				},
			};
		}

		getCompileInfo() {
			return {
				ir: {
					blank: (generator, block) => {
						return {
							kind: "input",
						};
					},
					blankSize: (generator, block) => {
						return {
							kind: "input",
							x: generator.descendInputOfBlock(block, "x"),
							y: generator.descendInputOfBlock(block, "y"),
						};
					},
					parse: (generator, block) => {
						return {
							kind: "input",
							VALUE: generator.descendInputOfBlock(block, "VALUE"),
						};
					},
					currentGrid: (generator, block) => {
						return {
							kind: "input",
						};
					},
					builder: (generator, block) => {
						generator.script.yields = true;
						return {
							kind: "input",
							substack: generator.descendSubstack(block, "SUBSTACK"),
						};
					},
					builderAppend: (generator, block) => {
						return {
							kind: "stack",
							x: generator.descendInputOfBlock(block, "x"),
							y: generator.descendInputOfBlock(block, "y"),
							VALUE: generator.descendInputOfBlock(block, "VALUE"),
						};
					},
					builderAppendEmpty: (generator, block) => {
						return {
							kind: "stack",
							x: generator.descendInputOfBlock(block, "x"),
							y: generator.descendInputOfBlock(block, "y"),
						};
					},
					builderSet: (generator, block) => {
						return {
							kind: "stack",
							grid: generator.descendInputOfBlock(block, "grid"),
						};
					},
					append: (generator, block) => {
						return {
							kind: "input",
							x: generator.descendInputOfBlock(block, "x"),
							y: generator.descendInputOfBlock(block, "y"),
							VALUE: generator.descendInputOfBlock(block, "VALUE"),
							grid: generator.descendInputOfBlock(block, "grid"),
						};
					},
					shift: (generator, block) => {
						return {
							kind: "input",
							x: generator.descendInputOfBlock(block, "x"),
							y: generator.descendInputOfBlock(block, "y"),
							grid: generator.descendInputOfBlock(block, "grid"),
						};
					},
					crop: (generator, block) => {
						return {
							kind: "input",
							x1: generator.descendInputOfBlock(block, "x1"),
							y1: generator.descendInputOfBlock(block, "y1"),
							x2: generator.descendInputOfBlock(block, "x2"),
							y2: generator.descendInputOfBlock(block, "y2"),
							grid: generator.descendInputOfBlock(block, "grid"),
						};
					},
					trim: (generator, block) => {
						return {
							kind: "input",
							grid: generator.descendInputOfBlock(block, "grid"),
						};
					},
					removeXY: (generator, block) => {
						return {
							kind: "input",
							axis: block.fields.axis.value,
							xy: generator.descendInputOfBlock(block, "xy"),
							grid: generator.descendInputOfBlock(block, "grid"),
						};
					},
					get: (generator, block) => {
						return {
							kind: "input",
							x: generator.descendInputOfBlock(block, "x"),
							y: generator.descendInputOfBlock(block, "y"),
							grid: generator.descendInputOfBlock(block, "grid"),
						};
					},
					length: (generator, block) => {
						return {
							kind: "input",
							grid: generator.descendInputOfBlock(block, "grid"),
						};
					},
					lengthAxis: (generator, block) => {
						return {
							kind: "input",
							axis: block.fields.axis.value,
							grid: generator.descendInputOfBlock(block, "grid"),
						};
					},
					toString: (generator, block) => {
						return {
							kind: "input",
							format: block.fields.format.value,
							grid: generator.descendInputOfBlock(block, "grid"),
						};
					},
					forEachIX: (generator, block) => {
						return {
							kind: "input",
						};
					},
					forEachIY: (generator, block) => {
						return {
							kind: "input",
						};
					},
					forEachV: (generator, block) => {
						return {
							kind: "input",
						};
					},
					forEach: (generator, block) => {
						generator.script.yields = true;
						return {
							kind: "stack",
							substack: generator.descendSubstack(block, "SUBSTACK"),
							grid: generator.descendInputOfBlock(block, "ARRAY"),
						};
					},
				},
				js: {
					blank: (node, compiler, imports) => {
						const originalSource = compiler.source;

						compiler.source = `Scratch.vm.tringlymanGrid.Blocks.blank()`;

						const stackSource = compiler.source;
						compiler.source = originalSource;
						return new imports.TypedInput(
							stackSource.replaceAll("\t", ""),
							imports.TYPE_UNKNOWN,
						);
					},
					blankSize: (node, compiler, imports) => {
						const originalSource = compiler.source;

						const x = compiler.descendInput(node.x).asNumber();
						const y = compiler.descendInput(node.y).asNumber();

						compiler.source = `Scratch.vm.tringlymanGrid.Blocks.blankSize({x: ${x}, y: ${y}})`;

						const stackSource = compiler.source;
						compiler.source = originalSource;
						return new imports.TypedInput(
							stackSource.replaceAll("\t", ""),
							imports.TYPE_UNKNOWN,
						);
					},
					parse: (node, compiler, imports) => {
						const originalSource = compiler.source;

						const VALUE = compiler.descendInput(node.VALUE).asUnknown();

						compiler.source = `Scratch.vm.tringlymanGrid.Blocks.parse({VALUE: ${VALUE}})`;

						const stackSource = compiler.source;
						compiler.source = originalSource;
						return new imports.TypedInput(
							stackSource.replaceAll("\t", ""),
							imports.TYPE_UNKNOWN,
						);
					},
					currentGrid: (node, compiler, imports) => {
						const originalSource = compiler.source;

						compiler.source = `Scratch.vm.tringlymanGrid.Blocks.currentGrid(null, {thread})`;

						const stackSource = compiler.source;
						compiler.source = originalSource;
						return new imports.TypedInput(stackSource, imports.TYPE_UNKNOWN);
					},
					builder: (node, compiler, imports) => {
						const originalSource = compiler.source;
						compiler.source =
							"Scratch.vm.tringlymanGrid.Type.toGrid(yield* (function*() {\n";
						compiler.source += `thread._tringlymanGridBuilderIndex ??= [];\n`;
						compiler.source += `thread._tringlymanGridBuilderIndex.push(new Scratch.vm.tringlymanGrid.Type(Scratch.vm.tringlymanGrid.Type.Blank()));\n`;
						compiler.descendStack(
							node.substack,
							new imports.Frame(false, undefined, true),
						);
						compiler.source += `return thread._tringlymanGridBuilderIndex.pop();\n`;
						compiler.source += "})())";
						const stackSource = compiler.source;
						compiler.source = originalSource;
						return new imports.TypedInput(stackSource, imports.TYPE_UNKNOWN);
					},
					builderAppend: (node, compiler, imports) => {
						const x = compiler.descendInput(node.x).asNumber();
						const y = compiler.descendInput(node.y).asNumber();
						const VALUE = compiler.descendInput(node.VALUE).asUnknown();
						compiler.source += `Scratch.vm.tringlymanGrid.Blocks.builderAppend({x: ${x}, y: ${y}, VALUE: ${VALUE}}, {thread});\n`;
					},
					builderAppendEmpty: (node, compiler, imports) => {
						const x = compiler.descendInput(node.x).asNumber();
						const y = compiler.descendInput(node.y).asNumber();
						compiler.source += `Scratch.vm.tringlymanGrid.Blocks.builderAppendEmpty({x: ${x}, y: ${y}}, {thread});\n`;
					},
					builderSet: (node, compiler, imports) => {
						const grid = compiler.descendInput(node.grid).asUnknown();
						compiler.source += `Scratch.vm.tringlymanGrid.Blocks.builderSet({grid: ${grid}}, {thread});\n`;
					},
					append: (node, compiler, imports) => {
						const originalSource = compiler.source;

						const x = compiler.descendInput(node.x).asNumber();
						const y = compiler.descendInput(node.y).asNumber();
						const VALUE = compiler.descendInput(node.VALUE).asUnknown();
						const grid = compiler.descendInput(node.grid).asUnknown();

						compiler.source = `Scratch.vm.tringlymanGrid.Blocks.append({x: ${x}, y: ${y}, VALUE: ${VALUE}, grid: ${grid}})`;

						const stackSource = compiler.source;
						compiler.source = originalSource;
						return new imports.TypedInput(stackSource, imports.TYPE_UNKNOWN);
					},
					shift: (node, compiler, imports) => {
						const originalSource = compiler.source;

						const x = compiler.descendInput(node.x).asNumber();
						const y = compiler.descendInput(node.y).asNumber();
						const grid = compiler.descendInput(node.grid).asUnknown();

						compiler.source = `Scratch.vm.tringlymanGrid.Blocks.shift({x: ${x}, y: ${y}, grid: ${grid}})`;

						const stackSource = compiler.source;
						compiler.source = originalSource;
						return new imports.TypedInput(stackSource, imports.TYPE_UNKNOWN);
					},
					crop: (node, compiler, imports) => {
						const originalSource = compiler.source;

						const x1 = compiler.descendInput(node.x1).asNumber();
						const y1 = compiler.descendInput(node.y1).asNumber();
						const x2 = compiler.descendInput(node.x2).asNumber();
						const y2 = compiler.descendInput(node.y2).asNumber();
						const grid = compiler.descendInput(node.grid).asUnknown();

						compiler.source = `Scratch.vm.tringlymanGrid.Blocks.crop({x1: ${x1}, y1: ${y1}, x2: ${x2}, y2: ${y2}, grid: ${grid}})`;

						const stackSource = compiler.source;
						compiler.source = originalSource;
						return new imports.TypedInput(stackSource, imports.TYPE_UNKNOWN);
					},
					trim: (node, compiler, imports) => {
						const originalSource = compiler.source;

						const grid = compiler.descendInput(node.grid).asUnknown();

						compiler.source = `Scratch.vm.tringlymanGrid.Blocks.trim({grid: ${grid}})`;

						const stackSource = compiler.source;
						compiler.source = originalSource;
						return new imports.TypedInput(stackSource, imports.TYPE_UNKNOWN);
					},
					removeXY: (node, compiler, imports) => {
						const originalSource = compiler.source;

						const axis = node.axis;
						const xy = compiler.descendInput(node.xy).asNumber();
						const grid = compiler.descendInput(node.grid).asUnknown();

						compiler.source = `Scratch.vm.tringlymanGrid.Blocks.removeXY({axis: "${axis}", xy: ${xy}, grid: ${grid}})`;

						const stackSource = compiler.source;
						compiler.source = originalSource;
						return new imports.TypedInput(stackSource, imports.TYPE_UNKNOWN);
					},
					get: (node, compiler, imports) => {
						const originalSource = compiler.source;

						const x = compiler.descendInput(node.x).asNumber();
						const y = compiler.descendInput(node.y).asNumber();
						const grid = compiler.descendInput(node.grid).asUnknown();

						compiler.source = `Scratch.vm.tringlymanGrid.Blocks.get({x: ${x}, y: ${y}, grid: ${grid}})`;

						const stackSource = compiler.source;
						compiler.source = originalSource;
						return new imports.TypedInput(stackSource, imports.TYPE_UNKNOWN);
					},
					length: (node, compiler, imports) => {
						const originalSource = compiler.source;

						const grid = compiler.descendInput(node.grid).asUnknown();

						compiler.source = `Scratch.vm.tringlymanGrid.Blocks.length({grid: ${grid}})`;

						const stackSource = compiler.source;
						compiler.source = originalSource;
						return new imports.TypedInput(stackSource, imports.TYPE_UNKNOWN);
					},
					lengthAxis: (node, compiler, imports) => {
						const originalSource = compiler.source;

						const axis = node.axis;
						const grid = compiler.descendInput(node.grid).asUnknown();

						compiler.source = `Scratch.vm.tringlymanGrid.Blocks.lengthAxis({axis: "${axis}", grid: ${grid}})`;

						const stackSource = compiler.source;
						compiler.source = originalSource;
						return new imports.TypedInput(stackSource, imports.TYPE_UNKNOWN);
					},
					toString: (node, compiler, imports) => {
						const originalSource = compiler.source;

						const format = node.format;
						const grid = compiler.descendInput(node.grid).asUnknown();

						compiler.source = `Scratch.vm.tringlymanGrid.Blocks.toString({format: ${format}, grid: ${grid}})`;

						const stackSource = compiler.source;
						compiler.source = originalSource;
						return new imports.TypedInput(stackSource, imports.TYPE_UNKNOWN);
					},
					forEachIX: (node, compiler, imports) => {
						const originalSource = compiler.source;

						compiler.source = `Scratch.vm.tringlymanGrid.Blocks.forEachIX(null, {thread})`;

						const stackSource = compiler.source;
						compiler.source = originalSource;
						return new imports.TypedInput(stackSource, imports.TYPE_UNKNOWN);
					},
					forEachIY: (node, compiler, imports) => {
						const originalSource = compiler.source;

						compiler.source = `Scratch.vm.tringlymanGrid.Blocks.forEachIY(null, {thread})`;

						const stackSource = compiler.source;
						compiler.source = originalSource;
						return new imports.TypedInput(stackSource, imports.TYPE_UNKNOWN);
					},
					forEachV: (node, compiler, imports) => {
						const originalSource = compiler.source;

						compiler.source = `Scratch.vm.tringlymanGrid.Blocks.forEachV(null, {thread})`;
						compiler.source = `Scratch.vm.tringlymanGrid.Blocks.forEachV(null, {thread})`;

						const stackSource = compiler.source;
						compiler.source = originalSource;
						return new imports.TypedInput(stackSource, imports.TYPE_UNKNOWN);
					},
					forEach: (node, compiler, imports) => {
						const grid = compiler.localVariables.next();
						compiler.source += `let ${grid} = Scratch.vm.tringlymanGrid.Type.toGrid(${compiler.descendInput(node.grid).asUnknown()}, true).grid;\n`;
						compiler.source += `thread._tringlymanGridForEach ??= [];\n`;
						const forIndex = compiler.localVariables.next();
						compiler.source += `let ${forIndex} = thread._tringlymanGridForEach.push([]) - 1;\n`;
						const indexX = compiler.localVariables.next();
						const indexY = compiler.localVariables.next();
						const X = compiler.localVariables.next();
						const Y = compiler.localVariables.next();
						const output = compiler.localVariables.next();
						compiler.source += `let ${output} = yield* (function* () {for (let [${indexY}, ${Y}] of ${grid}.map((v, i) => [i, v])) {\n`;
						compiler.source += `for (let [${indexX}, ${X}] of ${Y}.map((v, i) => [i, v])) {\n`;
						compiler.source += `thread._tringlymanGridForEach[${forIndex}] = [{x: Number(${indexX}) + 1, y: Number(${indexY}) + 1}, ${X}];\n`;
						compiler.descendStack(
							node.substack,
							new imports.Frame(true, undefined, true),
						);
						compiler.yieldLoop();
						compiler.source += "}}})();\n";
						compiler.source += `thread._tringlymanGridForEach.pop();\n`;
						compiler.source += `if (${output} !== undefined) {\n`;
						compiler.source += `return ${output};\n`;
						compiler.source += `};\n`;
					},
				},
			};
		}
	}

	Scratch.extensions.register(new Extension());
})(Scratch);
