#!/usr/bin/env python3
import os
import re
from pathlib import Path

style_pat = re.compile(r'Style:\s*(.*?),(.*?),')
dialogue_pat = re.compile(r'Dialogue:\s*.*?,.*?,.*?,(.*?),.*?,.*?,.*?,.*?,.*?,(.+)')
fn_pat = re.compile(r'\\fn(.+?)[\\\}]')


def list_fonts(paths: list[str], followlinks: bool) -> set[str]:
    ass = []

    def pick_file(path: Path):
        if path.is_file() or path.is_symlink():
            match path.suffix.lower():
                case '.ass':
                    ass.append(path)

    for path in map(Path, paths):
        if path.is_symlink() and followlinks:
            path = path.readlink()
        if path.is_dir():
            for root, _, files in os.walk(path, followlinks=followlinks):
                root = Path(root)
                for file in files:
                    pick_file(root / file)
        else:
            pick_file(path)

    fonts = set()
    for path in ass:
        with path.open() as file:
            style_to_font, used_styles = dict(), set()
            for line in file:
                if m := style_pat.match(line):
                    style_to_font[m[1]] = m[2].lstrip('@')
                elif m := dialogue_pat.match(line):
                    used_styles.add(m[1].lstrip('*'))
                    fonts.update(m[1].lstrip('@') for m in fn_pat.finditer(m[2]))
            for style in used_styles:
                if font := style_to_font.get(style):
                    fonts.add(font)

    return fonts


def main():
    import argparse

    parser = argparse.ArgumentParser()
    parser.add_argument('path', nargs='+')
    parser.add_argument('-f', '--followlinks', action='store_true')
    args = parser.parse_args()
    for font in sorted(list_fonts(args.path, args.followlinks)):
        print(font)


if __name__ == '__main__':
    main()
