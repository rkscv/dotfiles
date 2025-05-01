Function Cleanup {
    reg delete HKCU\Software\Microsoft\Windows\CurrentVersion\Explorer /v ScreenshotIndex /f
    scoop cleanup -a -k
    Remove-Item (Get-PSReadlineOption).HistorySavePath
    Clear-History
}

Function Backup {
    $Archive = "$HOME\ecloud\backup.zip"
    Remove-Item $Archive
    7z a -ssw -xr!archwsl -xr!qbittorrent-enhanced $Archive $HOME\scoop\persist\* $env:AppData\rsslab\rsslab.db
}

Function Awake {
    $Kernel32 = Add-Type -MemberDefinition @'
[DllImport("kernel32.dll", CharSet = CharSet.Auto, SetLastError = true)]
public static extern uint SetThreadExecutionState(uint esFlags);
'@ -Name Kernel32 -Namespace Win32 -PassThru
    $Kernel32::SetThreadExecutionState([uint32] '0x80000001')
}

Function Aria2 {
    aria2c --max-connection-per-server=16 --continue --dir=$HOME\Downloads $Args
}

Function Pal {
    $Backup = "$HOME\ecloud\Palworld.zip"
    Remove-Item $Backup
    7z a -xr!backup $Backup D:\Sandbox\Palworld\user\current\AppData\Local\Pal\Saved\SaveGames\*
}

Set-PSReadLineKeyHandler -Key Tab -Function MenuComplete
Set-PSReadLineKeyHandler -Key Alt+Backspace -Function ShellBackwardKillWord
Set-PSReadLineKeyHandler -Key Ctrl+RightArrow -Function ForwardWord
Set-PSReadLineKeyHandler -Key UpArrow -Function HistorySearchBackward
Set-PSReadLineKeyHandler -Key DownArrow -Function HistorySearchForward
Set-PSReadLineOption -HistorySearchCursorMovesToEnd
