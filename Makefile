pwd :=$(shell pwd)

spell:
	docker run -ti -v $(pwd):/workdir tmaier/markdown-spellcheck:latest --ignore-numbers --ignore-acronyms --dictionary /usr/share/hunspell/en_GB "**/*.markdown"
spell_report:
	docker run -ti -v $(pwd):/workdir tmaier/markdown-spellcheck:latest --ignore-numbers --ignore-acronyms --dictionary /usr/share/hunspell/en_GB --report "**/*.markdown"

