# Builds a labelled 4-frame contact sheet for every preview clip so shots can be chosen visually.
param(
  [string]$Src = "$PSScriptRoot\..\..\media-src\preview",
  [string]$Out = "$PSScriptRoot\..\..\media-src\sheets"
)
$ff = (Get-ChildItem "$env:USERPROFILE\.tools\ffmpeg" -Recurse -Filter ffmpeg.exe | Select-Object -First 1).FullName
$fp = $ff -replace 'ffmpeg.exe$', 'ffprobe.exe'
New-Item -ItemType Directory -Force $Out | Out-Null
Get-ChildItem $Src -Filter *.mp4 | ForEach-Object {
  $dur = [double](& $fp -v error -show_entries format=duration -of csv=p=0 $_.FullName)
  $fps = 4 / [math]::Max($dur, 1)
  & $ff -v error -y -i $_.FullName -vf "fps=$fps,scale=320:-2,tile=4x1" -frames:v 1 "$Out\$($_.BaseName).jpg"
  "{0} {1:N1}s" -f $_.BaseName, $dur
}
