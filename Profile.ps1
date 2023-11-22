function Routine {
    7z a -x!vscode -x!qbittorrent-enhanced $HOME\Downloads\scoop.7z $HOME\scoop\persist\*
    reg delete HKCU\Software\Microsoft\Windows\CurrentVersion\Explorer /v ScreenshotIndex /f
    scoop cleanup -a -k
    rm (Get-PSReadlineOption).HistorySavePath
    Clear-History
}

function Awake {
    $Kernel32 = Add-Type -MemberDefinition @'
[DllImport("kernel32.dll", CharSet = CharSet.Auto, SetLastError = true)]
public static extern uint SetThreadExecutionState(uint esFlags);
'@ -Name Kernel32 -Namespace Win32 -PassThru
    $Kernel32::SetThreadExecutionState([uint32] '0x80000001')
}
