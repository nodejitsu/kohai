.PHONY: all install clean uninstall 

all: install

install:
	@npm install irc && \
    npm install colors && \
    npm install nconf && \
    npm install pkginfo && \
    npm install oauth && \
    npm install cookies && \
    npm install levenshtein && \
    npm install unshortener && \
    npm install winston && \
    echo 'dependencies installed.'

clean:
	@true

uninstall:
	@true
