(function (Scratch) {
	class tringlymanSVGType {
		constructor(viewBox, HTMLText, isHTMLTextSVGString = false) {
			this.viewBox = viewBox;
			this.isHTMLTextSVGString = isHTMLTextSVGString;
			this.HTMLText = HTMLText;
		}

		static jwXMLtoSVG(XML) {
			return new tringlymanSVGType(
				null,
				vm.jwXML.Type.toXML(XML).toString(),
				true,
			);
		}

		toString() {
			return this.toReporterContent().outerHTML;
		}

		toReporterContent() {
			let svgText = "";
			if (this.isHTMLTextSVGString) {
				svgText = this.HTMLText;
			} else {
				svgText += `<svg version="1.1" baseProfile="full" width="${this.viewBox[0]}" height="${this.viewBox[1]}" viewBox="0 0 ${this.viewBox[0]} ${this.viewBox[1]}" xmlns="http://www.w3.org/2000/svg">`;
				svgText += this.HTMLText;
				svgText += `</svg>`.trim();
			}

			const doc = new DOMParser().parseFromString(svgText, "image/svg+xml");
			if (doc.getElementsByTagName("parsererror").length > 0) {
				throw new Error("Invalid SVG XML in toReporterContent.");
			}
			return doc.documentElement;
		}
	}

	const tringlymanSVG = {
		Type: tringlymanSVGType,
	};

	class Extension {
		constructor() {
			Scratch.vm.tringlymanSVG = tringlymanSVG;
			vm.extensionManager.loadExtensionURL("jwXML");
			vm.runtime.registerCompiledExtensionBlocks(
				"tringlymanSVG",
				this.getCompileInfo(),
			);
		}
		getInfo() {
			return {
				id: "tringlymanSVG",
				name: "SVG",
				color1: "#d4b800",
				menuIconURI:
					"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzMDAgMzAwIj4KICA8cmVjdCB4PSIyNjUuNDEzIiB5PSI2ODMuOCIgd2lkdGg9IjMwMC4wMDMiIGhlaWdodD0iMjk5Ljk3NSIgcng9IjM2MCIgcnk9IjM2MCIgc3R5bGU9InRyYW5zZm9ybS1ib3g6IGZpbGwtYm94OyB0cmFuc2Zvcm0tb3JpZ2luOiA1MCUgNTAlOyBmaWxsOiByZ2IoMTcwLCAxNDcsIDApOyIgdHJhbnNmb3JtPSJtYXRyaXgoMSwgMC4wMDAwODQsIC0wLjAwMDA4NCwgMSwgLTI2NS40MjUxNzksIC02ODMuNzg3NDk4KSI+PC9yZWN0PgogIDxyZWN0IHg9IjExNS4zNTUiIHk9IjQxOC44MDgiIHdpZHRoPSIyNTAiIGhlaWdodD0iMjUwIiByeD0iMzYwIiByeT0iMzYwIiBzdHlsZT0iZmlsbDogcmdiKDIxMiwgMTg0LCAwKTsgdHJhbnNmb3JtLWJveDogZmlsbC1ib3g7IHRyYW5zZm9ybS1vcmlnaW46IDUwJSA1MCU7IiB0cmFuc2Zvcm09Im1hdHJpeCgxLCAtMC4wMDAwMzUsIDAuMDAwMDM1LCAxLCAtOTAuMzU1MDMxLCAtMzkzLjgwODAxNSkiPjwvcmVjdD4KICA8ZyB0cmFuc2Zvcm09Im1hdHJpeCgwLjc4MjAzMywgMCwgMCwgMC43ODE5OCwgNDkuOTk5OTc5LCA0OS44MTg0NjgpIj4KICAgIDxnPgogICAgICA8cGF0aCBkPSJNMjQ1LjIzNTM4LDE1My41MjM4MzEgQzI1OS4yNDY4NzMsMTM5LjUxMjMzOCAyNTkuMjQ2NDIzLDExNi43MTMwMTQgMjQ1LjIzNDkzLDEwMi43MDEwNyBDMjM4LjQ0Nzc3NSw5NS45MTM0NjQ4IDIyOS40MjI4NzMsOTIuMTc1Nzc0NiAyMTkuODIzNzc1LDkyLjE3NTc3NDYgQzIxNy41NDQ1NjMsOTIuMTc1Nzc0NiAyMTUuMzAwNTA3LDkyLjM4MzU0OTMgMjEzLjExMTg4Nyw5Mi43OTMyMzk0IEMyMjIuNjUwMTQxLDg2LjI2ODg0NTEgMjI4LjgzMTA5OSw3NS4yOTc4MDI4IDIyOC44MzEwOTksNjMuMDk4NTkxNSBDMjI4LjgzMTA5OSw0My4yODI5Mjk2IDIxMi43MDk4NTksMjcuMTYxNjkwMSAxOTIuODk0MTk3LDI3LjE2MTY5MDEgQzE4MC42NzA2NDgsMjcuMTYxNjkwMSAxNjkuNjgwNjc2LDMzLjM2NzQzNjYgMTYzLjE2MTIzOSw0Mi45Mzc2OTAxIEMxNjUuMzE4MzEsMzEuNTYwNTYzNCAxNjEuOTM0ODczLDE5LjQwMTAxNDEgMTUzLjI5MTcxOCwxMC43NTc4NTkyIEMxNDYuNTA0NTYzLDMuOTcwMjUzNTIgMTM3LjQ3OTY2MiwwLjIzMjExMjY3NiAxMjcuODgwNTYzLDAuMjMyMTEyNjc2IEMxMTguMjgxNDY1LDAuMjMyMTEyNjc2IDEwOS4yNTY1NjMsMy45NzAyNTM1MiAxMDIuNDY5NDA4LDEwLjc1Nzg1OTIgQzkzLjgyNTgwMjgsMTkuNDAxMDE0MSA5MC40NDI4MTY5LDMxLjU2MTAxNDEgOTIuNTk5ODg3Myw0Mi45MzgxNDA4IEM4Ni4wODA0NTA3LDMzLjM2Nzg4NzMgNzUuMDkwMDI4MiwyNy4xNjE2OTAxIDYyLjg2NjQ3ODksMjcuMTYxNjkwMSBDNDMuMDUwODE2OSwyNy4xNjE2OTAxIDI2LjkyOTU3NzUsNDMuMjgyOTI5NiAyNi45Mjk1Nzc1LDYzLjA5ODU5MTUgQzI2LjkyOTU3NzUsNzUuMjk4MjUzNSAzMy4xMTAwODQ1LDg2LjI2ODg0NTEgNDIuNjQ4MzM4LDkyLjc5Mjc4ODcgQzQwLjQ1OTcxODMsOTIuMzgzNTQ5MyAzOC4yMTY1NjM0LDkyLjE3NTc3NDYgMzUuOTM2OTAxNCw5Mi4xNzU3NzQ2IEMyNi4zMzc4MDI4LDkyLjE3NTc3NDYgMTcuMzEzMzUyMSw5NS45MTM5MTU1IDEwLjUyNTc0NjUsMTAyLjcwMTUyMSBDMy43MzgxNDA4NSwxMDkuNDg5MTI3IDAsMTE4LjUxNDAyOCAwLDEyOC4xMTI2NzYgQzAsMTM3LjcxMTc3NSAzLjczODE0MDg1LDE0Ni43MzYyMjUgMTAuNTI1NzQ2NSwxNTMuNTI0MjgyIEMxNy4zMTMzNTIxLDE2MC4zMTE0MzcgMjYuMzM4MjUzNSwxNjQuMDQ5NTc3IDM1LjkzNjkwMTQsMTY0LjA0OTU3NyBDMzguMjE2MTEyNywxNjQuMDQ5NTc3IDQwLjQ1OTI2NzYsMTYzLjg0MTgwMyA0Mi42NDgzMzgsMTYzLjQzMjExMyBDMzMuMTEwMDg0NSwxNjkuOTU2NTA3IDI2LjkyOTU3NzUsMTgwLjkyNzU0OSAyNi45Mjk1Nzc1LDE5My4xMjY3NjEgQzI2LjkyOTU3NzUsMjEyLjk0MjQyMyA0My4wNTA4MTY5LDIyOS4wNjMyMTEgNjIuODY2NDc4OSwyMjkuMDYzMjExIEM3NS4wOTAwMjgyLDIyOS4wNjMyMTEgODYuMDgwOTAxNCwyMjIuODU3NDY1IDkyLjU5OTg4NzMsMjEzLjI4NzIxMSBDOTAuNDQyODE2OSwyMjQuNjY0Nzg5IDkzLjgyNjI1MzUsMjM2LjgyNDc4OSAxMDIuNDY5NDA4LDI0NS40Njc5NDQgQzEwOS4yNTcwMTQsMjUyLjI1NTA5OSAxMTguMjgxOTE1LDI1NS45OTMyMzkgMTI3Ljg4MDU2MywyNTUuOTkzMjM5IEMxMzcuNDc5NjYyLDI1NS45OTMyMzkgMTQ2LjUwNDU2MywyNTIuMjU1MDk5IDE1My4yOTE3MTgsMjQ1LjQ2NzQ5MyBDMTYxLjkzNDg3MywyMzYuODI0MzM4IDE2NS4zMTc4NTksMjI0LjY2Mzg4NyAxNjMuMTYwNzg5LDIxMy4yODY3NjEgQzE2OS42ODAyMjUsMjIyLjg1NzAxNCAxODAuNjcwNjQ4LDIyOS4wNjMyMTEgMTkyLjg5NDE5NywyMjkuMDYzMjExIEMyMTIuNzA5ODU5LDIyOS4wNjMyMTEgMjI4LjgzMTA5OSwyMTIuOTQyNDIzIDIyOC44MzEwOTksMTkzLjEyNjc2MSBDMjI4LjgzMTA5OSwxODAuOTI3NTQ5IDIyMi42NTAxNDEsMTY5Ljk1NjUwNyAyMTMuMTEyMzM4LDE2My40MzIxMTMgQzIxNS4zMDA5NTgsMTYzLjg0MTgwMyAyMTcuNTQ0NTYzLDE2NC4wNDk1NzcgMjE5LjgyMzc3NSwxNjQuMDQ5NTc3IEMyMjkuNDIyODczLDE2NC4wNDk1NzcgMjM4LjQ0Nzc3NSwxNjAuMzExNDM3IDI0NS4yMzUzOCwxNTMuNTIzODMxIiBmaWxsPSIjMDAwMDAwIj48L3BhdGg+CiAgICAgIDxwYXRoIGQ9Ik0yMzQuMzkxNDM3LDExMy41MzgyNTQgQzIyNi4zNDIzMSwxMDUuNDg5NTc3IDIxMy4yOTIxNjksMTA1LjQ4OTU3NyAyMDUuMjQzMDQyLDExMy41MzgyNTQgTDE2My4wNTg5MywxMTMuNTM4MjU0IEwxOTIuODg3ODg3LDgzLjcwOTc0NjUgQzIwNC4yNzA4NzMsODMuNzA5NzQ2NSAyMTMuNDk4NTkyLDc0LjQ4MjAyODIgMjEzLjQ5ODU5Miw2My4wOTg1OTE1IEMyMTMuNDk4NTkyLDUxLjcxNTYwNTYgMjA0LjI3MDg3Myw0Mi40ODc0MzY2IDE5Mi44ODc4ODcsNDIuNDg3NDM2NiBDMTgxLjUwNDQ1MSw0Mi40ODc0MzY2IDE3Mi4yNzY3MzIsNTEuNzE1NjA1NiAxNzIuMjc2NzMyLDYzLjA5ODU5MTUgTDE0Mi40NDgyMjUsOTIuOTI3NTQ5MyBMMTQyLjQ0ODIyNSw1MC43NDM0MzY2IEMxNTAuNDk2OTAxLDQyLjY5NDMwOTkgMTUwLjQ5NjkwMSwyOS42NDQxNjkgMTQyLjQ0Nzc3NSwyMS41OTUwNDIzIEMxMzQuMzk4NjQ4LDEzLjU0NTkxNTUgMTIxLjM0ODUwNywxMy41NDU5MTU1IDExMy4yOTkzOCwyMS41OTUwNDIzIEMxMDUuMjUwMjU0LDI5LjY0NDE2OSAxMDUuMjUwMjU0LDQyLjY5NDMwOTkgMTEzLjI5OTM4LDUwLjc0MzQzNjYgTDExMy4yOTkzOCw5Mi45Mjc1NDkzIEw4My40NzA4NzMyLDYzLjA5ODU5MTUgQzgzLjQ3MDg3MzIsNTEuNzE1NjA1NiA3NC4yNDMxNTQ5LDQyLjQ4NzQzNjYgNjIuODU5NzE4Myw0Mi40ODc0MzY2IEM1MS40NzY3MzI0LDQyLjQ4NzQzNjYgNDIuMjQ4NTYzNCw1MS43MTU2MDU2IDQyLjI0ODU2MzQsNjMuMDk4NTkxNSBDNDIuMjQ4NTYzNCw3NC40ODIwMjgyIDUxLjQ3NjczMjQsODMuNzA5NzQ2NSA2Mi44NTk3MTgzLDgzLjcwOTc0NjUgTDkyLjY4ODIyNTQsMTEzLjUzODI1NCBMNTAuNTA0NTYzNCwxMTMuNTM4MjU0IEM0Mi40NTQ5ODU5LDEwNS40ODkxMjcgMjkuNDA0ODQ1MSwxMDUuNDg5NTc3IDIxLjM1NTcxODMsMTEzLjUzODcwNCBDMTMuMzA2NTkxNSwxMjEuNTg3ODMxIDEzLjMwNjU5MTUsMTM0LjYzNzk3MiAyMS4zNTU3MTgzLDE0Mi42ODcwOTkgQzI5LjQwNDg0NTEsMTUwLjczNjIyNSA0Mi40NTU0MzY2LDE1MC43MzYyMjUgNTAuNTA0NTYzNCwxNDIuNjg3MDk5IEw5Mi42ODgyMjU0LDE0Mi42ODcwOTkgTDYyLjg1OTcxODMsMTcyLjUxNTYwNiBDNTEuNDc2NzMyNCwxNzIuNTE1NjA2IDQyLjI0ODU2MzQsMTgxLjc0MzMyNCA0Mi4yNDg1NjM0LDE5My4xMjY3NjEgQzQyLjI0ODU2MzQsMjA0LjUwOTc0NiA1MS40NzY3MzI0LDIxMy43Mzc5MTUgNjIuODU5NzE4MywyMTMuNzM3OTE1IEM3NC4yNDMxNTQ5LDIxMy43Mzc5MTUgODMuNDcwODczMiwyMDQuNTA5NzQ2IDgzLjQ3MDg3MzIsMTkzLjEyNjc2MSBMMTEzLjI5OTM4LDE2My4yOTgyNTQgTDExMy4yOTkzOCwyMDUuNDgxOTE1IEMxMDUuMjUwMjU0LDIxMy41MzEwNDIgMTA1LjI1MDI1NCwyMjYuNTgxNjM0IDExMy4yOTkzOCwyMzQuNjMwNzYxIEMxMjEuMzQ4NTA3LDI0Mi42Nzk4ODcgMTM0LjM5OTA5OSwyNDIuNjc5ODg3IDE0Mi40NDgyMjUsMjM0LjYzMDc2MSBDMTUwLjQ5NjkwMSwyMjYuNTgxNjM0IDE1MC40OTY5MDEsMjEzLjUzMTA0MiAxNDIuNDQ4MjI1LDIwNS40ODE5MTUgTDE0Mi40NDgyMjUsMTYzLjI5ODI1NCBMMTcyLjI3NjczMiwxOTMuMTI2NzYxIEMxNzIuMjc2NzMyLDIwNC41MDk3NDYgMTgxLjUwNDQ1MSwyMTMuNzM3OTE1IDE5Mi44ODc4ODcsMjEzLjczNzkxNSBDMjA0LjI3MDg3MywyMTMuNzM3OTE1IDIxMy40OTg1OTIsMjA0LjUwOTc0NiAyMTMuNDk4NTkyLDE5My4xMjY3NjEgQzIxMy40OTg1OTIsMTgxLjc0MzMyNCAyMDQuMjcwODczLDE3Mi41MTU2MDYgMTkyLjg4Nzg4NywxNzIuNTE1NjA2IEwxNjMuMDU4OTMsMTQyLjY4NzA5OSBMMjA1LjI0MzA0MiwxNDIuNjg3MDk5IEMyMTMuMjkyMTY5LDE1MC43MzYyMjUgMjI2LjM0MjMxLDE1MC43MzYyMjUgMjM0LjM5MTQzNywxNDIuNjg3MDk5IEMyNDIuNDQwNTYzLDEzNC42Mzc5NzIgMjQyLjQ0MDU2MywxMjEuNTg3MzggMjM0LjM5MTQzNywxMTMuNTM4MjU0IiBmaWxsPSIjRkZCMTNCIj48L3BhdGg+CiAgICA8L2c+CiAgPC9nPgo8L3N2Zz4=",
				blocks: [
					{
						opcode: "jwXMLtoSVG",
						blockType: Scratch.BlockType.REPORTER,
						text: "jwXML [jwXML] to SVG",
						arguments: {
							jwXML: vm.jwXML?.Argument,
						},
					},
					"---",
					{
						opcode: "viewBox",
						hideFromPalette: true,
						canDragDuplicate: true,
						disableMonitor: true,
						...vm.jwArray?.Block,
					},
					{
						opcode: "blankSVG",
						blockType: Scratch.BlockType.REPORTER,
						text: "blank SVG [sep] [viewBox] = [width]×[height]",
						arguments: {
							sep: {
								type: Scratch.ArgumentType.SEPERATOR,
							},
							viewBox: {
								fillIn: "viewBox",
							},
							width: {
								type: Scratch.ArgumentType.NUMBER,
								defaultValue: 100,
							},
							height: {
								type: Scratch.ArgumentType.NUMBER,
								defaultValue: 100,
							},
						},
					},
					{
						opcode: "SVGBuilder",
						blockType: Scratch.BlockType.REPORTER,
						text: ["SVG builder [sep] [viewBox] = [width]×[height]"],
						arguments: {
							sep: {
								type: Scratch.ArgumentType.SEPERATOR,
							},
							viewBox: {
								fillIn: "viewBox",
							},
							width: {
								type: Scratch.ArgumentType.NUMBER,
								defaultValue: 100,
							},
							height: {
								type: Scratch.ArgumentType.NUMBER,
								defaultValue: 100,
							},
						},
						branchCount: 1,
						branches: [{}],
					},
					"---",
					{
						opcode: "pathBuilder",
						blockType: Scratch.BlockType.CONDITIONAL,
						text: ["path builder", "close path (Z): [ZBool]"],
						arguments: {
							ZBool: {
								type: Scratch.ArgumentType.BOOLEAN,
							},
						},
					},
					{
						opcode: "MPathCommand",
						blockType: Scratch.BlockType.COMMAND,
						text: "path command |M| [relative_absolute] [sep] x = [x] y = [y]",
						arguments: {
							sep: {
								type: Scratch.ArgumentType.SEPERATOR,
							},
							relative_absolute: {
								menu: "relative_absolute",
							},
							x: {
								type: Scratch.ArgumentType.NUMBER,
							},
							y: {
								type: Scratch.ArgumentType.NUMBER,
							},
						},
					},
					{
						opcode: "LPathCommand",
						blockType: Scratch.BlockType.COMMAND,
						text: "path command |L| [relative_absolute] [sep] x = [x] y = [y]",
						arguments: {
							sep: {
								type: Scratch.ArgumentType.SEPERATOR,
							},
							relative_absolute: {
								menu: "relative_absolute",
							},
							x: {
								type: Scratch.ArgumentType.NUMBER,
							},
							y: {
								type: Scratch.ArgumentType.NUMBER,
							},
						},
					},
					{
						opcode: "HPathCommand",
						blockType: Scratch.BlockType.COMMAND,
						text: "path command |H| [relative_absolute] [sep] x = [x]",
						arguments: {
							sep: {
								type: Scratch.ArgumentType.SEPERATOR,
							},
							relative_absolute: {
								menu: "relative_absolute",
							},
							x: {
								type: Scratch.ArgumentType.NUMBER,
							},
						},
					},
					{
						opcode: "VPathCommand",
						blockType: Scratch.BlockType.COMMAND,
						text: "path command |V| [relative_absolute] [sep] y = [y]",
						arguments: {
							sep: {
								type: Scratch.ArgumentType.SEPERATOR,
							},
							relative_absolute: {
								menu: "relative_absolute",
							},
							y: {
								type: Scratch.ArgumentType.NUMBER,
							},
						},
					},
					{
						opcode: "QPathCommand",
						blockType: Scratch.BlockType.COMMAND,
						text: "path command |Q| [relative_absolute] [sep] x1 = [x1] y1 = [y1] x = [x] y = [y]",
						arguments: {
							sep: {
								type: Scratch.ArgumentType.SEPERATOR,
							},
							relative_absolute: {
								menu: "relative_absolute",
							},
							x1: {
								type: Scratch.ArgumentType.NUMBER,
							},
							y1: {
								type: Scratch.ArgumentType.NUMBER,
							},
							x: {
								type: Scratch.ArgumentType.NUMBER,
							},
							y: {
								type: Scratch.ArgumentType.NUMBER,
							},
						},
					},
					{
						opcode: "SPathCommand",
						blockType: Scratch.BlockType.COMMAND,
						text: "path command |S| [relative_absolute] [sep] x1 = [x1] y1 = [y1] x = [x] y = [y]",
						arguments: {
							sep: {
								type: Scratch.ArgumentType.SEPERATOR,
							},
							relative_absolute: {
								menu: "relative_absolute",
							},
							x1: {
								type: Scratch.ArgumentType.NUMBER,
							},
							y1: {
								type: Scratch.ArgumentType.NUMBER,
							},
							x: {
								type: Scratch.ArgumentType.NUMBER,
							},
							y: {
								type: Scratch.ArgumentType.NUMBER,
							},
						},
					},
					{
						opcode: "CPathCommand",
						blockType: Scratch.BlockType.COMMAND,
						text: "path command |C| [relative_absolute] [sep] x1 = [x1] y1 = [y1] x2 = [x2] y2 = [y2] x = [x] y = [y]",
						arguments: {
							sep: {
								type: Scratch.ArgumentType.SEPERATOR,
							},
							relative_absolute: {
								menu: "relative_absolute",
							},
							x1: {
								type: Scratch.ArgumentType.NUMBER,
							},
							y1: {
								type: Scratch.ArgumentType.NUMBER,
							},
							x2: {
								type: Scratch.ArgumentType.NUMBER,
							},
							y2: {
								type: Scratch.ArgumentType.NUMBER,
							},
							x: {
								type: Scratch.ArgumentType.NUMBER,
							},
							y: {
								type: Scratch.ArgumentType.NUMBER,
							},
						},
					},
					{
						opcode: "TPathCommand",
						blockType: Scratch.BlockType.COMMAND,
						text: "path command |T| [relative_absolute] [sep] x = [x] y = [y]",
						arguments: {
							sep: {
								type: Scratch.ArgumentType.SEPERATOR,
							},
							relative_absolute: {
								menu: "relative_absolute",
							},
							x: {
								type: Scratch.ArgumentType.NUMBER,
							},
							y: {
								type: Scratch.ArgumentType.NUMBER,
							},
						},
					},
					{
						opcode: "APathCommand",
						blockType: Scratch.BlockType.COMMAND,
						text: "path command |A| [relative_absolute] [sep] rx = [rx] ry = [ry] x-axis-rotation = [xAxisRotation] large-arc-flag = [largeArcFlag] sweep-flag = [sweepFlag] x = [x] y = [y]",
						arguments: {
							sep: {
								type: Scratch.ArgumentType.SEPERATOR,
							},
							relative_absolute: {
								menu: "relative_absolute",
							},
							rx: {
								type: Scratch.ArgumentType.NUMBER,
							},
							ry: {
								type: Scratch.ArgumentType.NUMBER,
							},
							xAxisRotation: {
								type: Scratch.ArgumentType.ANGLE,
							},
							largeArcFlag: {
								type: Scratch.ArgumentType.BOOLEAN,
							},
							sweepFlag: {
								type: Scratch.ArgumentType.BOOLEAN,
							},
							x: {
								type: Scratch.ArgumentType.NUMBER,
							},
							y: {
								type: Scratch.ArgumentType.NUMBER,
							},
						},
					},
					"---",
					{
						opcode: "lineTag",
						blockType: Scratch.BlockType.COMMAND,
						text: "line [sep] x1 = [x1] y1 = [y1] x2 =[x2] y2 = [y2]",
						arguments: {
							sep: {
								type: Scratch.ArgumentType.SEPERATOR,
							},
							x1: {
								type: Scratch.ArgumentType.NUMBER,
								defaultValue: 0,
							},
							y1: {
								type: Scratch.ArgumentType.NUMBER,
								defaultValue: 0,
							},
							x2: {
								type: Scratch.ArgumentType.NUMBER,
								defaultValue: 10,
							},
							y2: {
								type: Scratch.ArgumentType.NUMBER,
								defaultValue: 10,
							},
						},
					},
					{
						opcode: "rectTag",
						blockType: Scratch.BlockType.COMMAND,
						text: "rect [sep] x = [x] y = [y] width =[width] height = [height]",
						arguments: {
							sep: {
								type: Scratch.ArgumentType.SEPERATOR,
							},
							x: {
								type: Scratch.ArgumentType.NUMBER,
								defaultValue: 0,
							},
							y: {
								type: Scratch.ArgumentType.NUMBER,
								defaultValue: 0,
							},
							width: {
								type: Scratch.ArgumentType.NUMBER,
								defaultValue: 10,
							},
							height: {
								type: Scratch.ArgumentType.NUMBER,
								defaultValue: 10,
							},
						},
					},
					{
						opcode: "circleTag",
						blockType: Scratch.BlockType.COMMAND,
						text: "circle [sep] cx = [cx] cy = [cy] r =[r]",
						arguments: {
							sep: {
								type: Scratch.ArgumentType.SEPERATOR,
							},
							cx: {
								type: Scratch.ArgumentType.NUMBER,
								defaultValue: 10,
							},
							cy: {
								type: Scratch.ArgumentType.NUMBER,
								defaultValue: 10,
							},
							r: {
								type: Scratch.ArgumentType.NUMBER,
								defaultValue: 10,
							},
						},
					},
					{
						opcode: "ellipseTag",
						blockType: Scratch.BlockType.COMMAND,
						text: "ellipse [sep] cx = [cx] cy = [cy] rx = [rx] ry = [ry]",
						arguments: {
							sep: {
								type: Scratch.ArgumentType.SEPERATOR,
							},
							cx: {
								type: Scratch.ArgumentType.NUMBER,
								defaultValue: 10,
							},
							cy: {
								type: Scratch.ArgumentType.NUMBER,
								defaultValue: 10,
							},
							rx: {
								type: Scratch.ArgumentType.NUMBER,
								defaultValue: 10,
							},
							ry: {
								type: Scratch.ArgumentType.NUMBER,
								defaultValue: 10,
							},
						},
					},
					{
						opcode: "polygonTag",
						blockType: Scratch.BlockType.COMMAND,
						text: "polygon [sep] points = [points]",
						arguments: {
							sep: {
								type: Scratch.ArgumentType.SEPERATOR,
							},
							points: {
								type: Scratch.ArgumentType.STRING,
								defaultValue: "50,25 50,25 75,75 25,75",
							},
						},
					},
				],
				menus: {
					relative_absolute: {
						acceptReporters: false,
						items: [
							{
								text: "absolute",
								value: "true",
							},
							{
								text: "relative",
								value: "false",
							},
						],
					},
				},
			};
		}

		getCompileInfo() {
			return {
				ir: {
					jwXMLtoSVG(generator, block) {
						return {
							kind: "input",
							jwXML: generator.descendInputOfBlock(block, "jwXML"),
						};
					},
					viewBox(generator, block) {
						return {
							kind: "input",
						};
					},
					SVGBuilder(generator, block) {
						return {
							kind: "input",
							width: generator.descendInputOfBlock(block, "width"),
							height: generator.descendInputOfBlock(block, "height"),
							substack: generator.descendSubstack(block, "SUBSTACK"),
						};
					},
					blankSVG(generator, block) {
						return {
							kind: "input",
							width: generator.descendInputOfBlock(block, "width"),
							height: generator.descendInputOfBlock(block, "height"),
						};
					},
					pathBuilder(generator, block) {
						return {
							kind: "stack",
							ZBool: generator.descendInputOfBlock(block, "ZBool"),
							substack: generator.descendSubstack(block, "SUBSTACK"),
						};
					},
					MPathCommand(generator, block) {
						return {
							kind: "stack",
							relative: block.fields["relative_absolute"].value,
							x: generator.descendInputOfBlock(block, "x"),
							y: generator.descendInputOfBlock(block, "y"),
						};
					},
					LPathCommand(generator, block) {
						return {
							kind: "stack",
							relative: block.fields["relative_absolute"].value,
							x: generator.descendInputOfBlock(block, "x"),
							y: generator.descendInputOfBlock(block, "y"),
						};
					},
					HPathCommand(generator, block) {
						return {
							kind: "stack",
							relative: block.fields["relative_absolute"].value,
							x: generator.descendInputOfBlock(block, "x"),
						};
					},
					VPathCommand(generator, block) {
						return {
							kind: "stack",
							relative: block.fields["relative_absolute"].value,
							y: generator.descendInputOfBlock(block, "y"),
						};
					},
					QPathCommand(generator, block) {
						return {
							kind: "stack",
							relative: block.fields["relative_absolute"].value,
							x1: generator.descendInputOfBlock(block, "x1"),
							y1: generator.descendInputOfBlock(block, "y1"),
							x: generator.descendInputOfBlock(block, "x"),
							y: generator.descendInputOfBlock(block, "y"),
						};
					},
					SPathCommand(generator, block) {
						return {
							kind: "stack",
							relative: block.fields["relative_absolute"].value,
							x1: generator.descendInputOfBlock(block, "x1"),
							y1: generator.descendInputOfBlock(block, "y1"),
							x: generator.descendInputOfBlock(block, "x"),
							y: generator.descendInputOfBlock(block, "y"),
						};
					},
					CPathCommand(generator, block) {
						return {
							kind: "stack",
							relative: block.fields["relative_absolute"].value,
							x1: generator.descendInputOfBlock(block, "x1"),
							y1: generator.descendInputOfBlock(block, "y1"),
							x2: generator.descendInputOfBlock(block, "x2"),
							y2: generator.descendInputOfBlock(block, "y2"),
							x: generator.descendInputOfBlock(block, "x"),
							y: generator.descendInputOfBlock(block, "y"),
						};
					},
					TPathCommand(generator, block) {
						return {
							kind: "stack",
							relative: block.fields["relative_absolute"].value,
							x: generator.descendInputOfBlock(block, "x"),
							y: generator.descendInputOfBlock(block, "y"),
						};
					},
					APathCommand(generator, block) {
						return {
							kind: "stack",
							relative: block.fields["relative_absolute"].value,
							rx: generator.descendInputOfBlock(block, "rx"),
							ry: generator.descendInputOfBlock(block, "ry"),
							xAxisRotation: generator.descendInputOfBlock(
								block,
								"xAxisRotation",
							),
							largeArcFlag: generator.descendInputOfBlock(
								block,
								"largeArcFlag",
							),
							sweepFlag: generator.descendInputOfBlock(block, "sweepFlag"),
							x: generator.descendInputOfBlock(block, "x"),
							y: generator.descendInputOfBlock(block, "y"),
						};
					},
					lineTag(generator, block) {
						return {
							kind: "stack",
							x1: generator.descendInputOfBlock(block, "x1"),
							y1: generator.descendInputOfBlock(block, "y1"),
							x2: generator.descendInputOfBlock(block, "x2"),
							y2: generator.descendInputOfBlock(block, "y2"),
						};
					},
					rectTag(generator, block) {
						return {
							kind: "stack",
							x: generator.descendInputOfBlock(block, "x"),
							y: generator.descendInputOfBlock(block, "y"),
							width: generator.descendInputOfBlock(block, "width"),
							height: generator.descendInputOfBlock(block, "height"),
						};
					},
					circleTag(generator, block) {
						return {
							kind: "stack",
							cx: generator.descendInputOfBlock(block, "cx"),
							cy: generator.descendInputOfBlock(block, "cy"),
							r: generator.descendInputOfBlock(block, "r"),
						};
					},
					ellipseTag(generator, block) {
						return {
							kind: "stack",
							cx: generator.descendInputOfBlock(block, "cx"),
							cy: generator.descendInputOfBlock(block, "cy"),
							rx: generator.descendInputOfBlock(block, "rx"),
							ry: generator.descendInputOfBlock(block, "ry"),
						};
					},
					polygonTag(generator, block) {
						return {
							kind: "stack",
							points: generator.descendInputOfBlock(block, "points"),
						};
					},
				},
				js: {
					jwXMLtoSVG(node, compiler, imports) {
						return new imports.TypedInput(
							`vm.tringlymanSVG.Type.jwXMLtoSVG(${compiler.descendInput(node.jwXML).asUnknown()})`,
							imports.TYPE_UNKNOWN,
						);
					},
					viewBox(node, compiler, imports) {
						const bi = compiler.localVariables.next();

						return new imports.TypedInput(
							`(yield* (function* () {\n` +
								`let ${bi} = thread._tringlymanSVGBuilderViewBox;\n` +
								`if (${bi} && ${bi}.length > 0) {\n` +
								`return vm.jwArray ? vm.jwArray.Type.toArray(${bi}[${bi}.length - 1]) : ${bi}[${bi}.length - 1];\n` +
								`} else {\n` +
								`return vm.jwArray ? vm.jwArray.Type.toArray([0, 0]) : [0, 0];\n` +
								`};\n` +
								`})())`,
							imports.TYPE_UNKNOWN,
						);
					},
					blankSVG(node, compiler, imports) {
						const originalSource = compiler.source;

						let viewBox = `[`;
						viewBox += `${compiler.descendInput(node.width).asNumber()},`;
						viewBox += `${compiler.descendInput(node.height).asNumber()},`;
						viewBox += `]`;

						compiler.source = `new vm.tringlymanSVG.Type(${viewBox}, "")`;

						const stackedSource = compiler.source;
						compiler.source = originalSource;

						return new imports.TypedInput(stackedSource, imports.TYPE_UNKNOWN);
					},
					SVGBuilder(node, compiler, imports) {
						const originalSource = compiler.source;

						let viewBox = `[`;
						viewBox += `${compiler.descendInput(node.width).asNumber()},`;
						viewBox += `${compiler.descendInput(node.height).asNumber()},`;
						viewBox += `]`;

						compiler.source = `new vm.tringlymanSVG.Type(${viewBox}, \n`;
						compiler.source += `yield* (function* () {\n`;
						compiler.source += `thread._tringlymanSVGBuilderViewBox ??= [];\n`;
						compiler.source += `thread._tringlymanSVGBuilderViewBox.push(${viewBox});\n`;
						compiler.source += `thread._tringlymanSVGBuilderIndex ??= [];\n`;
						compiler.source += `thread._tringlymanSVGBuilderIndex.push(document.createElement("svg"));\n`;
						compiler.descendStack(
							node.substack,
							new imports.Frame(false, undefined, true),
						);
						compiler.source += `return thread._tringlymanSVGBuilderIndex.pop().innerHTML;\n`;
						compiler.source += `})())`;

						const stackedSource = compiler.source;
						compiler.source = originalSource;

						return new imports.TypedInput(stackedSource, imports.TYPE_UNKNOWN);
					},
					pathBuilder(node, compiler, imports) {
						const SVG = compiler.localVariables.next();
						const PATH = compiler.localVariables.next();

						compiler.source += `(yield* (function* (${SVG}) {\n`;
						compiler.source += `if (${SVG} && ${SVG}.length > 0) {\n`;
						compiler.source += `thread._tringlymanPathBuilderIndex ??= "";\n`;
						compiler.source += `const ${PATH} = document.createElement("path");\n`;
						compiler.descendStack(node.substack, new imports.Frame(false));
						compiler.source += `${PATH}.setAttribute("fill", "none");\n`;
						compiler.source += `${PATH}.setAttribute("stroke", "#000");\n`;
						compiler.source += `${PATH}.setAttribute("stroke-width", 3);\n`;
						if (
							Scratch.Cast.toBoolean(
								compiler.descendInput(node.ZBool).asBoolean(),
							)
						) {
							compiler.source += `thread._tringlymanPathBuilderIndex += " Z";\n`;
						}
						compiler.source += `${PATH}.setAttribute("d", thread._tringlymanPathBuilderIndex);\n`;
						compiler.source += `${SVG}[${SVG}.length - 1].append(${PATH});\n`;
						compiler.source += `thread._tringlymanPathBuilderIndex = "";\n`;
						compiler.source += `}})(thread._tringlymanSVGBuilderIndex));\n`;
					},
					MPathCommand(node, compiler, imports) {
						const relative = Scratch.Cast.toBoolean(node.relative);

						const x = compiler.descendInput(node.x).asNumber();
						const y = compiler.descendInput(node.y).asNumber();

						const DTYPE = relative ? "M" : "m";

						compiler.source += `thread._tringlymanPathBuilderIndex += " ${DTYPE}${x},${y}";\n`;
					},
					LPathCommand(node, compiler, imports) {
						const relative = Scratch.Cast.toBoolean(node.relative);

						const x = compiler.descendInput(node.x).asNumber();
						const y = compiler.descendInput(node.y).asNumber();

						const DTYPE = relative ? "L" : "l";

						compiler.source += `thread._tringlymanPathBuilderIndex += " ${DTYPE}${x},${y}";\n`;
					},
					HPathCommand(node, compiler, imports) {
						const relative = Scratch.Cast.toBoolean(node.relative);

						const x = compiler.descendInput(node.x).asNumber();

						const DTYPE = relative ? "H" : "h";

						compiler.source += `thread._tringlymanPathBuilderIndex += " ${DTYPE}${x}";\n`;
					},
					VPathCommand(node, compiler, imports) {
						const relative = Scratch.Cast.toBoolean(node.relative);

						const y = compiler.descendInput(node.y).asNumber();

						const DTYPE = relative ? "V" : "v";

						compiler.source += `thread._tringlymanPathBuilderIndex += " ${DTYPE}${y}";\n`;
					},
					QPathCommand(node, compiler, imports) {
						const relative = Scratch.Cast.toBoolean(node.relative);

						const x1 = compiler.descendInput(node.x1).asNumber();
						const y1 = compiler.descendInput(node.y1).asNumber();
						const x = compiler.descendInput(node.x).asNumber();
						const y = compiler.descendInput(node.y).asNumber();

						const DTYPE = relative ? "Q" : "q";

						compiler.source += `thread._tringlymanPathBuilderIndex += " ${DTYPE}${x1},${y1},${x},${y}";\n`;
					},
					SPathCommand(node, compiler, imports) {
						const relative = Scratch.Cast.toBoolean(node.relative);

						const x1 = compiler.descendInput(node.x1).asNumber();
						const y1 = compiler.descendInput(node.y1).asNumber();
						const x = compiler.descendInput(node.x).asNumber();
						const y = compiler.descendInput(node.y).asNumber();

						const DTYPE = relative ? "S" : "s";

						compiler.source += `thread._tringlymanPathBuilderIndex += " ${DTYPE}${x1},${y1},${x},${y}";\n`;
					},
					CPathCommand(node, compiler, imports) {
						const relative = Scratch.Cast.toBoolean(node.relative);

						const x1 = compiler.descendInput(node.x1).asNumber();
						const y1 = compiler.descendInput(node.y1).asNumber();
						const x2 = compiler.descendInput(node.x2).asNumber();
						const y2 = compiler.descendInput(node.y2).asNumber();
						const x = compiler.descendInput(node.x).asNumber();
						const y = compiler.descendInput(node.y).asNumber();

						const DTYPE = relative ? "C" : "c";

						compiler.source += `thread._tringlymanPathBuilderIndex += " ${DTYPE}${x1},${y1},${x2},${y2},${x},${y}";\n`;
					},
					TPathCommand(node, compiler, imports) {
						const relative = Scratch.Cast.toBoolean(node.relative);

						const x = compiler.descendInput(node.x).asNumber();
						const y = compiler.descendInput(node.y).asNumber();

						const DTYPE = relative ? "T" : "t";

						compiler.source += `thread._tringlymanPathBuilderIndex += " ${DTYPE}${x},${y}";\n`;
					},
					APathCommand(node, compiler, imports) {
						const relative = Scratch.Cast.toBoolean(node.relative);

						const rx = compiler.descendInput(node.rx).asNumber();
						const ry = compiler.descendInput(node.ry).asNumber();
						const xAxisRotation = Math.abs(
							compiler.descendInput(node.xAxisRotation).asNumber(),
						);
						const largeArcFlagFlag = Scratch.Cast.toNumber(
							Scratch.Cast.toBoolean(
								compiler.descendInput(node.largeArcFlag).asBoolean(),
							),
						);
						const sweepFlag = Scratch.Cast.toNumber(
							Scratch.Cast.toBoolean(
								compiler.descendInput(node.sweepFlag).asBoolean(),
							),
						);
						const x = compiler.descendInput(node.x).asNumber();
						const y = compiler.descendInput(node.y).asNumber();

						const DTYPE = relative ? "A" : "a";

						compiler.source += `thread._tringlymanPathBuilderIndex += " ${DTYPE}${rx},${ry},${xAxisRotation},${largeArcFlagFlag},${sweepFlag},${x},${y}";\n`;
					},
					lineTag(node, compiler, imports) {
						const x1 = compiler.descendInput(node.x1).asNumber();
						const y1 = compiler.descendInput(node.y1).asNumber();
						const x2 = compiler.descendInput(node.x2).asNumber();
						const y2 = compiler.descendInput(node.y2).asNumber();

						const SVG = compiler.localVariables.next();
						const line = compiler.localVariables.next();

						compiler.source += `(yield* (function* (${SVG}) {`;
						compiler.source += `const ${line} = document.createElement("line");\n`;
						compiler.source += `${line}.setAttribute("x1", ${x1});\n`;
						compiler.source += `${line}.setAttribute("y1", ${y1});\n`;
						compiler.source += `${line}.setAttribute("x2", ${x2});\n`;
						compiler.source += `${line}.setAttribute("y2", ${y2});\n`;
						compiler.source += `${line}.setAttribute("stroke", "#000");\n`;
						compiler.source += `${line}.setAttribute("stroke-width", 3);\n`;
						compiler.source += `${SVG}[${SVG}.length - 1].append(${line});\n`;
						compiler.source += `})(thread._tringlymanSVGBuilderIndex));\n`;
					},
					rectTag(node, compiler, imports) {
						const x = compiler.descendInput(node.x).asNumber();
						const y = compiler.descendInput(node.y).asNumber();
						const width = compiler.descendInput(node.width).asNumber();
						const height = compiler.descendInput(node.height).asNumber();

						const SVG = compiler.localVariables.next();
						const rect = compiler.localVariables.next();

						compiler.source += `(yield* (function* (${SVG}) {`;
						compiler.source += `const ${rect} = document.createElement("rect");\n`;
						compiler.source += `${rect}.setAttribute("x", ${x});\n`;
						compiler.source += `${rect}.setAttribute("y", ${y});\n`;
						compiler.source += `${rect}.setAttribute("width", ${width});\n`;
						compiler.source += `${rect}.setAttribute("height", ${height});\n`;
						compiler.source += `${rect}.setAttribute("fill", "none");\n`;
						compiler.source += `${rect}.setAttribute("stroke", "#000");\n`;
						compiler.source += `${rect}.setAttribute("stroke-width", 3);\n`;
						compiler.source += `${SVG}[${SVG}.length - 1].append(${rect});\n`;
						compiler.source += `})(thread._tringlymanSVGBuilderIndex));\n`;
					},
					circleTag(node, compiler, imports) {
						const cx = compiler.descendInput(node.cx).asNumber();
						const cy = compiler.descendInput(node.cy).asNumber();
						const r = compiler.descendInput(node.r).asNumber();

						const SVG = compiler.localVariables.next();
						const circle = compiler.localVariables.next();

						compiler.source += `(yield* (function* (${SVG}) {`;
						compiler.source += `const ${circle} = document.createElement("circle");\n`;
						compiler.source += `${circle}.setAttribute("cx", ${cx});\n`;
						compiler.source += `${circle}.setAttribute("cy", ${cy});\n`;
						compiler.source += `${circle}.setAttribute("r", ${r});\n`;
						compiler.source += `${SVG}[${SVG}.length - 1].append(${circle});\n`;
						compiler.source += `})(thread._tringlymanSVGBuilderIndex));\n`;
					},
					ellipseTag(node, compiler, imports) {
						const cx = compiler.descendInput(node.cx).asNumber();
						const cy = compiler.descendInput(node.cy).asNumber();
						const rx = compiler.descendInput(node.rx).asNumber();
						const ry = compiler.descendInput(node.ry).asNumber();

						const SVG = compiler.localVariables.next();
						const ellipse = compiler.localVariables.next();

						compiler.source += `(yield* (function* (${SVG}) {`;
						compiler.source += `const ${ellipse} = document.createElement("ellipse");\n`;
						compiler.source += `${ellipse}.setAttribute("cx", ${cx});\n`;
						compiler.source += `${ellipse}.setAttribute("cy", ${cy});\n`;
						compiler.source += `${ellipse}.setAttribute("rx", ${rx});\n`;
						compiler.source += `${ellipse}.setAttribute("ry", ${ry});\n`;
						compiler.source += `${SVG}[${SVG}.length - 1].append(${ellipse});\n`;
						compiler.source += `})(thread._tringlymanSVGBuilderIndex));\n`;
					},
					polygonTag(node, compiler, imports) {
						const points = compiler.descendInput(node.points).asUnknown();

						const SVG = compiler.localVariables.next();
						const polygon = compiler.localVariables.next();

						compiler.source += `(yield* (function* (${SVG}) {`;
						compiler.source += `const ${polygon} = document.createElement("polygon");\n`;
						compiler.source += `${polygon}.setAttribute("points", ${points});\n`;
						compiler.source += `${SVG}[${SVG}.length - 1].append(${polygon});\n`;
						compiler.source += `})(thread._tringlymanSVGBuilderIndex));\n`;
					},
				},
			};
		}
	}

	Scratch.extensions.register(new Extension());
})(Scratch);
