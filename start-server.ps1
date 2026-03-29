$ErrorActionPreference = 'Stop'

$root = if ($PSScriptRoot) { $PSScriptRoot } else { Split-Path -Parent $PSCommandPath }
$listener = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Loopback, 8080)
$listener.Start()

Write-Host 'PedroTabs disponible sur http://localhost:8080'
Write-Host 'Ajoute tes fichiers .txt dans le dossier tabs puis recharge la page.'
Write-Host 'Arret avec Ctrl + C'

function Get-ContentType($path) {
  switch ([System.IO.Path]::GetExtension($path).ToLowerInvariant()) {
    '.html' { 'text/html; charset=utf-8' }
    '.css'  { 'text/css; charset=utf-8' }
    '.js'   { 'application/javascript; charset=utf-8' }
    '.json' { 'application/json; charset=utf-8' }
    '.webmanifest' { 'application/manifest+json; charset=utf-8' }
    '.txt'  { 'text/plain; charset=utf-8' }
    '.svg'  { 'image/svg+xml' }
    '.png'  { 'image/png' }
    default { 'application/octet-stream' }
  }
}

function Get-AppConfig($root) {
  $configPath = Join-Path $root 'site-config.json'
  if (-not (Test-Path -LiteralPath $configPath -PathType Leaf)) {
    return @{
      features = @{
        remoteImport = $false
      }
    }
  }

  return Get-Content -LiteralPath $configPath -Raw | ConvertFrom-Json
}

function Convert-HtmlToPlainText($text) {
  if ([string]::IsNullOrWhiteSpace($text)) {
    return ''
  }

  $decoded = [System.Net.WebUtility]::HtmlDecode($text)
  $decoded = $decoded -replace '<br\s*/?>', "`n"
  $decoded = $decoded -replace '</p\s*>', "`n"
  $decoded = $decoded -replace '<[^>]+>', ''
  return $decoded.Trim()
}

function Convert-JsonEscapedText($text) {
  if ([string]::IsNullOrWhiteSpace($text)) {
    return ''
  }

  $content = $text
  $content = $content -replace '\\r\\n', "`n"
  $content = $content -replace '\\n', "`n"
  $content = $content -replace '\\r', ''
  $content = $content -replace '\\t', "`t"
  $content = $content -replace '\\"', '"'
  $content = $content -replace '\\/', '/'
  $content = $content -replace '\\\\', '\'
  return [System.Net.WebUtility]::HtmlDecode($content).Trim()
}

function Get-RemoteTabContent($html) {
  $patterns = @(
    '(?is)"content"\s*:\s*"(?<content>(?:\\.|[^"\\]){80,})"',
    '(?is)"wiki_tab"\s*:\s*\{.*?"content"\s*:\s*"(?<content>(?:\\.|[^"\\]){80,})"',
    '(?is)"tab"\s*:\s*\{.*?"content"\s*:\s*"(?<content>(?:\\.|[^"\\]){80,})"',
    '(?is)"lyrics"\s*:\s*"(?<content>(?:\\.|[^"\\]){80,})"',
    '(?is)<pre[^>]*>(?<content>.*?)</pre>',
    '(?is)<code[^>]*>(?<content>.*?)</code>'
  )

  foreach ($pattern in $patterns) {
    $match = [System.Text.RegularExpressions.Regex]::Match($html, $pattern)
    if (-not $match.Success) {
      continue
    }

    $raw = $match.Groups['content'].Value
    if ($pattern.Contains('"content"')) {
      $content = Convert-JsonEscapedText $raw
    }
    else {
      $content = Convert-HtmlToPlainText $raw
    }

    if ($content -match '[\|\-]{3,}' -or $content -match '(?m)^[A-G][#b]?(m|maj7|sus|dim|aug|add)?') {
      return $content
    }
  }

  return $null
}

function Get-SafeRemoteFileName($url, $existingNames) {
  $uri = [System.Uri]$url
  $leaf = [System.IO.Path]::GetFileName($uri.AbsolutePath)
  if ([string]::IsNullOrWhiteSpace($leaf)) {
    $leaf = $uri.Host
  }

  $leaf = [System.IO.Path]::GetFileNameWithoutExtension($leaf).ToLowerInvariant()
  $leaf = ($leaf -replace '[^a-z0-9]+', '-').Trim('-')
  if ([string]::IsNullOrWhiteSpace($leaf)) {
    $leaf = 'remote-tab'
  }

  $baseName = "remote-$leaf"
  $candidate = "$baseName.txt"
  $index = 2
  while ($existingNames.Contains($candidate)) {
    $candidate = "$baseName-$index.txt"
    $index++
  }

  $existingNames.Add($candidate) | Out-Null
  return $candidate
}

function Import-RemoteTabs($root) {
  $configPath = Join-Path $root 'remote-tabs.json'
  if (-not (Test-Path -LiteralPath $configPath -PathType Leaf)) {
    throw 'Fichier remote-tabs.json introuvable.'
  }

  $config = Get-Content -LiteralPath $configPath -Raw | ConvertFrom-Json
  if (-not $config.urls -or $config.urls.Count -eq 0) {
    throw 'Aucune URL dans remote-tabs.json.'
  }

  $tabsPath = Join-Path $root 'tabs'
  $existingNames = [System.Collections.Generic.HashSet[string]]::new([System.StringComparer]::OrdinalIgnoreCase)
  Get-ChildItem -Path $tabsPath -File -Filter '*.txt' | ForEach-Object {
    $existingNames.Add($_.Name) | Out-Null
  }

  $imported = [System.Collections.Generic.List[string]]::new()
  $errors = [System.Collections.Generic.List[string]]::new()

  foreach ($url in $config.urls) {
    try {
      $response = Invoke-WebRequest -Uri $url -Headers @{
        'User-Agent' = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0 Safari/537.36'
        'Accept-Language' = 'fr-FR,fr;q=0.9,en;q=0.8'
      } -TimeoutSec 20 -UseBasicParsing
      $content = Get-RemoteTabContent $response.Content
      if ([string]::IsNullOrWhiteSpace($content)) {
        throw 'Zone tablature introuvable sur cette page.'
      }

      $fileName = Get-SafeRemoteFileName $url $existingNames
      $filePath = Join-Path $tabsPath $fileName
      $header = @(
        "Source: $url"
        ''
      ) -join "`n"
      [System.IO.File]::WriteAllText($filePath, $header + $content, [System.Text.Encoding]::UTF8)
      $imported.Add($fileName) | Out-Null
    }
    catch {
      $errors.Add("${url} -> $($_.Exception.Message)") | Out-Null
    }
  }

  return @{
    imported = $imported
    errors = $errors
  }
}

function Write-HttpResponse($stream, $statusCode, $statusText, $contentType, [byte[]]$bodyBytes) {
  $headerText = @(
    "HTTP/1.1 $statusCode $statusText"
    "Content-Type: $contentType"
    "Content-Length: $($bodyBytes.Length)"
    "Connection: close"
    ""
    ""
  ) -join "`r`n"

  $headerBytes = [System.Text.Encoding]::ASCII.GetBytes($headerText)
  try {
    $stream.Write($headerBytes, 0, $headerBytes.Length)
    $stream.Write($bodyBytes, 0, $bodyBytes.Length)
    $stream.Flush()
    return $true
  }
  catch [System.IO.IOException], [System.ObjectDisposedException], [System.Net.Sockets.SocketException] {
    return $false
  }
}

function Write-TextResponse($stream, $statusCode, $statusText, $body, $contentType = 'text/plain; charset=utf-8') {
  $bodyBytes = [System.Text.Encoding]::UTF8.GetBytes($body)
  Write-HttpResponse $stream $statusCode $statusText $contentType $bodyBytes
}

function Write-FileResponse($stream, $path) {
  $bodyBytes = [System.IO.File]::ReadAllBytes($path)
  Write-HttpResponse $stream 200 'OK' (Get-ContentType $path) $bodyBytes
}

function Read-RequestLine($reader) {
  while ($true) {
    try {
      $line = $reader.ReadLine()
    }
    catch [System.IO.IOException], [System.ObjectDisposedException] {
      return $null
    }

    if ($null -eq $line) {
      return $null
    }

    if ($line.Trim().Length -gt 0) {
      return $line
    }
  }
}

try {
  $appConfig = Get-AppConfig $root

  while ($true) {
    $client = $listener.AcceptTcpClient()
    $client.ReceiveTimeout = 5000
    $client.SendTimeout = 10000

    try {
      $stream = $client.GetStream()
      $stream.ReadTimeout = 5000
      $stream.WriteTimeout = 10000
      $reader = [System.IO.StreamReader]::new($stream, [System.Text.Encoding]::ASCII, $false, 1024, $true)
      $requestLine = Read-RequestLine $reader

      if ($null -eq $requestLine) {
        continue
      }

      try {
        while (($headerLine = $reader.ReadLine()) -ne '') {
          if ($null -eq $headerLine) {
            break
          }
        }
      }
      catch [System.IO.IOException], [System.ObjectDisposedException] {
        continue
      }

      $parts = $requestLine.Split(' ')
      if ($parts.Length -lt 2) {
        Write-TextResponse $stream 400 'Bad Request' 'Requete invalide.'
        continue
      }

      $method = $parts[0]
      $requestPath = [System.Uri]::UnescapeDataString(($parts[1] -split '\?')[0])

      if ($method -ne 'GET') {
        Write-TextResponse $stream 405 'Method Not Allowed' 'Methode non autorisee.'
        continue
      }

      if ($requestPath -eq '/api/tabs') {
        $tabsPath = Join-Path $root 'tabs'
        $tabFiles = Get-ChildItem -Path $tabsPath -Recurse -File -Filter '*.txt' |
          Sort-Object Name |
          ForEach-Object { $_.FullName.Substring($tabsPath.Length + 1).Replace('\', '/') }
        $json = ConvertTo-Json -InputObject @($tabFiles)
        Write-TextResponse $stream 200 'OK' $json 'application/json; charset=utf-8'
        continue
      }

      if ($requestPath -eq '/api/config') {
        $json = $appConfig | ConvertTo-Json -Depth 5
        Write-TextResponse $stream 200 'OK' $json 'application/json; charset=utf-8'
        continue
      }

      if ($requestPath -eq '/api/import-remote') {
        if (-not $appConfig.features.remoteImport) {
          $json = @{ error = 'Import distant desactive dans site-config.json.' } | ConvertTo-Json
          Write-TextResponse $stream 403 'Forbidden' $json 'application/json; charset=utf-8'
          continue
        }

        try {
          $result = Import-RemoteTabs $root
          $statusCode = if ($result.imported.Count -gt 0) { 200 } else { 422 }
          $statusText = if ($result.imported.Count -gt 0) { 'OK' } else { 'Unprocessable Entity' }
          $json = $result | ConvertTo-Json -Depth 5
          Write-TextResponse $stream $statusCode $statusText $json 'application/json; charset=utf-8'
        }
        catch {
          $json = @{ error = $_.Exception.Message } | ConvertTo-Json
          Write-TextResponse $stream 500 'Internal Server Error' $json 'application/json; charset=utf-8'
        }
        continue
      }

      $relativePath = if ($requestPath -eq '/') { 'index.html' } else { $requestPath.TrimStart('/') }
      $safeRelativePath = $relativePath -replace '/', '\'
      $fullPath = Join-Path $root $safeRelativePath
      $resolvedPath = [System.IO.Path]::GetFullPath($fullPath)

      if (-not $resolvedPath.StartsWith($root, [System.StringComparison]::OrdinalIgnoreCase)) {
        Write-TextResponse $stream 403 'Forbidden' 'Acces refuse.'
        continue
      }

      if (-not (Test-Path -LiteralPath $resolvedPath -PathType Leaf)) {
        Write-TextResponse $stream 404 'Not Found' 'Fichier introuvable.'
        continue
      }

      Write-FileResponse $stream $resolvedPath
    }
    finally {
      if ($reader) {
        $reader.Dispose()
      }

      if ($stream) {
        $stream.Dispose()
      }

      $client.Dispose()
      $reader = $null
      $stream = $null
    }
  }
}
finally {
  $listener.Stop()
}
