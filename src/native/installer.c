#define WIN32_LEAN_AND_MEAN
#define COBJMACROS
#include <windows.h>
#include <shlobj.h>
#include <shlguid.h>
#include <shellapi.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#include "launcher_binary.c"

static void create_dir_if_not_exists(const wchar_t* path) {
    CreateDirectoryW(path, NULL);
}

static BOOL create_shortcut(
    LPCWSTR target_exe,
    LPCWSTR shortcut_path,
    LPCWSTR description,
    LPCWSTR working_dir,
    LPCWSTR icon_path)
{
    HRESULT hr;
    IShellLinkW* psl = NULL;

    hr = CoCreateInstance(&CLSID_ShellLink, NULL, CLSCTX_INPROC_SERVER, &IID_IShellLinkW, (void**)&psl);
    if (FAILED(hr)) return FALSE;

    psl->lpVtbl->SetPath(psl, target_exe);
    if (working_dir && working_dir[0]) {
        psl->lpVtbl->SetWorkingDirectory(psl, working_dir);
    }
    if (description && description[0]) {
        psl->lpVtbl->SetDescription(psl, description);
    }
    if (icon_path && icon_path[0]) {
        psl->lpVtbl->SetIconLocation(psl, icon_path, 0);
    }

    IPersistFile* ppf = NULL;
    hr = psl->lpVtbl->QueryInterface(psl, &IID_IPersistFile, (void**)&ppf);
    if (SUCCEEDED(hr)) {
        hr = ppf->lpVtbl->Save(ppf, shortcut_path, TRUE);
        ppf->lpVtbl->Release(ppf);
    }
    psl->lpVtbl->Release(psl);
    return SUCCEEDED(hr);
}

int WINAPI WinMain(HINSTANCE hInstance, HINSTANCE hPrevInstance, LPSTR lpCmdLine, int nCmdShow) {
    CoInitialize(NULL);

    // 1. Get %LOCALAPPDATA%
    wchar_t local_app_data[MAX_PATH];
    if (!GetEnvironmentVariableW(L"LOCALAPPDATA", local_app_data, MAX_PATH)) {
        wcscpy(local_app_data, L"C:\\Users\\Default\\AppData\\Local");
    }

    // Target installation directory: %LOCALAPPDATA%\SaiCalculatorPro
    wchar_t install_dir[MAX_PATH];
    swprintf(install_dir, MAX_PATH, L"%s\\SaiCalculatorPro", local_app_data);
    create_dir_if_not_exists(install_dir);

    // 2. Write out SaiCalculatorPro.exe
    wchar_t target_exe[MAX_PATH];
    swprintf(target_exe, MAX_PATH, L"%s\\SaiCalculatorPro.exe", install_dir);

    FILE* fp = _wfopen(target_exe, L"wb");
    if (!fp) {
        MessageBoxW(NULL, L"Could not write application files. Please check permissions.", L"Sai Calculator Pro - Setup Error", MB_OK | MB_ICONERROR);
        CoUninitialize();
        return 1;
    }
    fwrite(g_launcher_exe_data, 1, g_launcher_exe_size, fp);
    fclose(fp);

    // 3. Get Desktop path
    wchar_t desktop_path[MAX_PATH];
    if (SUCCEEDED(SHGetFolderPathW(NULL, CSIDL_DESKTOPDIRECTORY, NULL, 0, desktop_path))) {
        wchar_t desktop_shortcut[MAX_PATH];
        swprintf(desktop_shortcut, MAX_PATH, L"%s\\Sai Calculator Pro.lnk", desktop_path);
        create_shortcut(
            target_exe,
            desktop_shortcut,
            L"Sai Calculator Pro - 712 Function Scientific Calculator (100% Offline)",
            install_dir,
            target_exe
        );
    }

    // 4. Get Start Menu Programs path
    wchar_t start_menu_path[MAX_PATH];
    if (SUCCEEDED(SHGetFolderPathW(NULL, CSIDL_PROGRAMS, NULL, 0, start_menu_path))) {
        wchar_t start_shortcut[MAX_PATH];
        swprintf(start_shortcut, MAX_PATH, L"%s\\Sai Calculator Pro.lnk", start_menu_path);
        create_shortcut(
            target_exe,
            start_shortcut,
            L"Sai Calculator Pro - 712 Function Scientific Calculator (100% Offline)",
            install_dir,
            target_exe
        );
    }

    // 5. Register in Windows Add/Remove Programs (Registry)
    HKEY hKey;
    if (RegCreateKeyExW(HKEY_CURRENT_USER,
        L"Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\SaiCalculatorPro",
        0, NULL, REG_OPTION_NON_VOLATILE, KEY_WRITE, NULL, &hKey, NULL) == ERROR_SUCCESS)
    {
        const wchar_t* display_name = L"Sai Calculator Pro";
        const wchar_t* publisher = L"Sai Calculator Team";
        const wchar_t* version = L"1.0.0";
        DWORD estimated_size = (DWORD)(g_launcher_exe_size / 1024);

        RegSetValueExW(hKey, L"DisplayName", 0, REG_SZ, (const BYTE*)display_name, (DWORD)((wcslen(display_name) + 1) * sizeof(wchar_t)));
        RegSetValueExW(hKey, L"DisplayIcon", 0, REG_SZ, (const BYTE*)target_exe, (DWORD)((wcslen(target_exe) + 1) * sizeof(wchar_t)));
        RegSetValueExW(hKey, L"Publisher", 0, REG_SZ, (const BYTE*)publisher, (DWORD)((wcslen(publisher) + 1) * sizeof(wchar_t)));
        RegSetValueExW(hKey, L"DisplayVersion", 0, REG_SZ, (const BYTE*)version, (DWORD)((wcslen(version) + 1) * sizeof(wchar_t)));
        RegSetValueExW(hKey, L"InstallLocation", 0, REG_SZ, (const BYTE*)install_dir, (DWORD)((wcslen(install_dir) + 1) * sizeof(wchar_t)));
        RegSetValueExW(hKey, L"EstimatedSize", 0, REG_DWORD, (const BYTE*)&estimated_size, sizeof(DWORD));
        RegCloseKey(hKey);
    }

    // 6. Native Welcome Message
    MessageBoxW(
        NULL,
        L"Sai Calculator Pro has been successfully installed!\n\n"
        L"  \x2022 712 Verified Scientific & Engineering Functions\n"
        L"  \x2022 Desktop & Start Menu shortcuts created\n"
        L"  \x2022 100% Offline (No Internet Connection Required)\n\n"
        L"Click OK to launch your calculator now.",
        L"Sai Calculator Pro - Setup Complete",
        MB_OK | MB_ICONINFORMATION
    );

    // 7. Launch installed executable immediately
    ShellExecuteW(NULL, L"open", target_exe, NULL, install_dir, SW_SHOWNORMAL);

    CoUninitialize();
    return 0;
}
