function Routine {
    reg delete HKCU\Software\Microsoft\Windows\CurrentVersion\Explorer /v ScreenshotIndex /f

    7z a -x!vscode $HOME\Downloads\scoop.7z $HOME\scoop\persist\*

    scoop cleanup -a -k
    rm (Get-PSReadlineOption).HistorySavePath
    Clear-History
}
