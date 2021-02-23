Agile Reader
============

## LATEX

    pdflatex it-10.tex

## PANDOC

https://pandoc.org/

    pandoc it-10.tex -f latex -t epub -s -o it-10.epub
    pandoc it-10.html -f html -t epub -s -o it-10.epub

    pandoc it-1.html -f html -t epub -s -o it-1.epub
    pandoc it-2.html -f html -t epub -s -o it-2.epub
    pandoc it-3.html -f html -t epub -s -o it-3.epub
    pandoc it-4.html -f html -t epub -s -o it-4.epub
    pandoc it-5.html -f html -t epub -s -o it-5.epub
    pandoc it-6.html -f html -t epub -s -o it-6.epub
    pandoc it-7.html -f html -t epub -s -o it-7.epub
    pandoc it-8.html -f html -t epub -s -o it-8.epub
    pandoc it-9.html -f html -t epub -s -o it-9.epub
    pandoc it-10.html -f html -t epub -s -o it-10.epub
    pandoc it-11.html -f html -t epub -s -o it-11.epub
    pandoc it-12.html -f html -t epub -s -o it-12.epub
    pandoc it-13.html -f html -t epub -s -o it-13.epub
    pandoc it-14.html -f html -t epub -s -o it-14.epub

## CALIBRE

https://www.planetebook.com/the-tales-of-mother-goose/

## DATA

- librivox
- project gutenberg
- internet archive

## NUNJUCKS

    nunjucks.configure('', {
      autoescape: false,
      tags: {
        variableStart: '<ARvar',
        variableEnd: 'varAR>',
    
        blockStart: '<ARblock',
        blockEnd: 'blockAR>',
    
        commentStart: '<ARcomment',
        commentEnd: 'commentAR>',
      },
    });
