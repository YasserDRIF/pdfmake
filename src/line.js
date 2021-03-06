/**
 * Creates an instance of Line
 *
 * @constructor
 * @this {Line}
 * @param {Number} Maximum width this line can have
 */
class Line {
	constructor(maxWidth) {
		this.maxWidth = maxWidth;
		this.leadingCut = 0;
		this.trailingCut = 0;
		this.inlineWidths = 0;
		this.inlines = [];
	}

	getAscenderHeight() {
		var y = 0;

		this.inlines.forEach(inline => {
			y = Math.max(y, inline.font.ascender / 1000 * inline.fontSize);
		});
		return y;
	}

	hasEnoughSpaceForInline(inline, nextInlines = []) {
		if (this.inlines.length === 0) {
			return true;
		}
		if (this.newLineForced) {
			return false;
		}

		var inlineWidth = inline.width;
		var inlineTrailingCut = inline.trailingCut || 0;
		if (inline.noNewLine) {
			for (var i = 0, l = nextInlines.length; i < l; i++) {
				var nextInline = nextInlines[i];
				inlineWidth += nextInline.width;
				inlineTrailingCut += nextInline.trailingCut || 0;
				if (!nextInline.noNewLine) {
					break;
				}
			}
		}

		return (this.inlineWidths + inlineWidth - this.leadingCut - inlineTrailingCut) <= this.maxWidth;
	}

	addInline(inline) {
		if (this.inlines.length === 0) {
			this.leadingCut = inline.leadingCut || 0;
		}
		this.trailingCut = inline.trailingCut || 0;

		inline.x = this.inlineWidths - this.leadingCut;

		this.inlines.push(inline);
		this.inlineWidths += inline.width;

		if (inline.lineEnd) {
			this.newLineForced = true;
		}
	}

	getWidth() {
		return this.inlineWidths - this.leadingCut - this.trailingCut;
	}

	getAvailableWidth() {
		return this.maxWidth - this.getWidth();
	}

	/**
	 * Returns line height
	 * @return {Number}
	 */
	getHeight() {
		var max = 0;

		this.inlines.forEach(item => {
			max = Math.max(max, item.height || 0);
		});

		return max;
	}
}

export default Line;
