$ErrorActionPreference = 'Stop'
$projectRoot = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot '../..'))
$postgresRoot = Join-Path $projectRoot '.runtime/postgresql'
$pgCtl = Join-Path $postgresRoot 'pgsql/bin/pg_ctl.exe'
$dataPath = Join-Path $postgresRoot 'data'
$logPath = Join-Path $postgresRoot 'postgres.log'
if (-not (Test-Path -LiteralPath $pgCtl) -or -not (Test-Path -LiteralPath (Join-Path $dataPath 'PG_VERSION'))) {
    throw 'The project-local PostgreSQL instance has not been initialized.'
}
& $pgCtl status -D $dataPath *> $null
if ($LASTEXITCODE -eq 0) {
    Write-Output 'TradeWise PostgreSQL is already running on 127.0.0.1:5432.'
    exit 0
}
$startArgs = @('start', '-D', "`"$dataPath`"", '-l', "`"$logPath`"", '-w', '-t', '30')
$process = Start-Process -FilePath $pgCtl -ArgumentList $startArgs -WindowStyle Hidden -PassThru
$process.WaitForExit()
if ($process.ExitCode -ne 0) {
    throw "PostgreSQL failed to start. Check $logPath"
}
Write-Output 'TradeWise PostgreSQL is running on 127.0.0.1:5432.'
