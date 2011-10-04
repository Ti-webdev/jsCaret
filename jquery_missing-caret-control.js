(function($) {
	var msie = $.browser.msie;

	function getCaret(element) {
		if(msie) {
			var selection = document.selection;
			if (element.tagName.toLowerCase() != "textarea") {
				// Input
				var val = element.value,
				range = selection.createRange().duplicate();
				range.moveEnd("character", val.length);
				start = (range.text == "" ? val.length : val.lastIndexOf(range.text));
				range = selection.createRange().duplicate();
				range.moveStart("character", -val.length);
				end = range.text.length;
			} else {
				// Textarea
				var range = selection.createRange(),
				stored_range = range.duplicate();
				stored_range.moveToElementText(element);
				stored_range.setEndPoint('EndToEnd', range);
				start = stored_range.text.length - range.text.length;
				end = start + range.text.length;
			}
		} else {
			start = element.selectionStart;
			end = element.selectionEnd;
		}

		return {'start': start, 'end': end}
	}
	
	function setCaret(element, start, end) {
		if(msie) {
			var selRange = element.createTextRange();
			element.collapse(true);
			element.moveStart('character', start);
			element.moveEnd('character', end - start);
			element.select();
		} else {
			element.selectionStart = start;
			element.selectionEnd = end;
		}
		element.focus();
		
		return true;
	}
	
	$.fn.caret = function() {
		var self = this,
		$self = self[0],
		start, end, caret;

		return {
			// Set start and end of caret
			set: function() {

				if(typeof arguments[0] === "object" && typeof arguments[0].start==="number" && typeof arguments[0].end==="number") {
					start = arguments[0].start;
					end = arguments[0].end;
				} else if(typeof arguments[0] === "number" && typeof arguments[1] === "number") {
					start = arguments[0];
					end = arguments[1];
				} else if(typeof arguments[0] === "number" ) {
					start = end = arguments[0];
				} else {
					return this;
				}

				setCaret($self, start, end);

				return this;
			},
			// Get start and end of caret
			get: function() {
				return getCaret($self);
			},
			// Set or get start of caret
			start: function() {
				caret = getCaret($self);
				
				if(arguments[0] && typeof arguments[0] === "number") {
					// TODO nastavit začátek kurzoru
					setCaret($self,arguments[0], caret.end);
					return this;
				} else {
					return caret.start;
				}
			},
			// Set or get end of caret
			end: function() {
				caret = getCaret($self);
				
				if(arguments[0] && typeof arguments[0] === "number") {
					// TODO nastavit začátek kurzoru
					setCaret($self,caret.start, arguments[0]);
					return this;
				} else {
					return caret.end;
				}
			},
			// Find and select specific string or regexp
			select: function() {
				var arg = arguments[0];

				if(typeof arg === "string") {
					if((start = $self.value.indexOf(arg)) >- 1) {
						end = start + arg.length;
					} else {
						start = null;
					}
				} else if(Object.prototype.toString.call(arg) === "[object RegExp]") {
					var re = arg.exec($self.value);

					if(re != null) {
						start = re.index;
						end = start + re[0].length;
					}
				}

				if(typeof(start) !== "undefined" && typeof(end) !== "undefined") {
					setCaret($self,start,end);
				}
				
				return this;
			},
			// Insert string to caret, or replace selection
			insert: function(text) {
				caret = getCaret($self);
    		$self.value = $self.value.substr(0, caret.start) + text + $self.value.substr(caret.end, $self.value.length);
				setCaret($self, caret.start, caret.start + text.length);
				return this;
			},
			// Insert string before caret or selection
			insertBefore: function(text) {
				caret = getCaret($self);
    		$self.value = $self.value.substr(0, caret.start) + text + $self.value.substr(caret.start, $self.value.length);
				setCaret($self,caret.start + text.length, caret.end + text.length);
				return this;
			},
			// Insert string after caret or selection
			insertAfter: function(text) {
				caret = getCaret($self);
				$self.value = $self.value.substr(0, caret.end) + text + $self.value.substr(caret.end, $self.value.length);
				setCaret($self,caret.start, caret.end);
				return this;
			},
			// Return selected text from selection
			text: function() {
				if(arguments[0]) {
					this.insert(arguments[0])
					return this;
				} else {
					caret = getCaret($self);
					return $self.value.substring(caret.start, caret.end)//.replace(/ /g, '\xa0') || '\xa0'	
				}
			},
			// Get string before caret or selection
			before: function() {
				caret = getCaret($self);
				if(arguments[0]) {
					$self.value = arguments[0] + $self.value.substring(caret.start, $self.value.length);
					setCaret($self, arguments[0].length, arguments[0].length + (caret.end - caret.start));
					return this;
				} else {
					return $self.value.substring(0, caret.start)//.replace(/ /g, '\xa0') || '\xa0'
				}
			},
			// Get string after caret or selection
			after: function() {
				caret = getCaret($self);
				if(arguments[0]) {
					$self.value = $self.value.substring(0, caret.end) + arguments[0];
					setCaret($self, caret.start, caret.end);
					return this;
				} else {
					return $self.value.substring(caret.end)//.replace(/ /g, '\xa0') || '\xa0'	
				}
			},
			// Return original jQuery element
			endCaret: function() {
				return self;
			}
		}
	}
})(jQuery)