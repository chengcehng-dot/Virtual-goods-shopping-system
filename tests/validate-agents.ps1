$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent $PSScriptRoot
$agentsPath = Join-Path $repoRoot "AGENTS.md"

function ConvertFrom-HexString {
    param([Parameter(Mandatory = $true)][string]$Hex)

    return [byte[]]($Hex -split "-" | ForEach-Object {
        [Convert]::ToByte($_, 16)
    })
}

function Test-ContainsBytes {
    param(
        [Parameter(Mandatory = $true)][byte[]]$Bytes,
        [Parameter(Mandatory = $true)][byte[]]$Needle
    )

    if ($Needle.Length -eq 0 -or $Bytes.Length -lt $Needle.Length) {
        return $false
    }

    for ($i = 0; $i -le ($Bytes.Length - $Needle.Length); $i++) {
        $matched = $true
        for ($j = 0; $j -lt $Needle.Length; $j++) {
            if ($Bytes[$i + $j] -ne $Needle[$j]) {
                $matched = $false
                break
            }
        }

        if ($matched) {
            return $true
        }
    }

    return $false
}

if (-not (Test-Path -LiteralPath $agentsPath)) {
    Write-Error "AGENTS.md does not exist."
}

$contentBytes = [IO.File]::ReadAllBytes($agentsPath)
$requiredRuleBytes = @(
    (ConvertFrom-HexString "31-2E-20-E6-AF-8F-E5-AE-8C-E6-88-90-E4-B8-80-E6-AC-A1-E4-BB-A3-E7-A0-81-E6-94-B9-E5-8A-A8-EF-BC-8C-E5-BF-85-E9-A1-BB-E7-94-9F-E6-88-90-E5-AF-B9-E5-BA-94-E7-9A-84-20-47-69-74-20-63-6F-6D-6D-69-74-EF-BC-8C-E6-96-B9-E4-BE-BF-E8-BF-BD-E8-B8-AA-E6-94-B9-E5-8A-A8-E3-80-81-E5-9B-9E-E6-BB-9A-E4-BB-A3-E7-A0-81-E3-80-82"),
    (ConvertFrom-HexString "32-2E-20-E6-AF-8F-E6-AC-A1-E6-94-B9-E5-8A-A8-EF-BC-8C-E9-9C-80-E8-A6-81-E6-96-B0-E5-A2-9E-2F-E6-9B-B4-E6-96-B0-E7-9B-B8-E5-85-B3-E6-B5-8B-E8-AF-95-EF-BC-9B-E4-BA-A4-E4-BB-98-E7-94-A8-E6-88-B7-E5-89-8D-EF-BC-8C-E5-85-A8-E9-83-A8-E6-B5-8B-E8-AF-95-E3-80-81-E9-AA-8C-E8-AF-81-E9-83-BD-E8-A6-81-E9-80-9A-E8-BF-87-E3-80-82")
)

foreach ($requiredRule in $requiredRuleBytes) {
    if (-not (Test-ContainsBytes -Bytes $contentBytes -Needle $requiredRule)) {
        Write-Error "AGENTS.md is missing a required rule."
    }
}

Write-Host "AGENTS.md validation passed."
