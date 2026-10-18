#!/usr/bin/env python3
import os
import sys
import struct
import zlib
import subprocess
import shutil

ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
DIST_DIR = os.path.join(ROOT_DIR, 'dist')
PUBLIC_DIR = os.path.join(ROOT_DIR, 'public')
DOWNLOADS_DIR = os.path.join(PUBLIC_DIR, 'downloads')
BUILD_TMP = '/tmp/build_exe'

os.makedirs(DOWNLOADS_DIR, exist_ok=True)
os.makedirs(BUILD_TMP, exist_ok=True)

def generate_ico(dest_path):
    w, h = 64, 64
    raw = bytearray()
    for y in range(h):
        raw.append(0)  # filter byte None
        for x in range(w):
            cx, cy = w / 2, h / 2
            dx, dy = abs(x - cx), abs(y - cy)
            if dx > 26 or dy > 28:
                raw.extend([0, 0, 0, 0])
                continue
            if dx > 22 and dy > 24:
                if (dx - 22)**2 + (dy - 24)**2 > 16:
                    raw.extend([0, 0, 0, 0])
                    continue
            
            # LCD screen
            if 8 <= y <= 20 and 10 <= x <= 54:
                if 10 <= y <= 18 and 12 <= x <= 52:
                    raw.extend([15, 30, 45, 255])
                else:
                    raw.extend([10, 15, 25, 255])
                continue
            
            # Solar badge
            if 22 <= y <= 25 and 10 <= x <= 28:
                raw.extend([30, 41, 59, 255])
                continue
            
            # Keypad
            if y >= 28 and 10 <= x <= 54:
                col = (x - 10) // 9
                row = (y - 28) // 7
                col_offset = (x - 10) % 9
                row_offset = (y - 28) % 7
                if col_offset >= 1 and row_offset >= 1 and col < 5 and row < 5:
                    if row == 0 and col == 4:
                        raw.extend([249, 115, 22, 255])
                    elif row == 0 and col == 3:
                        raw.extend([239, 68, 68, 255])
                    elif row >= 3 and col >= 3:
                        raw.extend([59, 130, 246, 255])
                    elif row < 2:
                        raw.extend([51, 65, 85, 255])
                    else:
                        raw.extend([203, 213, 225, 255])
                    continue
            
            t = y / h
            r = int(15 * (1 - t) + 20 * t)
            g = int(23 * (1 - t) + 30 * t)
            b = int(42 * (1 - t) + 55 * t)
            raw.extend([r, g, b, 255])

    compressed = zlib.compress(bytes(raw))
    def chunk(tag, data):
        return struct.pack('>I', len(data)) + tag + data + struct.pack('>I', zlib.crc32(tag + data) & 0xffffffff)
    ihdr = struct.pack('>IIBBBBB', w, h, 8, 6, 0, 0, 0)
    png_data = b'\x89PNG\r\n\x1a\n' + chunk(b'IHDR', ihdr) + chunk(b'IDAT', compressed) + chunk(b'IEND', b'')

    ico_header = struct.pack('<HHH', 0, 1, 1)
    ico_entry = struct.pack('<BBBBHHII', w, h, 0, 0, 1, 32, len(png_data), 6 + 16)
    with open(dest_path, 'wb') as f:
        f.write(ico_header + ico_entry + png_data)

def get_mime(path):
    ext = os.path.splitext(path)[1].lower()
    mimes = {
        '.html': 'text/html; charset=utf-8',
        '.js': 'application/javascript; charset=utf-8',
        '.css': 'text/css; charset=utf-8',
        '.json': 'application/json; charset=utf-8',
        '.svg': 'image/svg+xml',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.ico': 'image/x-icon',
        '.txt': 'text/plain; charset=utf-8',
    }
    return mimes.get(ext, 'application/octet-stream')

def collect_dist_files():
    files = []
    for root, _, filenames in os.walk(DIST_DIR):
        for fname in filenames:
            full_path = os.path.join(root, fname)
            rel_path = os.path.relpath(full_path, DIST_DIR).replace('\\', '/')
            files.append((rel_path, full_path))
    return files

def generate_c_embedded_data(files, out_c_path):
    with open(out_c_path, 'w', encoding='utf-8') as out:
        out.write('/* Generated embedded asset table for Sai Calculator Pro */\n')
        out.write('#include <stddef.h>\n\n')
        
        for idx, (rel_path, full_path) in enumerate(files):
            with open(full_path, 'rb') as f:
                content = f.read()
            out.write(f'static const unsigned char file_{idx}_data[{len(content)}] = {{\n')
            for i in range(0, len(content), 20):
                chunk_bytes = content[i:i+20]
                out.write('  ' + ', '.join(f'0x{b:02x}' for b in chunk_bytes) + ',\n')
            out.write('};\n\n')

        out.write('typedef struct {\n')
        out.write('    const char* path;\n')
        out.write('    const char* mime;\n')
        out.write('    const unsigned char* data;\n')
        out.write('    size_t size;\n')
        out.write('} EmbeddedFile;\n\n')

        out.write(f'static const EmbeddedFile g_embedded_files[{len(files) + 1}] = {{\n')
        for idx, (rel_path, full_path) in enumerate(files):
            size = os.path.getsize(full_path)
            mime = get_mime(rel_path)
            url_path = '/' + rel_path
            out.write(f'    {{ "{url_path}", "{mime}", file_{idx}_data, {size} }},\n')
            if rel_path == 'index.html':
                out.write(f'    {{ "/", "{mime}", file_{idx}_data, {size} }},\n')
        out.write('};\n\n')
        out.write(f'static const size_t g_embedded_files_count = sizeof(g_embedded_files) / sizeof(g_embedded_files[0]);\n\n')

def generate_launcher_binary_c(exe_path, out_c_path):
    with open(exe_path, 'rb') as f:
        data = f.read()
    with open(out_c_path, 'w', encoding='utf-8') as out:
        out.write('/* Generated standalone launcher binary byte array */\n')
        out.write('#include <stddef.h>\n\n')
        out.write(f'static const size_t g_launcher_exe_size = {len(data)};\n')
        out.write(f'static const unsigned char g_launcher_exe_data[{len(data)}] = {{\n')
        for i in range(0, len(data), 20):
            chunk = data[i:i+20]
            out.write('  ' + ', '.join(f'0x{b:02x}' for b in chunk) + ',\n')
        out.write('};\n')

def main():
    print("Step 1: Building frontend dist...")
    subprocess.check_call(['npm', 'run', 'build'], cwd=ROOT_DIR)

    print("Step 2: Generating Windows ICO resource...")
    ico_path = os.path.join(BUILD_TMP, 'app_icon.ico')
    generate_ico(ico_path)
    shutil.copyfile(ico_path, os.path.join(PUBLIC_DIR, 'favicon.ico'))
    shutil.copyfile(ico_path, os.path.join(PUBLIC_DIR, 'app_icon.ico'))

    print("Step 3: Collecting dist files & generating embedded C assets...")
    files = collect_dist_files()
    print(f"Found {len(files)} files in dist/.")
    embedded_c_path = os.path.join(BUILD_TMP, 'embedded_assets.c')
    generate_c_embedded_data(files, embedded_c_path)

    print("Step 4: Compiling Windows resource (app.rc)...")
    rc_path = os.path.join(BUILD_TMP, 'app.rc')
    with open(rc_path, 'w', encoding='utf-8') as f:
        f.write(f'''1 ICON "{ico_path}"
1 VERSIONINFO
FILEVERSION 1,0,0,0
PRODUCTVERSION 1,0,0,0
FILEFLAGSMASK 0x3fL
FILEFLAGS 0x0L
FILEOS 0x40004L
FILETYPE 0x1L
FILESUBTYPE 0x0L
BEGIN
    BLOCK "StringFileInfo"
    BEGIN
        BLOCK "040904b0"
        BEGIN
            VALUE "CompanyName", "Sai Calculator Pro"
            VALUE "FileDescription", "Sai Calculator Pro - 712 Function Scientific Calculator"
            VALUE "FileVersion", "1.0.0.0"
            VALUE "InternalName", "SaiCalculatorPro"
            VALUE "LegalCopyright", "Copyright (C) 2026"
            VALUE "OriginalFilename", "SaiCalculatorPro.exe"
            VALUE "ProductName", "Sai Calculator Pro"
            VALUE "ProductVersion", "1.0.0.0"
        END
    END
    BLOCK "VarFileInfo"
    BEGIN
        VALUE "Translation", 0x409, 1200
    END
END
''')

    res_o_path = os.path.join(BUILD_TMP, 'app_res.o')
    subprocess.check_call(['x86_64-w64-mingw32-windres', rc_path, '-O', 'coff', '-o', res_o_path])

    print("Step 5: Compiling standalone portable runner (SaiCalculatorPro.exe)...")
    portable_c_path = os.path.join(ROOT_DIR, 'src/native/launcher.c')
    portable_exe = os.path.join(BUILD_TMP, 'SaiCalculatorPro.exe')
    cmd_portable = [
        'x86_64-w64-mingw32-gcc',
        '-O2',
        '-mwindows',
        '-I', BUILD_TMP,
        portable_c_path,
        res_o_path,
        '-lws2_32', '-lshell32', '-lole32', '-luuid',
        '-o', portable_exe
    ]
    subprocess.check_call(cmd_portable)

    print("Step 6: Packaging SaiCalculatorPro.exe into launcher_binary.c...")
    launcher_binary_c = os.path.join(BUILD_TMP, 'launcher_binary.c')
    generate_launcher_binary_c(portable_exe, launcher_binary_c)

    print("Step 7: Compiling Windows Installer (SaiCalculatorPro_Setup.exe)...")
    installer_c_path = os.path.join(ROOT_DIR, 'src/native/installer.c')
    installer_exe = os.path.join(BUILD_TMP, 'SaiCalculatorPro_Setup.exe')
    cmd_installer = [
        'x86_64-w64-mingw32-gcc',
        '-O2',
        '-mwindows',
        '-I', BUILD_TMP,
        installer_c_path,
        res_o_path,
        '-lws2_32', '-lshell32', '-lole32', '-luuid',
        '-o', installer_exe
    ]
    subprocess.check_call(cmd_installer)

    # Deliver to public/downloads and public/
    out_setup = os.path.join(DOWNLOADS_DIR, 'SaiCalculatorPro_Setup.exe')
    out_portable = os.path.join(DOWNLOADS_DIR, 'SaiCalculatorPro_Portable.exe')
    shutil.copyfile(installer_exe, out_setup)
    shutil.copyfile(portable_exe, out_portable)
    shutil.copyfile(installer_exe, os.path.join(PUBLIC_DIR, 'SaiCalculatorPro_Setup.exe'))
    shutil.copyfile(portable_exe, os.path.join(PUBLIC_DIR, 'SaiCalculatorPro.exe'))

    # Also deliver to dist/downloads and dist/ so live production server can serve them immediately
    dist_downloads = os.path.join(DIST_DIR, 'downloads')
    os.makedirs(dist_downloads, exist_ok=True)
    shutil.copyfile(installer_exe, os.path.join(dist_downloads, 'SaiCalculatorPro_Setup.exe'))
    shutil.copyfile(portable_exe, os.path.join(dist_downloads, 'SaiCalculatorPro_Portable.exe'))
    shutil.copyfile(installer_exe, os.path.join(DIST_DIR, 'SaiCalculatorPro_Setup.exe'))
    shutil.copyfile(portable_exe, os.path.join(DIST_DIR, 'SaiCalculatorPro.exe'))

    print(f"\n==========================================")
    print(f"SUCCESS: Built Windows executables:")
    print(f" - Installer: {out_setup} ({os.path.getsize(out_setup):,} bytes)")
    print(f" - Portable:  {out_portable} ({os.path.getsize(out_portable):,} bytes)")
    print(f"==========================================\n")

if __name__ == '__main__':
    main()
