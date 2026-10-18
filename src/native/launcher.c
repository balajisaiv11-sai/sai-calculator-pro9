#define WIN32_LEAN_AND_MEAN
#define COBJMACROS
#include <windows.h>
#include <winsock2.h>
#include <ws2tcpip.h>
#include <shellapi.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#include "embedded_assets.c"

static int g_port = 0;
static SOCKET g_listen_sock = INVALID_SOCKET;
static volatile BOOL g_running = TRUE;

static const EmbeddedFile* find_file(const char* url_path) {
    if (!url_path || url_path[0] == '\0') return NULL;
    for (size_t i = 0; i < g_embedded_files_count; i++) {
        if (strcmp(g_embedded_files[i].path, url_path) == 0) {
            return &g_embedded_files[i];
        }
    }
    // Also check without leading slash
    if (url_path[0] == '/') {
        for (size_t i = 0; i < g_embedded_files_count; i++) {
            if (strcmp(g_embedded_files[i].path, url_path + 1) == 0) {
                return &g_embedded_files[i];
            }
        }
    }
    return NULL;
}

static DWORD WINAPI http_worker_thread(LPVOID param) {
    SOCKET client = (SOCKET)param;
    char buffer[4096];
    int bytes_read = recv(client, buffer, sizeof(buffer) - 1, 0);
    if (bytes_read <= 0) {
        closesocket(client);
        return 0;
    }
    buffer[bytes_read] = '\0';

    char method[16] = {0};
    char path[1024] = {0};
    sscanf(buffer, "%15s %1023s", method, path);

    // Strip query string if any (?...)
    char* q = strchr(path, '?');
    if (q) *q = '\0';

    if (strcmp(path, "") == 0 || strcmp(path, "/") == 0) {
        strcpy(path, "/index.html");
    }

    const EmbeddedFile* file = find_file(path);
    if (!file) {
        // Fallback to index.html for SPA routing
        file = find_file("/index.html");
    }

    if (file) {
        char header[512];
        int header_len = snprintf(header, sizeof(header),
            "HTTP/1.1 200 OK\r\n"
            "Content-Type: %s\r\n"
            "Content-Length: %zu\r\n"
            "Access-Control-Allow-Origin: *\r\n"
            "Cache-Control: public, max-age=31536000\r\n"
            "Connection: close\r\n\r\n",
            file->mime, file->size);

        send(client, header, header_len, 0);
        send(client, (const char*)file->data, (int)file->size, 0);
    } else {
        const char* not_found = "HTTP/1.1 404 Not Found\r\nContent-Length: 9\r\n\r\nNot Found";
        send(client, not_found, (int)strlen(not_found), 0);
    }

    closesocket(client);
    return 0;
}

static DWORD WINAPI server_listener_thread(LPVOID param) {
    while (g_running && g_listen_sock != INVALID_SOCKET) {
        SOCKET client = accept(g_listen_sock, NULL, NULL);
        if (client == INVALID_SOCKET) {
            if (!g_running) break;
            Sleep(10);
            continue;
        }
        CreateThread(NULL, 0, http_worker_thread, (LPVOID)client, 0, NULL);
    }
    return 0;
}

static int start_http_server(void) {
    WSADATA wsa;
    if (WSAStartup(MAKEWORD(2, 2), &wsa) != 0) return 0;

    g_listen_sock = socket(AF_INET, SOCK_STREAM, IPPROTO_TCP);
    if (g_listen_sock == INVALID_SOCKET) return 0;

    struct sockaddr_in addr;
    memset(&addr, 0, sizeof(addr));
    addr.sin_family = AF_INET;
    addr.sin_addr.s_addr = inet_addr("127.0.0.1");
    addr.sin_port = 0; // Bind to any free ephemeral port

    if (bind(g_listen_sock, (struct sockaddr*)&addr, sizeof(addr)) != 0) {
        closesocket(g_listen_sock);
        return 0;
    }

    if (listen(g_listen_sock, SOMAXCONN) != 0) {
        closesocket(g_listen_sock);
        return 0;
    }

    int addr_len = sizeof(addr);
    if (getsockname(g_listen_sock, (struct sockaddr*)&addr, &addr_len) != 0) {
        closesocket(g_listen_sock);
        return 0;
    }

    g_port = ntohs(addr.sin_port);
    CreateThread(NULL, 0, server_listener_thread, NULL, 0, NULL);
    return g_port;
}

static BOOL file_exists(const char* path) {
    DWORD attr = GetFileAttributesA(path);
    return (attr != INVALID_FILE_ATTRIBUTES && !(attr & FILE_ATTRIBUTE_DIRECTORY));
}

static void launch_desktop_window(int port) {
    char url[128];
    snprintf(url, sizeof(url), "http://127.0.0.1:%d/", port);

    char local_app_data[MAX_PATH];
    if (!GetEnvironmentVariableA("LOCALAPPDATA", local_app_data, MAX_PATH)) {
        strcpy(local_app_data, "C:\\Temp");
    }

    char profile_dir[MAX_PATH];
    snprintf(profile_dir, sizeof(profile_dir), "%s\\SaiCalculatorPro\\profile", local_app_data);
    CreateDirectoryA(profile_dir, NULL);

    char edge_candidates[3][MAX_PATH];
    snprintf(edge_candidates[0], MAX_PATH, "%s\\Microsoft\\Edge\\Application\\msedge.exe", getenv("ProgramFiles(x86)") ? getenv("ProgramFiles(x86)") : "C:\\Program Files (x86)");
    snprintf(edge_candidates[1], MAX_PATH, "%s\\Microsoft\\Edge\\Application\\msedge.exe", getenv("ProgramFiles") ? getenv("ProgramFiles") : "C:\\Program Files");
    snprintf(edge_candidates[2], MAX_PATH, "%s\\Microsoft\\Edge\\Application\\msedge.exe", local_app_data);

    char chrome_candidates[2][MAX_PATH];
    snprintf(chrome_candidates[0], MAX_PATH, "%s\\Google\\Chrome\\Application\\chrome.exe", getenv("ProgramFiles") ? getenv("ProgramFiles") : "C:\\Program Files");
    snprintf(chrome_candidates[1], MAX_PATH, "%s\\Google\\Chrome\\Application\\chrome.exe", getenv("ProgramFiles(x86)") ? getenv("ProgramFiles(x86)") : "C:\\Program Files (x86)");

    const char* chosen_browser = NULL;
    for (int i = 0; i < 3; i++) {
        if (file_exists(edge_candidates[i])) {
            chosen_browser = edge_candidates[i];
            break;
        }
    }
    if (!chosen_browser) {
        for (int i = 0; i < 2; i++) {
            if (file_exists(chrome_candidates[i])) {
                chosen_browser = chrome_candidates[i];
                break;
            }
        }
    }

    if (chosen_browser) {
        char cmd_line[1024];
        snprintf(cmd_line, sizeof(cmd_line),
            "\"%s\" --app=%s --window-size=1240,860 --user-data-dir=\"%s\" --disable-extensions --enable-features=OverlayScrollbar",
            chosen_browser, url, profile_dir);

        STARTUPINFOA si;
        PROCESS_INFORMATION pi;
        memset(&si, 0, sizeof(si));
        si.cb = sizeof(si);
        memset(&pi, 0, sizeof(pi));

        if (CreateProcessA(NULL, cmd_line, NULL, NULL, FALSE, 0, NULL, NULL, &si, &pi)) {
            // Keep server alive while window is running
            WaitForSingleObject(pi.hProcess, INFINITE);
            CloseHandle(pi.hProcess);
            CloseHandle(pi.hThread);
            return;
        }
    }

    // Fallback: Shell open default system browser
    ShellExecuteA(NULL, "open", url, NULL, NULL, SW_SHOWNORMAL);
    // Keep server alive
    Sleep(86400000); // 24 hours
}

int WINAPI WinMain(HINSTANCE hInstance, HINSTANCE hPrevInstance, LPSTR lpCmdLine, int nCmdShow) {
    // Single instance mutex
    HANDLE hMutex = CreateMutexA(NULL, TRUE, "SaiCalculatorPro_Running_Instance_Mutex");
    if (GetLastError() == ERROR_ALREADY_EXISTS) {
        // Already running, can let it launch or open
    }

    int port = start_http_server();
    if (port <= 0) {
        MessageBoxA(NULL, "Could not start local offline engine.", "Sai Calculator Pro", MB_OK | MB_ICONERROR);
        return 1;
    }

    // Give server thread 20ms to initialize
    Sleep(20);

    launch_desktop_window(port);

    g_running = FALSE;
    if (g_listen_sock != INVALID_SOCKET) {
        closesocket(g_listen_sock);
    }
    WSACleanup();
    if (hMutex) CloseHandle(hMutex);
    return 0;
}
